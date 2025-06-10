import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import ChatWidget from '@/components/ChatWidget';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { ConnectionError } from '@/components/ConnectionError';

// Lazy loading das páginas
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignUpPage = React.lazy(() => import('@/pages/SignUpPage'));
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));

// Componente de diagnóstico
const DevTools = () => {
  if (import.meta.env.PROD) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-4 rounded-lg opacity-75 hover:opacity-100 transition-opacity text-sm">
      <h3 className="font-bold mb-2">Dev Diagnostics</h3>
      <div>
        <p>ENV: {import.meta.env.MODE}</p>
        <p>Base URL: {import.meta.env.BASE_URL}</p>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</p>
        <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-screen">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando...</p>
                      </div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/produtos" element={<ProductsPage />} />
                      <Route path="/produto/:id" element={<ProductDetailPage />} />
                      <Route path="/carrinho" element={<CartPage />} />
                      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/cadastro" element={<SignUpPage />} />
                      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <ConnectionError />
                <DevTools />
                <Toaster />
                <ChatWidget />
              </div>
            </Router>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;