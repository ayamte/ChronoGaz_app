// components/StepsIndicator.jsx
import React from 'react';

const StepsIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Quantité' },
    { number: 2, label: 'Adresse' },
    { number: 3, label: 'Récapitulatif' }
  ];

  return (
    <div className="bg-white shadow-sm p-4">
      <div className="flex justify-center space-x-8">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                currentStep >= step.number ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              style={{backgroundColor: currentStep >= step.number ? '#1F55A3' : '#d1d5db'}}
            >
              {step.number}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsIndicator;
