import React, { useState, useEffect, useCallback, useRef } from 'react';  
import {   
  MdSearch as Search,   
  MdVisibility as Eye,  
  MdClose as X,  
  MdStar as Star,  
  MdStarBorder as StarBorder,  
  MdFilterList as Filter,  
  MdRefresh as Refresh  
} from "react-icons/md";  
import { orderService } from '../../../services/orderService';  
import { authService } from '../../../services/authService';  
import LoadingSpinner from '../../../components/common/LoadingSpinner';  
import Pagination from '../../../components/common/Pagination';  
import "./suiviCommande.css";  
  
export default function OrderTrackingManagement() {  
  // États pour les données  
  const [orders, setOrders] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
    
  // États pour les filtres  
  const [filters, setFilters] = useState({  
    search: '',  
    status: 'all',  
    clientType: 'all',  
    region: 'all',  
    dateFrom: '',  
    dateTo: ''  
  });  
    
  // États pour la modal et pagination  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);  
  const [selectedOrder, setSelectedOrder] = useState(null);  
  const [pagination, setPagination] = useState({  
    page: 1,  
    limit: 20,  
    total: 0,  
    totalPages: 0  
  });  
  
  // Refs pour la gestion des timeouts  
  const searchTimeoutRef = useRef(null);  
  const isMountedRef = useRef(true);  
  
  // Fonction pour récupérer les commandes  
  const fetchOrders = useCallback(async (currentFilters = null, currentPage = null) => {  
    if (!isMountedRef.current) return;  
      
    try {  
      setLoading(true);  
      setError('');  
        
      const filtersToUse = currentFilters || filters;  
      const pageToUse = currentPage || pagination.page;  
        
      // Utiliser orderService.getOrders avec tous les filtres  
      const response = await orderService.getOrders({  
        page: pageToUse,  
        limit: pagination.limit,  
        search: filtersToUse.search,  
        status: filtersToUse.status === 'all' ? undefined : filtersToUse.status,  
        dateFrom: filtersToUse.dateFrom,  
        dateTo: filtersToUse.dateTo  
      });  
  
      if (isMountedRef.current) {  
        setOrders(response.data);  
        setPagination(prev => ({  
          ...prev,  
          page: pageToUse,  
          total: response.total || 0,  
          totalPages: response.totalPages || 0  
        }));  
      }  
    } catch (err) {  
      console.error('Erreur lors du chargement des commandes:', err);  
      if (isMountedRef.current) {  
        setError(err.message);  
      }  
    } finally {  
      if (isMountedRef.current) {  
        setLoading(false);  
      }  
    }  
  }, [filters, pagination.page, pagination.limit]);  
  
  // Effet pour charger les données  
  useEffect(() => {  
    fetchOrders(filters, pagination.page);  
  }, [filters, pagination.page]);  
  
  // Debounce pour la recherche  
  useEffect(() => {  
    if (searchTimeoutRef.current) {  
      clearTimeout(searchTimeoutRef.current);  
    }  
      
    if (filters.search.length >= 2 || filters.search === '') {  
      searchTimeoutRef.current = setTimeout(() => {  
        if (!isMountedRef.current) return;  
        fetchOrders({ ...filters }, 1);  
      }, 500);  
    }  
      
    return () => {  
      if (searchTimeoutRef.current) {  
        clearTimeout(searchTimeoutRef.current);  
      }  
    };  
  }, [filters.search, fetchOrders]);  
  
  // Gestionnaires d'événements  
  const handleFilterChange = useCallback((filterType, value) => {  
    setFilters(prev => ({ ...prev, [filterType]: value }));  
    if (filterType !== 'search') {  
      setPagination(prev => ({ ...prev, page: 1 }));  
    }  
  }, []);  
  
  const handleRefresh = useCallback(() => {  
    fetchOrders(filters, pagination.page);  
  }, [fetchOrders, filters, pagination.page]);  
  
  const handlePageChange = useCallback((newPage) => {  
    setPagination(prev => ({ ...prev, page: newPage }));  
  }, []);  
  
  // Filtrer les commandes localement pour les critères non supportés par l'API  
  const filteredOrders = orders.filter((order) => {  
    const matchesClientType = filters.clientType === 'all' ||   
      (order.customer?.type && order.customer.type.toLowerCase() === filters.clientType.toLowerCase());  
      
    const matchesRegion = filters.region === 'all' ||   
      (order.deliveryAddress?.city && order.deliveryAddress.city.toLowerCase().includes(filters.region.toLowerCase()));  
      
    return matchesClientType && matchesRegion;  
  });  
  
  // ✅ CORRIGÉ: Fonction pour obtenir l'état réel de la planification  
  const getRealOrderState = (order) => {  
    // Priorité : état de la livraison > état de la planification > statut par défaut  
    if (order.livraison?.etat) {  
      return order.livraison.etat;  
    }  
    if (order.planification?.etat) {  
      return order.planification.etat;  
    }  
    return 'EN_ATTENTE'; // État par défaut  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir le texte de l'état  
  const getStateText = (state) => {  
    const stateMap = {  
      'EN_ATTENTE': 'En attente',  
      'PLANIFIE': 'Assignée',  
      'EN_COURS': 'En cours',  
      'LIVRE': 'Livrée',  
      'ANNULE': 'Annulée'  
    };  
    return stateMap[state] || state;  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir la classe CSS de l'état  
  const getStateBadgeClass = (state) => {  
    const stateMap = {  
      'EN_ATTENTE': 'tracking-badge-preparing',  
      'PLANIFIE': 'tracking-badge-preparing',   
      'EN_COURS': 'tracking-badge-in-progress',  
      'LIVRE': 'tracking-badge-delivered',  
      'ANNULE': 'tracking-badge-cancelled'  
    };  
    return stateMap[state] || 'tracking-badge-default';  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir le montant total  
  const getTotalAmount = (order) => {  
    // Essayer plusieurs sources pour le montant total  
    return order.totalAmount ||   
           order.montant_total ||   
           order.planification?.total ||   
           order.livraison?.total ||   
           0;  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir les infos du camion  
  const getTruckInfo = (order) => {  
    const truck = order.planification?.trucks_id || order.assignedTruck;  
    if (!truck) return null;  
      
    return {  
      plateNumber: truck.matricule || truck.plateNumber,  
      model: truck.marque || truck.model,  
      capacity: truck.capacite || truck.capacity  
    };  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir les infos du chauffeur  
  const getDriverInfo = (order) => {  
    const driver = order.planification?.livreur_employee_id;  
    if (!driver?.physical_user_id) return null;  
      
    return {  
      name: `${driver.physical_user_id.first_name} ${driver.physical_user_id.last_name}`,  
      matricule: driver.matricule,  
      phone: driver.physical_user_id.telephone_principal  
    };  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir les infos de l'accompagnant  
  const getAccompagnantInfo = (order) => {  
    const accompagnant = order.planification?.accompagnateur_id;  
    if (!accompagnant?.physical_user_id) return null;  
      
    return {  
      name: `${accompagnant.physical_user_id.first_name} ${accompagnant.physical_user_id.last_name}`,  
      matricule: accompagnant.matricule,  
      phone: accompagnant.physical_user_id.telephone_principal  
    };  
  };  
  
  // ✅ CORRIGÉ: Fonction pour obtenir les notes du livreur  
  const getDriverNotes = (order) => {  
    return order.livraison?.commentaires_livreur ||   
           order.livraison?.details ||   
           'Aucune note du livreur';  
  };  
  
  // ✅ CORRIGÉ: Fonction pour formater les dates correctement  
  const formatDate = (dateString) => {  
    if (!dateString) return 'Date non disponible';  
      
    try {  
      const date = new Date(dateString);  
      if (isNaN(date.getTime())) return 'Date invalide';  
        
      return date.toLocaleDateString('fr-FR', {  
        year: 'numeric',  
        month: '2-digit',  
        day: '2-digit',  
        hour: '2-digit',  
        minute: '2-digit'  
      });  
    } catch (error) {  
      return 'Date invalide';  
    }  
  };  
  
  // ✅ CORRIGÉ: Fonction pour générer l'historique avec dates valides  
  const generateOrderHistory = (order) => {  
    const history = [];  
      
    // Commande créée  
    if (order.orderDate || order.createdAt) {  
      history.push({  
        id: 'hist-1',  
        action: 'Commande créée',  
        date: order.orderDate || order.createdAt,  
        details: 'Commande créée dans le système'  
      });  
    }  
      
    // Planification/Assignation  
    if (order.planification?.createdAt) {  
      const truckInfo = getTruckInfo(order);  
      history.push({  
        id: 'hist-2',  
        action: 'Camion assigné',  
        date: order.planification.createdAt,  
        details: truckInfo ? `Camion ${truckInfo.plateNumber} assigné` : 'Camion assigné'  
      });  
    }  
      
    // Livraison en cours  
    if (order.livraison?.date && order.livraison.etat === 'EN_COURS') {  
      history.push({  
        id: 'hist-3',  
        action: 'Livraison en cours',  
        date: order.livraison.date,  
        details: 'Le chauffeur a commencé la livraison'  
      });  
    }  
      
    // Livraison terminée  
    if (order.livraison?.updatedAt && ['LIVRE', 'ANNULE'].includes(order.livraison.etat)) {  
      history.push({  
        id: 'hist-4',  
        action: order.livraison.etat === 'LIVRE' ? 'Livraison terminée' : 'Livraison annulée',  
        date: order.livraison.updatedAt,  
        details: order.livraison.etat === 'LIVRE' ? 'Commande livrée avec succès' : 'Livraison annulée'  
      });  
    }  
      
    return history.sort((a, b) => new Date(a.date) - new Date(b.date));  
  };  
  
  const handleViewDetails = async (order) => {  
    try {  
      const detailedOrder = await orderService.getOrder(order.id);  
      setSelectedOrder(detailedOrder);  
      setIsDetailsModalOpen(true);  
    } catch (error) {  
      console.error('Erreur lors du chargement des détails:', error);  
    }  
  };  
  
  const renderStars = (rating) => {  
    const stars = [];  
    const numRating = Number(rating) || 0;  
    for (let i = 1; i <= 5; i++) {  
      stars.push(  
        i <= numRating ?   
        <Star key={i} className="tracking-star-filled" /> :   
        <StarBorder key={i} className="tracking-star-empty" />  
      );  
    }  
    return stars;  
  };  
  
  // Cleanup au démontage  
  useEffect(() => {  
    isMountedRef.current = true;  
    return () => {  
      isMountedRef.current = false;  
      if (searchTimeoutRef.current) {  
        clearTimeout(searchTimeoutRef.current);  
      }  
    };  
  }, []);  
  
  return (  
    <div className="tracking-management-layout">  
      <div className="tracking-management-wrapper">  
        <div className="tracking-management-container">  
          <div className="tracking-management-content">  
            {/* En-tête avec bouton refresh */}  
            <div className="tracking-page-header">  
              <div>  
                <h1 className="tracking-page-title">Suivi des Commandes</h1>  
                <p className="tracking-page-subtitle">Suivez l'état de toutes les commandes en temps réel</p>  
              </div>  
              <button  
                onClick={handleRefresh}  
                className="tracking-refresh-button"  
                disabled={loading}  
                title="Actualiser"  
              >  
                <Refresh className={`tracking-refresh-icon ${loading ? 'tracking-spinning' : ''}`} />  
                Actualiser  
              </button>  
            </div>  
  
            {/* Section des filtres avancés */}  
            <div className="tracking-filters-card">  
              <div className="tracking-filters-header">  
                <h3 className="tracking-filters-title">  
                  <Filter className="tracking-filter-icon" />  
                  Filtres et Recherche  
                </h3>  
              </div>  
              <div className="tracking-filters-content">  
                <div className="tracking-filters-grid">  
                  {/* Recherche */}  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">Recherche</label>  
                    <div className="tracking-search-container">  
                      <Search className="tracking-search-icon" />  
                      <input  
                        type="text"  
                        placeholder="N° commande, client, région..."  
                        value={filters.search}  
                        onChange={(e) => handleFilterChange('search', e.target.value)}  
                        className="tracking-search-input"  
                      />  
                    </div>  
                  </div>  
  
                  {/* Filtre par statut */}  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">État</label>  
                    <select  
                      value={filters.status}  
                      onChange={(e) => handleFilterChange('status', e.target.value)}  
                      className="tracking-select"  
                    >  
                      <option value="all">Tous les états</option>  
                      <option value="EN_ATTENTE">En attente</option>  
                      <option value="PLANIFIE">Assignée</option>  
                      <option value="EN_COURS">En cours</option>  
                      <option value="LIVRE">Livrée</option>  
                      <option value="ANNULE">Annulée</option>  
                    </select>  
                  </div>  
  
                  {/* Filtre par type de client */}  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">Type de client</label>  
                    <select  
                      value={filters.clientType}  
                      onChange={(e) => handleFilterChange('clientType', e.target.value)}  
                      className="tracking-select"  
                    >  
                      <option value="all">Tous les types</option>  
                      <option value="PHYSIQUE">Particulier</option>  
                      <option value="MORAL">Professionnel</option>  
                    </select>  
                  </div>  
  
                  {/* Filtre par région */}  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">Région</label>  
                    <select  
                      value={filters.region}  
                      onChange={(e) => handleFilterChange('region', e.target.value)}  
                      className="tracking-select"  
                    >  
                      <option value="all">Toutes les régions</option>  
                      <option value="casablanca">Casablanca</option>  
                      <option value="rabat">Rabat</option>  
                      <option value="marrakech">Marrakech</option>  
                      <option value="fès">Fès</option>  
                      <option value="tanger">Tanger</option>  
                      <option value="agadir">Agadir</option>  
                    </select>  
                  </div>  
  
                  {/* Filtre par date */}  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">Date de début</label>  
                    <input  
                      type="date"  
                      value={filters.dateFrom}  
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}  
                      className="tracking-input"  
                    />  
                  </div>  
  
                  <div className="tracking-form-group">  
                    <label className="tracking-label">Date de fin</label>  
                    <input  
                      type="date"  
                      value={filters.dateTo}  
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}  
                      className="tracking-input"  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>  
  
            {/* Affichage des erreurs */}  
            {error && (  
              <div className="tracking-error-alert">  
                <span>Erreur: {error}</span>  
                <button onClick={handleRefresh}>Réessayer</button>  
              </div>  
            )}  
  
            {/* Tableau des commandes */}  
            <div className="tracking-table-card">  
              <div className="tracking-table-header">  
                <h3 className="tracking-table-title">  
                  Liste des Commandes ({filteredOrders.length})  
                </h3>  
                {loading && <LoadingSpinner size="small" />}  
              </div>  
              <div className="tracking-table-content">  
                <div className="tracking-table-container">  
                  <table className="tracking-orders-table">  
                    <thead>  
                      <tr>  
                        <th>N° Cmd</th>  
                        <th>Client</th>  
                        <th>Région</th>  
                        <th>Date</th>  
                        <th>Total (DH)</th>  
                        <th>État</th>  
                        <th>Camion</th>  
                        <th>Détails</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {filteredOrders.length === 0 ? (  
                        <tr>  
                          <td colSpan={8} className="tracking-no-results">  
                            {loading ? 'Chargement...' : 'Aucune commande trouvée pour vos critères.'}  
                          </td>  
                        </tr>  
                      ) : (  
                        filteredOrders.map((order) => {  
                          const realState = getRealOrderState(order);  
                          const totalAmount = getTotalAmount(order);  
                          const truckInfo = getTruckInfo(order);  
                            
                          return (  
                            <tr key={order.id}>  
                              <td className="tracking-font-medium">{order.orderNumber || order.numero_commande}</td>  
                              <td>{order.customer?.name || 'N/A'}</td>  
                              <td>{order.deliveryAddress?.city || 'N/A'}</td>  
                              <td>{formatDate(order.orderDate || order.date_commande)}</td>  
                              <td className="tracking-font-medium">  
                                {totalAmount ? `${totalAmount.toFixed(2)} DH` : 'N/A'}  
                              </td>  
                              <td>  
                                <span className={`tracking-badge ${getStateBadgeClass(realState)}`}>  
                                  {getStateText(realState)}  
                                </span>  
                              </td>  
                              <td>{truckInfo?.plateNumber || 'Non assigné'}</td>  
                              <td>  
                                <button   
                                  className="tracking-details-button"  
                                  onClick={() => handleViewDetails(order)}  
                                >  
                                  <Eye className="tracking-details-icon" />  
                                </button>  
                              </td>  
                            </tr>  
                          );  
                        })  
                      )}  
                    </tbody>  
                  </table>  
                </div>  
  
                {/* Pagination */}  
                {pagination.totalPages > 1 && (  
                  <Pagination  
                    currentPage={pagination.page}  
                    totalPages={pagination.totalPages}  
                    totalItems={pagination.total}  
                    itemsPerPage={pagination.limit}  
                    onPageChange={handlePageChange}  
                  />  
                )}  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal de détails de commande corrigée */}  
      {isDetailsModalOpen && selectedOrder && (  
        <div className="tracking-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>  
          <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="tracking-modal-header">  
              <h2 className="tracking-modal-title">  
                Détails de la commande {selectedOrder.orderNumber || selectedOrder.numero_commande}  
              </h2>  
              <button className="tracking-modal-close" onClick={() => setIsDetailsModalOpen(false)}>  
                <X className="tracking-close-icon" />  
              </button>  
            </div>  
                
            <div className="tracking-modal-body">  
              <div className="tracking-details-grid">  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Nom du client</label>  
                  <span className="tracking-detail-value">{selectedOrder.customer?.name || 'N/A'}</span>  
                </div>  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Type de client</label>  
                  <span className="tracking-client-badge tracking-client-badge-particulier">  
                    {selectedOrder.customer?.type_client === 'PHYSIQUE' ? 'Particulier' : 'Professionnel'}  
                  </span>  
                </div>  
  
                <div className="tracking-detail-item tracking-full-width">  
                  <label className="tracking-detail-label">Adresse complète</label>  
                  <span className="tracking-detail-value">  
                    {selectedOrder.deliveryAddress ?   
                      `${selectedOrder.deliveryAddress.street}, ${selectedOrder.deliveryAddress.city}` :   
                      'N/A'  
                    }  
                  </span>  
                </div>  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Région</label>  
                  <span className="tracking-detail-value">{selectedOrder.deliveryAddress?.city || 'N/A'}</span>  
                </div>  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Produits</label>  
                  <div className="tracking-detail-value">  
                    {selectedOrder.products?.length > 0 ? (  
                      <ul className="tracking-products-list">  
                        {selectedOrder.products.map((product, index) => (  
                          <li key={index}>  
                            {product.product_id?.long_name || 'Produit'} -   
                            Qté: {product.quantity} {product.UM_id?.unitemesure || ''}  
                          </li>  
                        ))}  
                      </ul>  
                    ) : 'Aucun produit'}  
                  </div>  
                </div>  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Total</label>  
                  <span className="tracking-detail-value tracking-total-highlight">  
                    {getTotalAmount(selectedOrder).toFixed(2)} DH  
                  </span>  
                </div>  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">Date de commande</label>  
                  <span className="tracking-detail-value">  
                    {formatDate(selectedOrder.orderDate || selectedOrder.date_commande)}  
                  </span>  
                </div>  
  
                {/* ✅ CORRIGÉ: Informations complètes du camion */}  
                {getTruckInfo(selectedOrder) && (  
                  <>  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Camion assigné</label>  
                      <span className="tracking-detail-value">  
                        {getTruckInfo(selectedOrder).plateNumber} - {getTruckInfo(selectedOrder).model}  
                      </span>  
                    </div>  
  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Capacité camion</label>  
                      <span className="tracking-detail-value">  
                        {getTruckInfo(selectedOrder).capacity} tonnes  
                      </span>  
                    </div>  
                  </>  
                )}  
  
                {/* ✅ NOUVEAU: Informations du chauffeur */}  
                {getDriverInfo(selectedOrder) && (  
                  <>  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Chauffeur</label>  
                      <span className="tracking-detail-value">  
                        {getDriverInfo(selectedOrder).name}  
                      </span>  
                    </div>  
  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Matricule chauffeur</label>  
                      <span className="tracking-detail-value">  
                        {getDriverInfo(selectedOrder).matricule}  
                      </span>  
                    </div>  
  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Téléphone chauffeur</label>  
                      <span className="tracking-detail-value">  
                        {getDriverInfo(selectedOrder).phone}  
                      </span>  
                    </div>  
                  </>  
                )}  
  
                {/* ✅ NOUVEAU: Informations de l'accompagnant */}  
                {getAccompagnantInfo(selectedOrder) && (  
                  <>  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Accompagnant</label>  
                      <span className="tracking-detail-value">  
                        {getAccompagnantInfo(selectedOrder).name}  
                      </span>  
                    </div>  
  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Matricule accompagnant</label>  
                      <span className="tracking-detail-value">  
                        {getAccompagnantInfo(selectedOrder).matricule}  
                      </span>  
                    </div>  
  
                    <div className="tracking-detail-item">  
                      <label className="tracking-detail-label">Téléphone accompagnant</label>  
                      <span className="tracking-detail-value">  
                        {getAccompagnantInfo(selectedOrder).phone}  
                      </span>  
                    </div>  
                  </>  
                )}  
  
                <div className="tracking-detail-item">  
                  <label className="tracking-detail-label">État de la commande</label>  
                  <span className={`tracking-badge ${getStateBadgeClass(getRealOrderState(selectedOrder))}`}>  
                    {getStateText(getRealOrderState(selectedOrder))}  
                  </span>  
                </div>  
  
                {/* ✅ NOUVEAU: Note du livreur */}  
                <div className="tracking-detail-item tracking-full-width">  
                  <label className="tracking-detail-label">Note du livreur</label>  
                  <span className="tracking-detail-value">  
                    {getDriverNotes(selectedOrder)}  
                  </span>  
                </div>  
  
                <div className="tracking-detail-item tracking-full-width">  
                  <label className="tracking-detail-label">Notes client</label>  
                  <span className="tracking-detail-value">  
                    {selectedOrder.customerNotes || selectedOrder.details || "Aucune note"}  
                  </span>  
                </div>  
  
                {/* ✅ CORRIGÉ: Historique avec dates valides */}  
                <div className="tracking-detail-item tracking-full-width">  
                  <label className="tracking-detail-label">Historique</label>  
                  <div className="tracking-history-list">  
                    {generateOrderHistory(selectedOrder).map((event) => (  
                      <div key={event.id} className="tracking-history-item">  
                        <span className="tracking-history-date">  
                          {formatDate(event.date)}  
                        </span>  
                        <span className="tracking-history-action">{event.action}</span>  
                      </div>  
                    ))}  
                  </div>  
                </div>  
  
                {/* Évaluation si disponible */}  
                {selectedOrder.evaluation && (  
                  <div className="tracking-detail-item tracking-full-width">  
                    <label className="tracking-detail-label">Évaluation</label>  
                    <div className="tracking-rating">  
                      {renderStars(selectedOrder.evaluation)}  
                      <span className="tracking-rating-text">({selectedOrder.evaluation}/5)</span>  
                    </div>  
                  </div>  
                )}  
              </div>  
            </div>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
}