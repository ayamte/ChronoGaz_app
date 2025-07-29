// components/ProductDetailModal.jsx
import React from 'react';
import { X, Info } from 'lucide-react';

const ProductDetailModal = ({ product, prices, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900">Détails du produit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image et informations principales */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-xl shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-tr from-blue-400 to-cyan-400 mx-auto">
                <img
                  src={product.image_url}
                  alt={product.nom_court}
                  className="max-h-full max-w-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-blue-900 mb-2">
                  {product.nom_long || product.nom_court}
                </h3>
                <p className="text-xl text-blue-700 font-semibold">
                  {prices[product.id]} DH
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Référence</span>
                  <p className="text-lg font-semibold text-gray-900">{product.reference}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Type de gaz</span>
                  <p className="text-lg font-semibold text-gray-900">{product.type_gaz}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Capacité</span>
                  <p className="text-lg font-semibold text-gray-900">{product.capacite} kg</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Marque</span>
                  <p className="text-lg font-semibold text-gray-900">{product.marque}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Gamme</h4>
              <p className="text-blue-800">{product.gamme}</p>
            </div>

            {product.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Informations techniques */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Informations techniques</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.poids_vide && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Poids à vide</span>
                    <p className="text-gray-900 font-semibold">{product.poids_vide} kg</p>
                  </div>
                )}
                
                {product.poids_plein && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Poids plein</span>
                    <p className="text-gray-900 font-semibold">{product.poids_plein} kg</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Disponibilité</span>
                  <p className={`font-semibold ${product.actif ? 'text-green-600' : 'text-red-600'}`}>
                    {product.actif ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
                
                {product.category_id && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Catégorie ID</span>
                    <p className="text-gray-900 font-semibold">{product.category_id}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            {(product.created_at || product.updated_at) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Informations système</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.created_at && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Créé le</span>
                      <p className="text-gray-900">{new Date(product.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  
                  {product.updated_at && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Modifié le</span>
                      <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;