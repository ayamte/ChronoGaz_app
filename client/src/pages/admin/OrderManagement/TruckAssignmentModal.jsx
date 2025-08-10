import React, { useState } from 'react';
import {
  MdClose as X,
  MdLocalShipping as TruckIcon,
  MdSave as Save
} from 'react-icons/md';

const TruckAssignmentModal = ({ order, trucks, drivers, accompagnateurs, confirmedStatusId, loading, onSave, onClose }) => {
  const [assignmentData, setAssignmentData] = useState({
    truckId: '',
    driverId: '',
    accompagnateurId: '',
    scheduledDate: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
  });

  const handleSave = () => {
    if (assignmentData.truckId && assignmentData.driverId && assignmentData.scheduledDate) {
      // Transformer les données pour correspondre aux attentes du backend
      //const backendData = {
        //statut_id: confirmedStatusId, // Vous devez récupérer l'ID du statut "CONFIRMEE" depuis votre base
        //truck_id: assignmentData.truckId,
        //livreur_id: assignmentData.driverId,
        //accompagnateur_id: assignmentData.accompagnateurId || null,
        //date_planifiee: assignmentData.scheduledDate
      //};
      onSave(assignmentData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-xl outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t-lg">
            <h2 className="flex items-center text-xl font-semibold text-gray-800">
              <TruckIcon className="w-6 h-6 mr-2 text-blue-500" />
              Assigner un Camion à la Commande #{order.orderNumber}
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
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Chargement des camions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sélecteur de camion */}
                <div className="flex flex-col">
                  <label htmlFor="truckId" className="text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un camion
                  </label>
                  <select
                    id="truckId"
                    name="truckId"
                    value={assignmentData.truckId}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Choisir un camion --</option>
                    {trucks.map(truck => (
                      <option key={truck.id} value={truck.id}>
                        {truck.plateNumber} - {truck.model}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Sélecteur de chauffeur */}
                <div className="flex flex-col">
                  <label htmlFor="driverId" className="text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un chauffeur
                  </label>
                  <select
                    id="driverId"
                    name="driverId"
                    value={assignmentData.driverId}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Choisir un chauffeur --</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  {drivers.length === 0 && (
                    <p className="mt-1 text-xs text-gray-500">Aucun chauffeur disponible.</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="accompagnateurId" className="text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un accompagnateur (optionnel)
                  </label>
                  <select
                    id="accompagnateurId"
                    name="accompagnateurId"
                    value={assignmentData.accompagnateurId}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Choisir un accompagnateur --</option>
                    {accompagnateurs.map(accompagnateur => (
                      <option key={accompagnateur.id} value={accompagnateur.id}>
                        {accompagnateur.name}
                      </option>
                    ))}
                  </select>
                  {accompagnateurs.length === 0 && (
                    <p className="mt-1 text-xs text-gray-500">Aucun accompagnateur disponible.</p>
                  )}
                </div>

                {/* Champ de date */}
                <div className="flex flex-col">
                  <label htmlFor="scheduledDate" className="text-sm font-medium text-gray-700 mb-1">
                    Date de planification
                  </label>
                  <input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={assignmentData.scheduledDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b-lg">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={!assignmentData.truckId || !assignmentData.driverId}
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckAssignmentModal;