import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import PersonalInfoForm from '@/components/checkout/PersonalInfoForm';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { supabase } from '@/lib/supabaseClient';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        // You might want to fetch saved address if available
      }));
    }
  }, [user]);

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
  
  // Criar pedido no Supabase antes da integração com Mercado Pago
  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      
      // Criar o pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: getTotalPrice(),
            shipping_address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone
            },
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Criar os itens do pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // TODO: Implementar integração com Mercado Pago aqui
      toast({
        title: "Pedido criado!",
        description: "Integração com Mercado Pago será implementada em breve.",
        variant: "default"
      });

      // Por enquanto, simular sucesso após criação do pedido
      setOrderCompleted(true);
      clearCart();
    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
      setProcessingPayment(false);
    }
  };

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
            <Button onClick={() => navigate('/produtos')}>Continuar Comprando</Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Pedido Confirmado!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Obrigado por comprar conosco! Seu pedido foi processado com sucesso.
              {formData.email && <br/>}
              {formData.email && `Um email de confirmação foi enviado para ${formData.email}.`}
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/produtos')} 
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              Continuar Comprando
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
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
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h2>
                  <p className="text-gray-600">
                    Integração com Mercado Pago será implementada em breve.
                  </p>
                  <Button 
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {processingPayment ? "Processando..." : "Finalizar Compra"}
                  </Button>
                </div>
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
                    disabled={processingPayment}
                  >
                    Próximo
                  </Button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>

          <OrderSummary items={items} totalPrice={getTotalPrice()} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;