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
import { Toaster } from 'react-hot-toast';

// Error Boundary para capturar erros globais
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', textAlign: 'center' }}>
          <h1 style={{ color: '#dc2626', fontSize: 24, marginBottom: 16 }}>⚠️ Erro ao carregar a aplicação</h1>
          <p style={{ color: '#374151', marginBottom: 16 }}>Ocorreu um erro inesperado.<br/>Verifique o console do navegador para detalhes.<br/>Se persistir, confira as variáveis de ambiente no painel da Vercel.</p>
          <button onClick={() => window.location.reload()} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>Recarregar</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loading das páginas
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignUpPage = React.lazy(() => import('@/pages/SignUpPage'));
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));

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