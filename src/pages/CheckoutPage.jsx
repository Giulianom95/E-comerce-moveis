import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard as CreditCardIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import PersonalInfoForm from '@/components/checkout/PersonalInfoForm';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabaseClient';


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #ced4da",
      borderRadius: "0.25rem",
      padding: "0.75rem 1rem",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};


const PaymentFormStripe = ({ totalPrice, onPaymentSuccess, onPaymentError, processing, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setProcessing(true);

    try {
      // This is a placeholder for creating a PaymentIntent on your backend
      // In a real app, you would call your backend here to create a PaymentIntent
      // and get the clientSecret.
      // For client-only checkout, this step is different.
      // We'll simulate a client-side payment confirmation for now.
      // IMPORTANT: For real payments, you MUST use Stripe's recommended server-side flow
      // or ensure your client-only checkout is correctly configured for security.
      
      // Example: Create a payment intent (server-side)
      // const response = await fetch('/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount: Math.round(totalPrice * 100) }) // amount in cents
      // });
      // const { clientSecret } = await response.json();

      // For this example, let's assume clientSecret is obtained or not needed for a specific flow
      // For client-only checkout, you might redirect to Stripe Checkout page or use Payment Element
      
      // Using CardElement for direct card input (requires careful PCI compliance handling or server-side tokenization)
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error(error);
        onPaymentError(error.message);
      } else {
        console.log('PaymentMethod:', paymentMethod);
        // Here you would typically send paymentMethod.id to your server to confirm the payment
        // For client-only, this might involve redirecting or using Stripe's client-side confirmation
        onPaymentSuccess({ id: paymentMethod.id, amount: totalPrice }); // Simulate success
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      onPaymentError("Ocorreu um erro ao processar o pagamento.");
    } finally {
      setProcessing(false);
    }
  };
  
  // Placeholder for PIX and Boleto - these usually require server-side generation or redirect to Stripe hosted pages
  const handlePixPayment = () => {
    toast({ title: "PIX em breve!", description: "Pagamento com PIX estará disponível em breve."});
  }
  const handleBoletoPayment = () => {
     toast({ title: "Boleto em breve!", description: "Pagamento com Boleto estará disponível em breve."});
  }


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h2>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cartão de Crédito/Débito
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Button onClick={handlePixPayment} variant="outline" className="w-full py-3 text-lg">Pagar com PIX</Button>
        <Button onClick={handleBoletoPayment} variant="outline" className="w-full py-3 text-lg">Pagar com Boleto</Button>
      </div>
      
      {/* The main submit button for card payments is handled by the parent form's "Finalizar Pedido" button */}
      {/* This form is part of a multi-step checkout */}
    </motion.div>
  );
};


