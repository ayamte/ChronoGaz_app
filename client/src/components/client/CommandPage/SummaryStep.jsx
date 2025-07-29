import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const SummaryStep = ({ orderData, onBack, onConfirm }) => {
  const { products, quantities, prices, deliveryFee, subtotal, total } = orderData;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Résumé de la commande</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-4">Produits commandés:</h3>
          {products.filter(product => quantities[product.id] > 0).map(product => (
            <div key={product.id} className="flex justify-between items-center py-2 border-b">
              <span>{product.marque} {product.capacite}kg ({product.type_gaz})</span>
              <div className="text-right">
                <span className="font-medium">
                  {quantities[product.id]} × {prices[product.id]} DH = {quantities[product.id] * prices[product.id]} DH
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between py-2">
            <span>Sous-total:</span>
            <span className="font-medium">{subtotal} DH</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Frais de livraison:</span>
            <span className="font-medium">{deliveryFee} DH</span>
          </div>
          <div className="flex justify-between py-2 text-xl font-bold border-t">
            <span>Total:</span>
            <span>{total} DH</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Adresse de livraison:</h3>
          {orderData.useGPS ? (
            <p className="text-gray-600">Position GPS: {orderData.gpsLocation?.latitude}, {orderData.gpsLocation?.longitude}</p>
          ) : (
            <div className="text-gray-600">
              <p>{orderData.address.region}</p>
              <p>{orderData.address.fullAddress}</p>
              <p>{orderData.address.phone}</p>
              {orderData.address.instructions && <p className="italic">{orderData.address.instructions}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          onClick={onConfirm}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Confirmer la commande
        </button>
      </div>
    </div>
  );
};


export default SummaryStep;