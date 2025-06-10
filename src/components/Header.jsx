import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, Home, Package, BedDouble, User, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const menuItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Produtos', path: '/produtos', icon: Package },
  ];

  if (!authLoading && isAdmin) {
    menuItems.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
  }

  const handleSignOut = async () => {
    setIsMenuOpen(false); 
    try {
      await signOut();
      // The navigation should ideally happen after the state update from onAuthStateChange
      // or if signOut itself guarantees state clearance before resolving.
      // For a more immediate feel, navigate, but be aware state might not be fully cleared yet.
      // AuthContext's onAuthStateChange should handle final state cleanup.
      navigate('/'); 
    } catch (error) {
      console.error("Error during sign out:", error);
      // Handle error (e.g., show a toast) if necessary
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center"
            >
              <BedDouble className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">DormeBem</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/carrinho')}
                className="relative hover:bg-pink-50 border-pink-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 cart-badge text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {authLoading ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
            ) : user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="hover:bg-pink-50 text-pink-600"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/login')}
                  className="hover:bg-pink-50 text-pink-600"
                  title="Login"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar colchões, camas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-pink-50"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <hr className="my-2 border-gray-200"/>

              {authLoading ? (
                 <div className="flex items-center justify-center py-2">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
                 </div>
              ) : user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-pink-50 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-pink-50"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-pink-50"
                  >
                    <User className="w-5 h-5" />
                    <span>Cadastrar</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;