const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: profile.full_name ? profile.full_name.split(' ')[0] : '',
        lastName: profile.full_name ? profile.full_name.split(' ').slice(1).join(' ') : '',
        cpf: profile.cpf || '',
        // You might want to fetch saved address if available
      }));
    }
  }, [user, profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Add validation for current step if needed
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const stripe = useStripe();
  const elements = useElements();

  const handleFinalSubmit = async () => {
    if (currentStep !== 3) return; // Only submit on payment step
    if (!stripe || !elements) {
      toast({ title: "Erro", description: "Stripe não carregado.", variant: "destructive" });
      return;
    }

    setProcessingPayment(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
       toast({ title: "Erro", description: "Elemento do cartão não encontrado.", variant: "destructive" });
       setProcessingPayment(false);
       return;
    }

    try {
      // In a real app, you'd create a PaymentIntent on your server here.
      // For this example, we'll simulate this.
      // const response = await fetch('/.netlify/functions/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     amount: Math.round(getTotalPrice() * 100),
      //     currency: 'brl',
      //     receipt_email: formData.email,
      //     description: `Pedido DormeBem - ${items.length} itens`,
      //     shipping: {
      //       name: `${formData.firstName} ${formData.lastName}`,
      //       address: {
      //         line1: `${formData.street}, ${formData.number}`,
      //         postal_code: formData.zipCode,
      //         city: formData.city,
      //         state: formData.state,
      //         country: 'BR',
      //       }
      //     }
      //   }),
      // });
      // const { clientSecret, error: intentError } = await response.json();

      // if (intentError) {
      //   throw new Error(intentError.message);
      // }
      
      // This is a placeholder client_secret. Replace with actual server-generated secret.
      const simulatedClientSecret = "pi_example_secret_replace_this"; 
      
      // For demonstration, we'll use a test card payment method creation and confirmation.
      // This is NOT a production-ready flow for client-only.
      // Production client-only usually involves redirecting to Stripe Checkout or using Payment Element with server-side intent.
      
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: `${formData.street}, ${formData.number}`,
            postal_code: formData.zipCode,
            city: formData.city,
            state: formData.state,
            country: 'BR',
          }
        },
      });

      if (paymentMethodError) {
        throw paymentMethodError;
      }

      // Simulate payment confirmation (in real app, use stripe.confirmCardPayment with clientSecret)
      console.log("PaymentMethod created:", paymentMethod);
      // const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      //   simulatedClientSecret, // Replace with actual clientSecret from your server
      //   { payment_method: paymentMethod.id }
      // );

      // if (confirmError) {
      //   throw confirmError;
      // }
      
      // console.log("PaymentIntent:", paymentIntent);
      // if (paymentIntent.status === 'succeeded') {
      //   await handlePaymentSuccess({ id: paymentIntent.id, amount: getTotalPrice() });
      // } else {
      //   throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      // }

      // SIMULATED SUCCESS FOR NOW
      await handlePaymentSuccess({ id: paymentMethod.id, amount: getTotalPrice() });

    } catch (error) {
      console.error("Payment submission error:", error);
      toast({ title: "Erro no Pagamento", description: error.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setProcessingPayment(false);
    }
  };


  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // 1. Save order to your database
      const orderData = {
        user_id: user.id,
        total_amount: paymentResult.amount,
        status: 'completed', // Or 'processing'
        items: items.map(item => ({ 
          product_id: item.id, 
          quantity: item.quantity, 
          price_at_purchase: item.price 
        })),
        shipping_address: {
          firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone,
          zipCode: formData.zipCode, street: formData.street, number: formData.number, complement: formData.complement,
          neighborhood: formData.neighborhood, city: formData.city, state: formData.state,
        },
        payment_intent_id: paymentResult.id, // Stripe PaymentIntent ID
        created_at: new Date().toISOString(),
      };

      const { error: orderError } = await supabase.from('orders').insert([orderData]);
      if (orderError) throw orderError;

      // 2. Clear cart
      clearCart();
      
      // 3. Show success message / page
      setOrderComplete(true);
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Você receberá um email com os detalhes.",
        className: "bg-green-500 text-white",
      });
      // Optional: navigate to an order confirmation page after a delay
      // setTimeout(() => navigate('/meus-pedidos'), 3000);

    } catch (dbError) {
      console.error("Error saving order:", dbError);
      toast({
        title: "Erro ao salvar pedido",
        description: "Seu pagamento foi processado, mas houve um erro ao salvar os detalhes do pedido. Contate o suporte.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast({
      title: "Erro no Pagamento",
      description: errorMessage || "Por favor, verifique os dados do seu cartão e tente novamente.",
      variant: "destructive",
    });
  };


  if (items.length === 0 && !orderComplete) {
    navigate('/carrinho');
    return null;
  }
  
  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pedido Confirmado!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Obrigado por comprar na DormeBem! Seu pedido foi processado com sucesso. <br/>
            Um email de confirmação foi enviado para {formData.email}.
          </p>
          <Button size="lg" onClick={() => navigate('/')} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
            Continuar Comprando
          </Button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/carrinho')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 mx-auto lg:mx-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Carrinho
          </Button>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Finalizar</span> Compra
          </h1>
        </motion.div>

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Form content based on currentStep */}
              {currentStep === 1 && (
                <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />
              )}
              {currentStep === 2 && (
                <AddressForm formData={formData} handleInputChange={handleInputChange} />
              )}
              {currentStep === 3 && (
                <PaymentFormStripe 
                  totalPrice={getTotalPrice()} 
                  onPaymentSuccess={handlePaymentSuccess} 
                  onPaymentError={handlePaymentError}
                  processing={processingPayment}
                  setProcessing={setProcessingPayment}
                />
              )}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || processingPayment}
                >
                  Anterior
                </Button>
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={processingPayment}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="button" // Changed from submit to button, Stripe form has its own submission logic
                    onClick={handleFinalSubmit} // This will trigger Stripe submission
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={processingPayment || !stripe || !elements}
                  >
                    {processingPayment ? 'Processando...' : 'Finalizar Pedido'}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          <OrderSummary items={items} totalPrice={getTotalPrice()} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;