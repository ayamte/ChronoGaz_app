// components/OrderDetailsModal.js
import React from 'react';
import {
  MdClose as X,
  MdDescription as ClipboardList,
  MdPerson as User,
  MdCalendarToday as Calendar,
  MdInventory as Package,
  MdHistory as History
} from 'react-icons/md';

const OrderDetailsModal = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'En attente',
      assigned: 'Assignée',
      in_progress: 'En cours',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-xl outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t-lg">
            <h2 className="flex items-center text-xl font-semibold text-gray-800">
              <ClipboardList className="w-6 h-6 mr-2 text-blue-500" />
              Détails de la Commande <span className="ml-2 text-blue-600">{order.orderNumber}</span>
            </h2>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-500 hover:text-gray-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="relative p-6 flex-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations Client */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Informations Client
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <span className="text-sm text-gray-900 font-semibold">{order.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <span className="text-sm text-gray-900 font-semibold">{order.customer.phone}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <span className="text-sm text-gray-900">{order.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statut & Dates */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Statut & Dates
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-500">Date de commande</label>
                    <span className="text-sm text-gray-900 font-semibold">{new Date(order.orderDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-500">Livraison souhaitée</label>
                    <span className="text-sm text-gray-900 font-semibold">{new Date(order.requestedDeliveryDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>

              {/* Détails de livraison */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                  <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                  Détails de Livraison
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-500">Adresse</label>
                    <span className="text-sm text-gray-900 text-right font-semibold">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      {order.deliveryAddress.postalCode && `, ${order.deliveryAddress.postalCode}`}
                    </span>
                  </div>
                  {order.customerNotes && (
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-500">Commentaires</label>
                      <p className="text-sm text-gray-900 text-right max-w-xs">{order.customerNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lignes de commande */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  Produits commandés
                </h3>
                <div className="space-y-2">
                  {order.products.length > 0 ? (
                    order.products.map(product => (
                      <div key={product._id} className="flex justify-between border-b border-gray-200 last:border-b-0 py-2">
                        <span className="text-sm text-gray-700">{product.nom_produit}</span>
                        <span className="text-sm text-gray-900 font-semibold">
                          {product.quantite} x {product.prix_unitaire} DH
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun produit listé.</p>
                  )}
                </div>
              </div>

              {/* Historique */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                <h3 className="flex items-center text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                  <History className="w-5 h-5 mr-2 text-blue-500" />
                  Historique
                </h3>
                <div className="space-y-2">
                  {order.history && order.history.length > 0 ? (
                    order.history.map((event, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-700">
                        <span>{new Date(event.timestamp).toLocaleString("fr-FR")}</span>
                        <span className="font-semibold">{event.action}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun historique disponible.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b-lg">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;