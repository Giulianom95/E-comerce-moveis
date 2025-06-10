import React from 'react';
import { motion } from 'framer-motion';

const AddressForm = ({ formData, handleInputChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Endereço de Entrega</h2>
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
          CEP
        </label>
        <input
          id="zipCode"
          type="text"
          value={formData.zipCode}
          onChange={(e) => handleInputChange('zipCode', e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg"
          placeholder="XXXXX-XXX"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
            Rua
          </label>
          <input
            id="street"
            type="text"
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
            Número
          </label>
          <input
            id="number"
            type="text"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">
          Complemento
        </label>
        <input
          id="complement"
          type="text"
          value={formData.complement}
          onChange={(e) => handleInputChange('complement', e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
            Bairro
          </label>
          <input
            id="neighborhood"
            type="text"
            value={formData.neighborhood}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <input
            id="state"
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="form-input w-full px-4 py-3 rounded-lg"
            maxLength="2"
            placeholder="UF"
            required
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AddressForm;