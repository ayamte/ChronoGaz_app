import { MapPin, Phone, Eye } from 'lucide-react';
import React from 'react';
import DriverInfo from '../OrderHistoryPage/DriverInfo';
import StatusBadge from '../OrderHistoryPage/StatusBadge';



const OrderCard = ({ order }) => {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Header de la carte */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold" style={{color: '#1F55A3'}}>
                {order.id}
              </h3>
              <p className="text-gray-600 text-sm">
                {formatDate(order.date)} à {order.time}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <StatusBadge status={order.status} />
              <span className="text-xl font-bold" style={{color: '#1F55A3'}}>
                {order.total} DH
              </span>
            </div>
          </div>
        </div>
  
        {/* Corps de la carte */}
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Items de la commande */}
            <div>
              <h4 className="font-semibold mb-3" style={{color: '#245FA6'}}>
                Articles commandés
              </h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">{item.price} DH</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-700">Frais de livraison</span>
                  <span className="font-medium">{order.deliveryFee} DH</span>
                </div>
              </div>
            </div>
  
            {/* Informations du livreur */}
            <DriverInfo driver={order.driver} driverPhone={order.driverPhone} />
          </div>
  
          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>Livraison à domicile</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {order.status === 'en_cours' || order.status === 'en_route' ? (
                <button 
                  className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-80 transition-opacity"
                  style={{backgroundColor: '#4DAEBD'}}
                >
                  <Eye size={16} className="inline mr-2" />
                  Suivre
                </button>
              ) : null}
              
              {order.driver && (order.status === 'en_cours') && (
                <button 
                  className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-80 transition-opacity"
                  style={{backgroundColor: '#1F55A3'}}
                  onClick={() => window.open(`tel:${order.driverPhone}`)}
                >
                  <Phone size={16} className="inline mr-2" />
                  Appeler
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
export default OrderCard;  