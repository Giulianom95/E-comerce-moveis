import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Navegação',
      links: [
        { name: 'Início', path: '/' },
        { name: 'Produtos', path: '/produtos' },
        { name: 'Sobre Nós', path: '/sobre' },
        { name: 'Contato', path: '/contato' }
      ]
    },
    {
      title: 'Categorias Populares',
      links: [
        { name: 'Colchões Casal', path: '/produtos?categoria=colchoes-casal' },
        { name: 'Camas Box', path: '/produtos?categoria=camas-box' },
        { name: 'Travesseiros', path: '/produtos?categoria=travesseiros' },
        { name: 'Cabeceiras', path: '/produtos?categoria=cabeceiras' }
      ]
    },
    {
      title: 'Atendimento',
      links: [
        { name: 'Central de Ajuda', path: '/ajuda' },
        { name: 'Política de Troca', path: '/trocas' },
        { name: 'Entrega', path: '/entrega' },
        { name: 'Garantia do Sono', path: '/garantia' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-pink-900 to-orange-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-lg flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">DormeBem</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Sua noite de sono perfeita começa aqui. Colchões, camas e acessórios com a melhor qualidade.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>(11) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>contato@dormebem.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Loja Online - Todo Brasil</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <span className="text-lg font-semibold text-white">{section.title}</span>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          
          <div className="text-center md:text-right text-gray-400">
            <p>&copy; {new Date().getFullYear()} DormeBem. Todos os direitos reservados.</p>
            <p className="text-sm mt-1">Tecnologia para seu descanso perfeito.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;