import { Package } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import StatisticsBar from '../../components/client/OrderHistoryPage/StatisticsBar';
import SearchAndFilters from '../../components/client/OrderHistoryPage/SearchAndFilters';
import OrderCard from '../../components/client/OrderHistoryPage/OrderCard';
import Title from '../../components/client/OrderHistoryPage/Title';


const OrderHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('toutes');
  
    // Données simulées des commandes
    const orders = useMemo(() => [
      {
        id: 1234,
        numero_commande: "GAZ-2024-001234",
        date_commande: "2024-07-20T14:30:00Z",
        date_souhaite: "2024-07-21T10:00:00Z",
        statut_id: 1, // livree
        total_ht: 225.00,
        total_tva: 45.00,
        total_ttc: 270.00,
        mode_paiement: "carte",
        commentaires: "Livrer avant midi.",
        urgent: 0,
        created_at: "2024-07-20T14:00:00Z",
        updated_at: "2024-07-20T14:25:00Z",
        customer_id: 1001,
        address_livraison_id: 5001,
    
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
        id: 1233,
        numero_commande: "GAZ-2024-001233",
        date_commande: "2024-07-18T10:15:00Z",
        date_souhaite: "2024-07-19T09:00:00Z",
        statut_id: 1,
        total_ht: 175.00,
        total_tva: 35.00,
        total_ttc: 210.00,
        mode_paiement: "espece",
        commentaires: "",
        urgent: 0,
        created_at: "2024-07-18T10:00:00Z",
        updated_at: "2024-07-18T10:10:00Z",
        customer_id: 1002,
        address_livraison_id: 5002,
    
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
        id: 1232,
        numero_commande: "GAZ-2024-001232",
        date_commande: "2024-07-22T16:45:00Z",
        date_souhaite: "2024-07-23T11:00:00Z",
        statut_id: 2, // en_cours
        total_ht: 300.00,
        total_tva: 60.00,
        total_ttc: 360.00,
        mode_paiement: "carte",
        commentaires: "Livraison urgente demandée.",
        urgent: 1,
        created_at: "2024-07-22T16:30:00Z",
        updated_at: "2024-07-22T16:40:00Z",
        customer_id: 1003,
        address_livraison_id: 5003,
    
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
        id: 1231,
        numero_commande: "GAZ-2024-001231",
        date_commande: "2024-07-15T09:20:00Z",
        date_souhaite: "2024-07-16T08:00:00Z",
        statut_id: 3, // annulee
        total_ht: 200.00,
        total_tva: 40.00,
        total_ttc: 240.00,
        mode_paiement: "espece",
        commentaires: "Commande annulée par le client.",
        urgent: 0,
        created_at: "2024-07-15T09:00:00Z",
        updated_at: "2024-07-15T09:10:00Z",
        customer_id: 1004,
        address_livraison_id: 5004,
    
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
        id: 1230,
        numero_commande: "GAZ-2024-001230",
        date_commande: "2024-07-22T11:30:00Z",
        date_souhaite: "2024-07-23T09:30:00Z",
        statut_id: 2,
        total_ht: 150.00,
        total_tva: 30.00,
        total_ttc: 180.00,
        mode_paiement: "carte",
        commentaires: "",
        urgent: 0,
        created_at: "2024-07-22T11:00:00Z",
        updated_at: "2024-07-22T11:20:00Z",
        customer_id: 1005,
        address_livraison_id: 5005,
    
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
        id: 1229,
        numero_commande: "GAZ-2024-001229",
        date_commande: "2024-07-12T15:00:00Z",
        date_souhaite: "2024-07-13T10:00:00Z",
        statut_id: 1,
        total_ht: 200.00,
        total_tva: 40.00,
        total_ttc: 240.00,
        mode_paiement: "espece",
        commentaires: "",
        urgent: 0,
        created_at: "2024-07-12T14:30:00Z",
        updated_at: "2024-07-12T14:45:00Z",
        customer_id: 1006,
        address_livraison_id: 5006,
    
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
    ], []);
    
  
    // Filtrer les commandes
    const filteredOrders = useMemo(() => {
      return orders.filter(order => {
        const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
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