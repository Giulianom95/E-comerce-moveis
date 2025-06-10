import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, Truck, Shield, CreditCard, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0); // Assuming product.images is an array if multiple images
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct);

      if (foundProduct) {
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id, products, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erro: {error}</div>;
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Button onClick={() => navigate('/produtos')}>
            Voltar aos Produtos
          </Button>
        </div>
      </div>
    );
  }
  
  const imageUrl = product.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVybml0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
  // Assuming product.images is an array of image URLs if you have multiple images.
  // For now, using the single product.image_url for all thumbnails as a placeholder.
  const productImages = product.images || [imageUrl, imageUrl, imageUrl, imageUrl];


  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const features = [
    { icon: Truck, text: 'Entrega grátis acima de R$ 500' },
    { icon: Shield, text: '2 anos de garantia' },
    { icon: CreditCard, text: 'Parcele em até 12x sem juros' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img  
                className="w-full h-full object-cover"
                alt={product.name}
               src={productImages[selectedImage]} />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img  
                    className="w-full h-full object-cover"
                    alt={`${product.name} - Imagem ${index + 1}`}
                   src={imgUrl} />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({product.rating || 0})</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-green-600">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-gray-600">ou 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</p>
            </div>

            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Quantidade:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-base lg:text-lg"
                >
                  Adicionar ao Carrinho
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-4 ${isFavorite ? 'text-red-500 border-red-500 bg-red-50' : 'hover:bg-gray-100'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg" className="px-4 hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Detalhes</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><span className="font-medium text-gray-700">Categoria:</span> {product.category}</li>
                <li><span className="font-medium text-gray-700">SKU Interno:</span> {product.internal_sku || 'N/A'}</li>
                <li><span className="font-medium text-gray-700">Estoque:</span> {product.stock_quantity > 0 ? `${product.stock_quantity} unidades` : 'Indisponível'}</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Produtos <span className="gradient-text">Relacionados</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProd, index) => (
                <motion.div
                  key={relatedProd.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProd} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;