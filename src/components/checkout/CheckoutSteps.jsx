import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, CreditCard } from 'lucide-react';

const stepsData = [
  { id: 1, title: 'Dados Pessoais', icon: User },
  { id: 2, title: 'Endereço', icon: MapPin },
  { id: 3, title: 'Pagamento', icon: CreditCard }
];

const CheckoutSteps = ({ currentStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex justify-center mb-12"
    >
      <div className="flex items-center space-x-2 sm:space-x-4">
        {stepsData.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`checkout-step rounded-full p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${
              currentStep >= step.id ? 'active' : ''
            }`}>
              <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold hidden sm:block text-xs sm:text-sm">{step.title}</span>
            </div>
            {index < stepsData.length - 1 && (
              <div className={`w-4 sm:w-8 h-0.5 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default CheckoutSteps;