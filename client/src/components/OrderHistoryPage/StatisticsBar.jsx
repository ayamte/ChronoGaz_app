import React from 'react';
import { Package, CheckCircle, Truck, XCircle } from 'lucide-react';


const StatisticsBar = ({ stats }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-sm text-gray-600">Livrées:</span>
            <span className="text-lg font-bold text-green-600">{stats.livrees}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Truck size={20} style={{color: '#4DAEBD'}} />
            <span className="text-sm text-gray-600">En cours:</span>
            <span className="text-lg font-bold" style={{color: '#4DAEBD'}}>{stats.enCours}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <XCircle size={20} className="text-red-500" />
            <span className="text-sm text-gray-600">Annulées:</span>
            <span className="text-lg font-bold text-red-600">{stats.annulees}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Package size={20} style={{color: '#1F55A3'}} />
            <span className="text-sm text-gray-600">Total prix:</span>
            <span className="text-lg font-bold" style={{color: '#1F55A3'}}>{stats.totalPrix} DH</span>
          </div>
        </div>
      </div>
    );
  };
export default StatisticsBar;  