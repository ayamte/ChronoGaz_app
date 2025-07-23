// components/QuantityStep.jsx
import React from 'react';
import GasCard from './GasCard';
import butaButane from '../../../src/assets/buta-gaz-butane.svg';
import butaPropane from '../../../src/assets/buta-gaz-propane.svg';


const QuantityStep = ({ 
  propaneQuantity, 
  butaneQuantity, 
  propanePrice, 
  butanePrice, 
  onQuantityChange, 
  onNext, 
  canProceed 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{color: '#1F55A3'}}>
        1) Choisissez la quantité de votre type de gaz
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <GasCard
          title="Bouteille Propane"
          weight="34kg"
          price={propanePrice}
          quantity={propaneQuantity}
          onQuantityChange={(operation) => onQuantityChange('propane', operation)}
          imageUrl={butaPropane}
        />
        
        <GasCard
          title="Bouteille Butane"
          weight="12kg"
          price={butanePrice}
          quantity={butaneQuantity}
          onQuantityChange={(operation) => onQuantityChange('butane', operation)}
          imageUrl={butaButane}
        />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
            canProceed 
              ? 'hover:opacity-80 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{backgroundColor: canProceed ? '#1F55A3' : '#9ca3af'}}
        >
          Continuer vers l'adresse
        </button>
      </div>
    </div>
  );
};

export default QuantityStep;
