import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext'; // Assuming you have this for delete/edit

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const { deleteProduct } = useProducts(); // You'll need to implement this in ProductContext

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      await deleteProduct(product.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to an edit page or open a modal
    // For now, let's log to console
    console.log("Edit product:", product.id);
    // Example: navigate(`/admin/edit-product/${product.id}`);
  };
  
  const imageUrl = product.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVybml0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";


  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
        className="product-card bg-white rounded-2xl overflow-hidden p-4 sm:p-6"
        layout
      >
        <Link to={`/produto/${product.id}`} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-40 h-40 sm:h-auto rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img  
              className="w-full h-full object-cover"
              alt={product.name}
             src={imageUrl} />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{product.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-xs sm:text-sm">({product.rating || 0})</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  ou 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                {isAdmin && (
                  <>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
      className="product-card bg-white rounded-2xl overflow-hidden group flex flex-col h-full"
      layout
    >
      <Link to={`/produto/${product.id}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gray-100">
            <img  
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              alt={product.name}
             src={imageUrl} />
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white hover:bg-gray-100 shadow-md"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Add to wishlist logic */ }}
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 shadow-md"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                Destaque
              </span>
            </div>
          )}
           {isAdmin && (
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                onClick={handleEdit}
                variant="secondary"
                size="icon"
                className="bg-white/80 hover:bg-white w-8 h-8"
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="secondary"
                size="icon"
                className="bg-white/80 hover:bg-white w-8 h-8"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-6 space-y-2 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 flex-grow">{product.description}</p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-xs sm:text-sm">({product.rating || 0})</span>
          </div>
          
          <div className="space-y-1 pt-1 mt-auto">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              ou 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;