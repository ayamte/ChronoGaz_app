// components/QuantityStep.jsx
import React, { useState } from 'react';
import GasCard from './GasCard';
import ProductDetailModal from './ProductDetailModal';

const QuantityStep = ({ products, quantities, prices, onQuantityChange, onNext, canProceed }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Choisissez vos produits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map(product => (
          <GasCard
            key={product.id}
            productId={product.id}
            title={`${product.marque} ${product.capacite}kg`}
            weight={`${product.type_gaz} ${product.capacite}kg`}
            price={prices[product.id]}
            quantity={quantities[product.id] || 0}
            onQuantityChange={onQuantityChange}
            gamme={product.gamme}
            imageUrl={product.image_url}
            actif={product.actif}
            product={product}
            onShowDetails={handleShowDetails}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            canProceed
              ? 'bg-blue-700 text-white hover:bg-blue-800'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          Continuer vers l'adresse
        </button>
      </div>

      {/* Modal des détails du produit */}
      <ProductDetailModal
        product={selectedProduct}
        prices={prices}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default QuantityStep;