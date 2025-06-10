import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import AdminPage from '@/pages/AdminPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import ChatWidget from '@/components/ChatWidget';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Add your Stripe publishable key here
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');


function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/produtos" element={<ProductsPage />} />
                    <Route path="/produto/:id" element={<ProductDetailPage />} />
                    <Route path="/carrinho" element={<CartPage />} />
                    <Route 
                      path="/checkout" 
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cadastro" element={<SignUpPage />} />
                    <Route 
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
                <ChatWidget />
              </div>
            </Router>
          </Elements>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;