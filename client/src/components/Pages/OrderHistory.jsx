import { Package } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import StatisticsBar from '../OrderHistoryPage/StatisticsBar'
import SearchAndFilters from '../OrderHistoryPage/SearchAndFilters'
import OrderCard from '../OrderHistoryPage/OrderCard'
import Title from '../OrderHistoryPage/Title';


const OrderHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('toutes');
  
    // Données simulées des commandes
    const orders = [
      {
        id: "GAZ-2024-001234",
        date: "2024-07-20",
        time: "14:30",
        status: "livree",
        items: [
          { name: "Bouteille Propane 34kg", quantity: 2, price: 200 },
          { name: "Bouteille Butane 12kg", quantity: 1, price: 50 }
        ],
        deliveryFee: 20,
        total: 270,
        driver: "Ahmed Benali",
        driverPhone: "+212 6 12 34 56 78"
      },
      {
        id: "GAZ-2024-001233",
        date: "2024-07-18",
        time: "10:15",
        status: "livree",
        items: [
          { name: "Bouteille Propane 34kg", quantity: 1, price: 100 },
          { name: "Bouteille Butane 12kg", quantity: 2, price: 100 }
        ],
        deliveryFee: 15,
        total: 215,
        driver: "Youssef Alami",
        driverPhone: "+212 6 98 76 54 32"
      },
      {
        id: "GAZ-2024-001232",
        date: "2024-07-22",
        time: "16:45",
        status: "en_cours",
        items: [
          { name: "Bouteille Propane 34kg", quantity: 3, price: 300 }
        ],
        deliveryFee: 25,
        total: 325,
        driver: "Mohammed Kadiri",
        driverPhone: "+212 6 11 22 33 44"
      },
      {
        id: "GAZ-2024-001231",
        date: "2024-07-15",
        time: "09:20",
        status: "annulee",
        items: [
          { name: "Bouteille Butane 12kg", quantity: 4, price: 200 }
        ],
        deliveryFee: 20,
        total: 220,
        driver: null,
        driverPhone: null
      },
      {
        id: "GAZ-2024-001230",
        date: "2024-07-22",
        time: "11:30",
        status: "en_cours",
        items: [
          { name: "Bouteille Propane 34kg", quantity: 1, price: 100 },
          { name: "Bouteille Butane 12kg", quantity: 1, price: 50 }
        ],
        deliveryFee: 15,
        total: 165,
        driver: "Hassan Benjelloun",
        driverPhone: "+212 6 55 66 77 88"
      },
      {
        id: "GAZ-2024-001229",
        date: "2024-07-12",
        time: "15:00",
        status: "livree",
        items: [
          { name: "Bouteille Propane 34kg", quantity: 2, price: 200 }
        ],
        deliveryFee: 20,
        total: 220,
        driver: "Omar Rachidi",
        driverPhone: "+212 6 44 33 22 11"
      }
    ];
  
    // Filtrer les commandes
    const filteredOrders = useMemo(() => {
      return orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filterStatus === 'toutes' || order.status === filterStatus;
        
        return matchesSearch && matchesFilter;
      });
    }, [searchTerm, filterStatus, orders]);
  
    // Calculer les statistiques
    const stats = useMemo(() => {
      const livrees = orders.filter(o => o.status === 'livree').length;
      const enCours = orders.filter(o => o.status === 'en_cours' || o.status === 'en_route').length;
      const annulees = orders.filter(o => o.status === 'annulee').length;
      const totalPrix = orders.filter(o => o.status === 'livree').reduce((sum, o) => sum + o.total, 0);
      
      return { livrees, enCours, annulees, totalPrix, total: orders.length };
    }, [orders]);
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Title stats={stats}/>
  
        <div className="max-w-6xl mx-auto p-6">
          {/* Statistiques */}
          <StatisticsBar stats={stats} />
  
          {/* Barre de recherche et filtres */}
          <SearchAndFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
  
          {/* Liste des commandes */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Aucune commande trouvée</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
  
          {/* Résumé en bas */}
          {filteredOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <div className="text-center text-gray-600">
                <p>Affichage de {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} sur {orders.length} au total</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default OrderHistory;