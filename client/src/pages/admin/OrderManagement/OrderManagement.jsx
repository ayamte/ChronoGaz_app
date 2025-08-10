import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  MdSearch as Search,
  MdFilterList as Filter,
  MdVisibility as Eye,
  MdLocalShipping as TruckIcon,
  MdPhone as Phone,
  MdSmartphone as Smartphone,
  MdDescription as ClipboardList,
  MdRefresh as Refresh,
  MdWarning as AlertTriangle,
  MdCheckCircle as CheckCircle,
  MdAccessTime as Clock,
  MdCheck as Check,
  MdClose as X,
  MdInventory as Package 
} from 'react-icons/md';

import { useOrders } from '../../../hooks/useOrders';
import { useTrucks } from '../../../hooks/useTrucks';
import { useStatuts } from '../../../hooks/useStatuts';
import { useEmployees } from '../../../hooks/useEmployees';
import { useNotification } from '../../../hooks/useNotification';
import { orderService } from '../../../services/orderService';
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar';
import './OrderManagement.css';

import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Pagination from '../../../components/common/Pagination';
import OrderDetailsModal from './OrderDetailsModal';
import TruckAssignmentModal from './TruckAssignmentModal';

const OrderManagement = () => {
  // États locaux pour les filtres et modales
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    delivered: 0
  });

  // Hooks personnalisés
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    pagination,
    fetchOrders,
    assignTruck,
    cancelAssignment,
    setPagination
  } = useOrders();

  const { trucks, loading: trucksLoading } = useTrucks();
  const { drivers, accompagnateurs, loading: employeesLoading } = useEmployees(); 
  const { notification, showNotification, hideNotification } = useNotification();
  const { getStatutByCode, loading: statutsLoading } = useStatuts();

  
  // État pour stocker les chauffeurs disponibles, filtrés par le hook des employés
  //const [availableDrivers, setAvailableDrivers] = useState([]);
  //const [availableAccompagnateurs, setAvailableAccompagnateurs] = useState([]);


  // Refs pour la gestion des timeouts et lifecycle
  const searchTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Logique pour extraire les chauffeurs une fois les données chargées
  //useEffect(() => {
    //if (employees && employees.length > 0) {
      //const drivers = employees.filter(emp => emp.fonction === 'CHAUFFEUR');
      //const accompagnateurs = employees.filter(emp => emp.fonction === 'ACCOMPAGNANT');
      
      //setAvailableDrivers(drivers);
      //setAvailableAccompagnateurs(accompagnateurs);
    //}
  //}, [employees]);

  // SOLUTION 1: Fonction fetchData stable avec useCallback
  const fetchData = useCallback(async (currentFilters = null, currentPage = null) => {
    if (!isMountedRef.current) return;
    
    try {
      const filtersToUse = currentFilters || filters;
      const pageToUse = currentPage || pagination.page;
      
      console.log('🔄 fetchData called with:', { filtersToUse, pageToUse });
      
      const orderFilters = {
        ...filtersToUse,
        status: filtersToUse.status === 'all' ? undefined : filtersToUse.status,
        priority: filtersToUse.priority === 'all' ? undefined : filtersToUse.priority,
      };

      await fetchOrders(orderFilters, pageToUse, 20);

      try {
        const statsResponse = await orderService.getOrderStats(orderFilters);
        if (isMountedRef.current) {
          setStats(statsResponse);
        }
      } catch (statsError) {
        console.error('⚠️ Erreur stats (non-critique):', statsError);
      }
      
      console.log('✅ fetchData completed successfully');
      
    } catch (error) {
      console.error('❌ Erreur fetchData:', error);
      if (isMountedRef.current) {
        showNotification('Erreur lors du chargement des données', 'error');
      }
    }
  }, [fetchOrders, showNotification]);

  // SOLUTION 2: useEffect principal - SANS fetchData dans les dépendances
  useEffect(() => {
    console.log('🔄 Main useEffect triggered - filters changed');
    fetchData(filters, pagination.page);
  }, [filters, pagination.page]);

  // SOLUTION 3: Debounce search avec useRef et cleanup optimal
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (filters.search.length >= 2 || filters.search === '') {
      searchTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        
        console.log('🔍 Debounced search triggered:', filters.search);
        fetchData({ ...filters }, 1);
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.search]);

  // SOLUTION 4: Gestionnaires d'événements optimisés avec useCallback
  const handleFilterChange = useCallback((filterType, value) => {
    console.log('🔧 Filter changed:', filterType, value);
    setFilters(prev => ({ ...prev, [filterType]: value }));
    if (filterType !== 'search') {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [setPagination]);

  const handleViewDetails = useCallback(async (order) => {
    try {
      console.log('👁️ Viewing details for order:', order.id);
      const detailedOrder = await orderService.getOrder(order.id);
      if (isMountedRef.current) {
        setSelectedOrder(detailedOrder);
        setIsDetailsModalOpen(true);
      }
    } catch (error) {
      console.error('❌ Erreur handleViewDetails:', error);
      if (isMountedRef.current) {
        showNotification('Erreur lors du chargement des détails', 'error');
      }
    }
  }, [showNotification]);

  const handleAssignTruck = useCallback((order) => {
    console.log('🚛 Opening truck assignment for order:', order.id);
    setSelectedOrder(order);
    setIsAssignModalOpen(true);
  }, []);

  const handleSaveAssignment = useCallback(async (assignmentData) => {
    if (!selectedOrder) {
      console.warn('⚠️ No selected order for assignment');
      return;
    }
    try {
      const confirmedStatusId = getStatutByCode('CONFIRMEE')?._id;
    if (!confirmedStatusId) {
      showNotification('Erreur: Statut CONFIRMEE non trouvé', 'error');
      return;
    }

    const finalPayload = {
      statut_id: confirmedStatusId,
      truck_id: assignmentData.truckId,
      livreur_id: assignmentData.driverId,
      accompagnateur_id: assignmentData.accompagnateurId || null,
      date_planifiee: assignmentData.scheduledDate
    };
      console.log('💾 Saving assignment:', assignmentData);
      await assignTruck(selectedOrder.id, finalPayload, trucks, drivers);
      const assignedTruck = trucks.find(t => t.id === assignmentData.truckId);
      if (isMountedRef.current) {
        showNotification(
          `Commande ${selectedOrder.orderNumber} assignée au camion ${assignedTruck?.plateNumber}`,
          'success'
        );
        setIsAssignModalOpen(false);
        try {
          const orderFilters = {
            ...filters,
            status: filters.status === 'all' ? undefined : filters.status,
            priority: filters.priority === 'all' ? undefined : filters.priority,
          };
          const statsResponse = await orderService.getOrderStats(orderFilters);
          setStats(statsResponse);
        } catch (statsError) {
          console.error('⚠️ Erreur refresh stats:', statsError);
        }
      }
    } catch (error) {
      console.error('❌ Erreur handleSaveAssignment:', error);
      if (isMountedRef.current) {
        showNotification('Erreur lors de l\'assignation', 'error');
      }
    }
  }, [selectedOrder, assignTruck, trucks, drivers, getStatutByCode, showNotification, filters]);

  const handleCancelAssignment = useCallback(async (order) => {
    try {
      console.log('❌ Canceling assignment for order:', order.id);
      await cancelAssignment(order.id);
      if (isMountedRef.current) {
        showNotification(`Assignation de la commande ${order.orderNumber} annulée`, 'success');
        try {
          const orderFilters = {
            ...filters,
            status: filters.status === 'all' ? undefined : filters.status,
            priority: filters.priority === 'all' ? undefined : filters.priority,
          };
          const statsResponse = await orderService.getOrderStats(orderFilters);
          setStats(statsResponse);
        } catch (statsError) {
          console.error('⚠️ Erreur refresh stats:', statsError);
        }
      }
    } catch (error) {
      console.error('❌ Erreur handleCancelAssignment:', error);
      if (isMountedRef.current) {
        showNotification('Erreur lors de l\'annulation', 'error');
      }
    }
  }, [cancelAssignment, showNotification, filters]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    fetchData(filters, pagination.page);
  }, [fetchData, filters, pagination.page]);

  const handlePageChange = useCallback((newPage) => {
    console.log('📄 Page changed to:', newPage);
    setPagination(prev => ({ ...prev, page: newPage }));
  }, [setPagination]);

  // SOLUTION 5: Cleanup complet au démontage
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      console.log('🧹 OrderManagement cleanup');
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fonctions utilitaires pour l'affichage
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'om-status-pending',
      assigned: 'om-status-assigned',
      in_progress: 'om-status-in-progress',
      delivered: 'om-status-delivered',
      cancelled: 'om-status-cancelled'
    };
    return statusColors[status] || 'om-status-default';
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

  const getPriorityColor = (priority) => {
    const priorityColors = {
      urgent: 'om-priority-urgent',
      high: 'om-priority-high',
      medium: 'om-priority-medium',
      low: 'om-priority-low'
    };
    return priorityColors[priority] || 'om-priority-default';
  };

  const getPriorityText = (priority) => {
    const priorityTexts = {
      urgent: 'Urgente',
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    };
    return priorityTexts[priority] || priority;
  };

  // SOLUTION 6: Mémoisation des stats
  const memoizedStats = useMemo(() => stats, [
    stats.total, stats.pending, stats.assigned, stats.inProgress, stats.delivered
  ]);

  // Loading state - affichage initial
  if (ordersLoading && orders.length === 0) {
    return (
      <div className="om-layout">
        <SidebarNavigation/>
        <div className="om-wrapper">
          <div className="om-container">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="om-layout">
      <SidebarNavigation/>
      <div className="om-wrapper">
        <div className="om-container">
          <div className="om-content">
            {/* Header */}
            <div className="om-header">
              <div className="om-header-content">
                <h2 className="om-title">Gestion des Commandes</h2>
                <p className="om-subtitle">Gérez et assignez les commandes clients aux camions</p>
              </div>
              <div className="om-header-actions">
                <button
                  onClick={handleRefresh}
                  className="om-btn om-btn-secondary"
                  disabled={ordersLoading}
                  title="Actualiser"
                >
                  <Refresh className={`om-btn-icon ${ordersLoading ? 'om-spinning' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>

            {/* Notification */}
            {notification && (
              <div className={`om-alert ${notification.type === 'success' ? 'om-alert-success' : 'om-alert-error'}`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="om-alert-icon" />
                ) : (
                  <AlertTriangle className="om-alert-icon" />
                )}
                <div className="om-alert-content">
                  {notification.message}
                </div>
                <button 
                  className="om-alert-close"
                  onClick={hideNotification}
                >
                  <X />
                </button>
              </div>
            )}

            {/* Error Display */}
            {ordersError && (
              <div className="om-alert om-alert-error">
                <AlertTriangle className="om-alert-icon" />
                <div className="om-alert-content">
                  {ordersError}
                </div>
                <button 
                  className="om-alert-close"
                  onClick={() => window.location.reload()}
                >
                  <Refresh />
                </button>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="om-stats-grid">
              <div className="om-stat-card">
                <div className="om-stat-content">
                  <div className="om-stat-info">
                    <p className="om-stat-label">Total</p>
                    <p className="om-stat-value">{stats.total}</p>
                  </div>
                  <ClipboardList className="om-stat-icon om-text-blue" />
                </div>
              </div>

              <div className="om-stat-card">
                <div className="om-stat-content">
                  <div className="om-stat-info">
                    <p className="om-stat-label">En attente</p>
                    <p className="om-stat-value om-text-yellow">{stats.pending}</p>
                  </div>
                  <Clock className="om-stat-icon om-text-yellow" />
                </div>
              </div>

              <div className="om-stat-card">
                <div className="om-stat-content">
                  <div className="om-stat-info">
                    <p className="om-stat-label">Assignées</p>
                    <p className="om-stat-value om-text-blue">{stats.assigned}</p>
                  </div>
                  <TruckIcon className="om-stat-icon om-text-blue" />
                </div>
              </div>

              <div className="om-stat-card">
                <div className="om-stat-content">
                  <div className="om-stat-info">
                    <p className="om-stat-label">En cours</p>
                    <p className="om-stat-value om-text-purple">{stats.inProgress}</p>
                  </div>
                  <Package className="om-stat-icon om-text-purple" />
                </div>
              </div>

              <div className="om-stat-card">
                <div className="om-stat-content">
                  <div className="om-stat-info">
                    <p className="om-stat-label">Livrées</p>
                    <p className="om-stat-value om-text-green">{stats.delivered}</p>
                  </div>
                  <CheckCircle className="om-stat-icon om-text-green" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="om-card">
              <div className="om-card-header">
                <h3 className="om-card-title">
                  <Filter className="om-card-icon" />
                  Filtres et Recherche
                </h3>
              </div>
              <div className="om-card-content">
                <div className="om-filters-grid">
                  <div className="om-form-group">
                    <label htmlFor="search" className="om-label">Recherche</label>
                    <div className="om-search-container">
                      <Search className="om-search-icon" />
                      <input
                        id="search"
                        type="text"
                        placeholder="Numéro de commande ou client..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="om-search-input"
                      />
                    </div>
                  </div>

                  <div className="om-form-group">
                    <label htmlFor="status-filter" className="om-label">Statut</label>
                    <select
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="om-select"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="assigned">Assignées</option>
                      <option value="in_progress">En cours</option>
                      <option value="delivered">Livrées</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>

                  <div className="om-form-group">
                    <label htmlFor="priority-filter" className="om-label">Priorité</label>
                    <select
                      id="priority-filter"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="om-select"
                    >
                      <option value="all">Toutes les priorités</option>
                      <option value="urgent">Urgente</option>
                      <option value="high">Haute</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Basse</option>
                    </select>
                  </div>

                  <div className="om-form-group">
                    <label htmlFor="date-from" className="om-label">Date de début</label>
                    <input
                      id="date-from"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="om-input"
                    />
                  </div>

                  <div className="om-form-group">
                    <label htmlFor="date-to" className="om-label">Date de fin</label>
                    <input
                      id="date-to"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="om-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="om-card">
              <div className="om-card-header">
                <div className="om-card-header-with-badge">
                  <h3 className="om-card-title">Liste des Commandes</h3>
                  <div className="om-badge">
                    {pagination.total} commande{pagination.total !== 1 ? 's' : ''}
                  </div>
                </div>
                {ordersLoading && (
                  <div className="om-loading-indicator">
                    <LoadingSpinner size="small" />
                  </div>
                )}
              </div>
              <div className="om-card-content">
                <div className="om-table-container">
                  <table className="om-table">
                    <thead>
                      <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                        <th>Camion Assigné</th>
                        <th>Source</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="om-empty-state">
                            <ClipboardList className="om-empty-icon" />
                            <h3 className="om-empty-title">Aucune commande trouvée</h3>
                            <p className="om-empty-message">
                              {Object.values(filters).some(f => f && f !== 'all')
                                ? "Aucune commande ne correspond à vos critères."
                                : "Aucune commande disponible."}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="om-table-row">
                            <td className="om-font-medium">{order.orderNumber}</td>
                            <td>
                              <div className="om-customer-info">
                                <p className="om-customer-name">{order.customer.name}</p>
                                <p className="om-customer-phone">{order.customer.phone}</p>
                              </div>
                            </td>
                            <td>
                              <div className="om-date-info">
                                <p className="om-order-date">
                                  {new Date(order.orderDate).toLocaleDateString("fr-FR")}
                                </p>
                                <p className="om-delivery-date">
                                  Livraison: {new Date(order.requestedDeliveryDate).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className={`om-status-badge ${getStatusColor(order.status)}`}>
                                <span className="om-status-text">{getStatusText(order.status)}</span>
                              </div>
                            </td>
                            <td>
                              <div className={`om-priority-badge ${getPriorityColor(order.priority)}`}>
                                <span className="om-priority-text">{getPriorityText(order.priority)}</span>
                              </div>
                            </td>
                            <td>
                              {order.assignedTruck ? (
                                <div className="om-truck-info">
                                  <p className="om-truck-plate">{order.assignedTruck.plateNumber}</p>
                                  <p className="om-truck-driver">{order.assignedTruck.driverName}</p>
                                </div>
                              ) : (
                                <span className="om-not-assigned">Non assigné</span>
                              )}
                            </td>
                            <td>
                              <div className="om-source-info">
                                {order.orderSource === 'phone' && <Phone className="om-source-icon om-text-blue" />}
                                {order.orderSource === 'app' && <Smartphone className="om-source-icon om-text-green" />}
                                {order.orderSource === 'website' && <ClipboardList className="om-source-icon om-text-purple" />}
                                <span className="om-source-text">
                                  {order.orderSource === 'phone' ? 'Téléphone' : 
                                   order.orderSource === 'app' ? 'Application' : 'Site Web'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="om-action-buttons">
                                <button
                                  onClick={() => handleViewDetails(order)}
                                  className="om-btn om-btn-secondary"
                                  title="Voir les détails"
                                >
                                  <Eye className="om-btn-icon" />
                                </button>
                                <button
                                  onClick={() => handleAssignTruck(order)}
                                  className="om-btn om-btn-secondary"
                                  title="Assigner au camion"
                                >
                                  <TruckIcon className="om-btn-icon" />
                                </button>
                                {order.assignedTruckId && order.status === 'assigned' && (
                                  <button
                                    onClick={() => handleCancelAssignment(order)}
                                    className="om-btn om-btn-danger"
                                    title="Annuler l'assignation"
                                  >
                                    <X className="om-btn-icon" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
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

      {/* Modales */}
      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {isAssignModalOpen && selectedOrder && (
        <TruckAssignmentModal
          order={selectedOrder}
          trucks={trucks}
          drivers={drivers}
          accompagnateurs={accompagnateurs}
          confirmedStatusId={getStatutByCode('CONFIRMEE')?._id}
          loading={trucksLoading || employeesLoading || statutsLoading}
          onSave={handleSaveAssignment}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}  
    </div>
  );
};

export default OrderManagement;