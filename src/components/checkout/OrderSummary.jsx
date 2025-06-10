import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const OrderSummary = ({ items, totalPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
        
        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <img  
                  className="w-10 h-10 object-cover rounded"
                  alt={item.name}
                 src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
              </div>
              <span className="font-semibold">
                R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Frete</span>
            <span className="text-green-600 font-semibold">Grátis</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <Check className="w-4 h-4" />
            <span>Compra Segura</span>
          </div>
          <p className="text-sm text-green-600">
            Seus dados estão protegidos com criptografia SSL de 256 bits.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;