import React from 'react';
import { motion } from 'framer-motion';

const PaymentForm = ({ formData, handleInputChange, totalPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h2>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Número do Cartão
        </label>
        <input
          id="cardNumber"
          type="text"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome no Cartão
        </label>
        <input
          id="cardName"
          type="text"
          value={formData.cardName}
          onChange={(e) => handleInputChange('cardName', e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
            Validade
          </label>
          <input
            id="expiryDate"
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            placeholder="MM/AA"
            required
          />
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            value={formData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            placeholder="123"
            maxLength="4"
            required
          />
        </div>
        <div>
          <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-2">
            Parcelas
          </label>
          <select
            id="installments"
            value={formData.installments}
            onChange={(e) => handleInputChange('installments', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg bg-white"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}x de R$ {(totalPrice / (i + 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentForm;