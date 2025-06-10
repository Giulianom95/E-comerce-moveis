import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, CreditCard, Users, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/data/products';

const HomePage = () => {
  const featuredProducts = getFeaturedProducts();

  const features = [
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Receba seu conforto em poucos dias.'
    },
    {
      icon: Shield,
      title: 'Garantia Estendida',
      description: 'Até 10 anos de garantia em colchões.'
    },
    {
      icon: CreditCard,
      title: 'Pagamento Facilitado',
      description: 'Parcele em até 12x sem juros.'
    },
    {
      icon: Users,
      title: 'Consultores do Sono',
      description: 'Especialistas para te ajudar a escolher.'
    }
  ];

  const categories = [
    {
      name: 'Colchões',
      image: 'Comfortable mattress with soft pillows',
      count: '50+ modelos'
    },
    {
      name: 'Camas Box',
      image: 'Modern bed box frame',
      count: '30+ opções'
    },
    {
      name: 'Travesseiros',
      image: 'Variety of ergonomic pillows',
      count: '40+ tipos'
    },
    {
      name: 'Cabeceiras',
      image: 'Stylish bed headboard',
      count: '20+ designs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-orange-500 to-yellow-400 text-white">
        <div className="absolute inset-0 hero-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Seu Sono Perfeito
                <span className="block text-yellow-300">Começa Aqui</span>
              </h1>
              <p className="text-xl lg:text-2xl text-pink-100 leading-relaxed">
                Descubra colchões, camas e acessórios com tecnologia e conforto para noites incríveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-8 py-4 rounded-full font-semibold shadow-lg"
                >
                  <Link to="/produtos">
                    Ver Produtos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-pink-600 text-lg px-8 py-4 rounded-full font-semibold shadow-lg"
                >
                  Nossas Lojas
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="floating-animation">
                <img  
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  alt="Quarto aconchegante com cama confortável e iluminação suave"
                 src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher a <span className="gradient-text">DormeBem</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos a melhor experiência para seu descanso com produtos de alta qualidade e atendimento especializado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Nossas <span className="gradient-text">Categorias</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre o produto ideal para suas noites de sono.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="category-card rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img  
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={`Categoria ${category.name}`}
                   src="https://images.unsplash.com/photo-1580480055273-228ff53a22d7" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
                    {category.count}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Produtos em <span className="gradient-text">Destaque</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os favoritos dos nossos clientes para um sono reparador.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md"
            >
              <Link to="/produtos">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-pink-600 via-orange-500 to-yellow-400 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Milhares de noites bem dormidas e clientes satisfeitos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Carla M.',
                text: 'Melhor colchão que já tive! Minhas dores nas costas sumiram.',
                rating: 5
              },
              {
                name: 'Roberto P.',
                text: 'Atendimento nota 10 e entrega super rápida. Recomendo a DormeBem!',
                rating: 5
              },
              {
                name: 'Sofia L.',
                text: 'Produtos de altíssima qualidade. Vale cada centavo!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;