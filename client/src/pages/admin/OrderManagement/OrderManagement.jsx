import React, { useState, useEffect } from 'react'
import {
  MdSearch as Search,
  MdFilterList as Filter,
  MdVisibility as Eye,
  MdLocalShipping as TruckIcon,
  MdPerson as User,
  MdCalendarToday as Calendar,
  MdInventory as Package,
  MdWarning as AlertTriangle,
  MdCheckCircle as CheckCircle,
  MdAccessTime as Clock,
  MdKeyboardArrowUp as ArrowUp,
  MdKeyboardArrowDown as ArrowDown,
  MdRemove as Minus,
  MdClose as X,
  MdCheck as Check,
  MdHistory as History,
  MdPhone as Phone,
  MdSmartphone as Smartphone,
  MdDescription as ClipboardList,
} from 'react-icons/md'
import './OrderManagement.css'

// Mock data
const mockTrucks = [
  {
    id: "truck-001",
    plateNumber: "AB-123-CD",
    model: "Mercedes Sprinter",
    driverName: "Jean Dupont",
    status: "available",
  },
  {
    id: "truck-002",
    plateNumber: "EF-456-GH",
    model: "Iveco Daily",
    driverName: "Marie Martin",
    status: "available",
  },
  {
    id: "truck-003",
    plateNumber: "IJ-789-KL",
    model: "Renault Master",
    driverName: "Pierre Bernard",
    status: "busy",
  },
]

const mockOrders = [
  {
    id: "order-001",
    orderNumber: "CMD-2024-001",
    customer: {
      id: "cust-001",
      name: "Restaurant Le Gourmet",
      phone: "01 23 45 67 89",
      email: "contact@legourmet.fr",
    },
    deliveryAddress: {
      id: "addr-001",
      street: "15 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      region: "Île-de-France",
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-16",
    status: "pending",
    priority: "high",
    products: [
      {
        id: "prod-001",
        productName: "Bouteille Gaz Butane 13kg",
        productCode: "BUT13",
        quantity: 10,
        unit: "bottles",
        unitPrice: 25.5,
        totalPrice: 255.0,
      },
      {
        id: "prod-002",
        productName: "Détendeur Butane",
        productCode: "DET-BUT",
        quantity: 2,
        unit: "units",
        unitPrice: 15.8,
        totalPrice: 31.6,
      },
    ],
    totalAmount: 286.6,
    customerNotes: "Livraison urgente - ouverture restaurant à 18h",
    orderSource: "phone",
    history: [
      {
        id: "hist-001",
        action: "Commande créée",
        details: "Commande passée par téléphone",
        timestamp: "2024-01-15T10:30:00Z",
        userId: "user-001",
        userName: "Réceptionniste",
      },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "order-002",
    orderNumber: "CMD-2024-002",
    customer: {
      id: "cust-002",
      name: "Boulangerie Martin",
      phone: "01 34 56 78 90",
      email: "martin@boulangerie.fr",
    },
    deliveryAddress: {
      id: "addr-002",
      street: "42 Avenue des Champs",
      city: "Paris",
      postalCode: "75008",
      region: "Île-de-France",
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-17",
    status: "assigned",
    priority: "medium",
    assignedTruckId: "truck-001",
    assignedTruck: mockTrucks[0],
    products: [
      {
        id: "prod-003",
        productName: "Bouteille Gaz Propane 35kg",
        productCode: "PRO35",
        quantity: 5,
        unit: "bottles",
        unitPrice: 45.8,
        totalPrice: 229.0,
      },
    ],
    totalAmount: 229.0,
    customerNotes: "Accès par la cour arrière",
    internalNotes: "Client régulier - paiement à 30 jours",
    orderSource: "app",
    history: [
      {
        id: "hist-002",
        action: "Commande créée",
        details: "Commande passée via l'application mobile",
        timestamp: "2024-01-15T14:20:00Z",
        userId: "cust-002",
        userName: "Boulangerie Martin",
      },
      {
        id: "hist-003",
        action: "Assignée au camion",
        details: "Assignée au camion AB-123-CD (Jean Dupont)",
        timestamp: "2024-01-15T15:45:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
    ],
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-15T15:45:00Z",
  },
  {
    id: "order-003",
    orderNumber: "CMD-2024-003",
    customer: {
      id: "cust-003",
      name: "Hôtel Royal",
      phone: "01 45 67 89 01",
      email: "reception@hotelroyal.fr",
    },
    deliveryAddress: {
      id: "addr-003",
      street: "8 Place Vendôme",
      city: "Paris",
      postalCode: "75001",
      region: "Île-de-France",
    },
    orderDate: "2024-01-14",
    requestedDeliveryDate: "2024-01-15",
    status: "delivered",
    priority: "low",
    assignedTruckId: "truck-002",
    assignedTruck: mockTrucks[1],
    products: [
      {
        id: "prod-004",
        productName: "Bouteille Gaz Butane 6kg",
        productCode: "BUT06",
        quantity: 15,
        unit: "bottles",
        unitPrice: 18.5,
        totalPrice: 277.5,
      },
    ],
    totalAmount: 277.5,
    customerNotes: "Réception au sous-sol",
    orderSource: "website",
    history: [
      {
        id: "hist-004",
        action: "Commande créée",
        details: "Commande passée via le site web",
        timestamp: "2024-01-14T09:15:00Z",
        userId: "cust-003",
        userName: "Hôtel Royal",
      },
      {
        id: "hist-005",
        action: "Assignée au camion",
        details: "Assignée au camion EF-456-GH (Marie Martin)",
        timestamp: "2024-01-14T10:30:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
      {
        id: "hist-006",
        action: "Livrée",
        details: "Livraison effectuée avec succès",
        timestamp: "2024-01-15T11:20:00Z",
        userId: "driver-002",
        userName: "Marie Martin",
      },
    ],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
  },
]

const mockUser = {
  id: "admin-001",
  name: "Admin System",
  role: "admin",
}

export default function OrderManagementPage() {
  // TOUS LES HOOKS EN PREMIER
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assignmentData, setAssignmentData] = useState({
    truckId: "",
    priority: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => order.priority === priorityFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, priorityFilter])

  // TOUTES LES FONCTIONS
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "om-status-pending"
      case "assigned":
        return "om-status-assigned"
      case "in_progress":
        return "om-status-in-progress"
      case "delivered":
        return "om-status-delivered"
      case "cancelled":
        return "om-status-cancelled"
      default:
        return "om-status-default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "assigned":
        return "Assignée"
      case "in_progress":
        return "En cours"
      case "delivered":
        return "Livrée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="om-status-icon" />
      case "assigned":
        return <TruckIcon className="om-status-icon" />
      case "in_progress":
        return <Package className="om-status-icon" />
      case "delivered":
        return <CheckCircle className="om-status-icon" />
      case "cancelled":
        return <X className="om-status-icon" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "om-priority-urgent"
      case "high":
        return "om-priority-high"
      case "medium":
        return "om-priority-medium"
      case "low":
        return "om-priority-low"
      default:
        return "om-priority-default"
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case "urgent":
        return "Urgente"
      case "high":
        return "Haute"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return priority
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
      case "high":
        return <ArrowUp className="om-priority-icon" />
      case "medium":
        return <Minus className="om-priority-icon" />
      case "low":
        return <ArrowDown className="om-priority-icon" />
      default:
        return null
    }
  }

  const getOrderSourceIcon = (source) => {
    switch (source) {
      case "phone":
        return <Phone className="om-source-icon om-text-blue" />
      case "app":
        return <Smartphone className="om-source-icon om-text-green" />
      case "website":
        return <ClipboardList className="om-source-icon om-text-purple" />
      default:
        return null
    }
  }

  const getOrderSourceText = (source) => {
    switch (source) {
      case "phone":
        return "Téléphone"
      case "app":
        return "Application"
      case "website":
        return "Site Web"
      default:
        return source
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleAssignTruck = (order) => {
    setSelectedOrder(order)
    setAssignmentData({
      truckId: order.assignedTruckId || "",
      priority: order.priority,
      notes: order.internalNotes || "",
    })
    setIsAssignModalOpen(true)
  }

  const handleSaveAssignment = async () => {
    if (!selectedOrder || !assignmentData.truckId) {
      setNotification({
        type: "error",
        message: "Veuillez sélectionner un camion.",
      })
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedTruck = mockTrucks.find((truck) => truck.id === assignmentData.truckId)

      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const historyEntry = {
            id: `hist-${Date.now()}`,
            action: "Assignée au camion",
            details: `Assignée au camion ${selectedTruck?.plateNumber} (${selectedTruck?.driverName})`,
            timestamp: new Date().toISOString(),
            userId: mockUser.id,
            userName: mockUser.name,
          }
          return {
            ...order,
            status: "assigned",
            priority: assignmentData.priority,
            assignedTruckId: assignmentData.truckId,
            assignedTruck: selectedTruck,
            internalNotes: assignmentData.notes,
            history: [...order.history, historyEntry],
            updatedAt: new Date().toISOString(),
          }
        }
        return order
      })

      setOrders(updatedOrders)
      setIsAssignModalOpen(false)
      setNotification({
        type: "success",
        message: `Commande ${selectedOrder.orderNumber} assignée avec succès au camion ${selectedTruck?.plateNumber}.`,
      })

      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({
        type: "error",
        message: "Erreur lors de l'assignation. Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAssignment = async (order) => {
    if (!order.assignedTruckId) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          const historyEntry = {
            id: `hist-${Date.now()}`,
            action: "Assignation annulée",
            details: "Assignation au camion annulée",
            timestamp: new Date().toISOString(),
            userId: mockUser.id,
            userName: mockUser.name,
          }

          return {
            ...o,
            status: "pending",
            assignedTruckId: undefined,
            assignedTruck: undefined,
            history: [...o.history, historyEntry],
            updatedAt: new Date().toISOString(),
          }
        }
        return o
      })

      setOrders(updatedOrders)
      setNotification({
        type: "success",
        message: `Assignation de la commande ${order.orderNumber} annulée.`,
      })

      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({
        type: "error",
        message: "Erreur lors de l'annulation. Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getOrderStats = () => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === "pending").length
    const assigned = orders.filter((o) => o.status === "assigned").length
    const inProgress = orders.filter((o) => o.status === "in_progress").length
    const delivered = orders.filter((o) => o.status === "delivered").length

    return { total, pending, assigned, inProgress, delivered }
  }

  const stats = getOrderStats()

  return (
    <div className="om-layout">
      
      <div className="om-wrapper">
        <div className="om-container">
          <div className="om-content">
            {/* Header */}
            <div className="om-header">
              <h2 className="om-title">Gestion des Commandes</h2>
              <p className="om-subtitle">Gérez et assignez les commandes clients aux camions</p>
            </div>

            {/* Notification */}
            {notification && (
              <div className={`om-alert ${notification.type === "success" ? "om-alert-success" : "om-alert-error"}`}>
                {notification.type === "success" ? (
                  <CheckCircle className="om-alert-icon" />
                ) : (
                  <AlertTriangle className="om-alert-icon" />
                )}
                <div className="om-alert-content">
                  {notification.message}
                </div>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="om-search-input"
                      />
                    </div>
                  </div>

                  <div className="om-form-group">
                    <label htmlFor="status-filter" className="om-label">Statut</label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
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
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="om-select"
                    >
                      <option value="all">Toutes les priorités</option>
                      <option value="urgent">Urgente</option>
                      <option value="high">Haute</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Basse</option>
                    </select>
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
                    {filteredOrders.length} commande{filteredOrders.length !== 1 ? "s" : ""}
                  </div>
                </div>
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
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="om-empty-state">
                            <ClipboardList className="om-empty-icon" />
                            <h3 className="om-empty-title">Aucune commande trouvée</h3>
                            <p className="om-empty-message">
                              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                                ? "Aucune commande ne correspond à vos critères."
                                : "Aucune commande disponible."}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
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
                                <p className="om-order-date">{new Date(order.orderDate).toLocaleDateString("fr-FR")}</p>
                                <p className="om-delivery-date">
                                  Livraison: {new Date(order.requestedDeliveryDate).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className={`om-status-badge ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="om-status-text">{getStatusText(order.status)}</span>
                              </div>
                            </td>
                            <td>
                              <div className={`om-priority-badge ${getPriorityColor(order.priority)}`}>
                                {getPriorityIcon(order.priority)}
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
                                {getOrderSourceIcon(order.orderSource)}
                                <span className="om-source-text">{getOrderSourceText(order.orderSource)}</span>
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
                                {order.assignedTruckId && order.status === "assigned" && (
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="om-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="om-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="om-modal-header">
              <h2 className="om-modal-title">
                <ClipboardList className="om-modal-icon" />
                Détails de la Commande {selectedOrder.orderNumber}
              </h2>
              <button 
                className="om-modal-close" 
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <X className="om-close-icon" />
              </button>
            </div>

            <div className="om-modal-body">
              <div className="om-details-grid">
                {/* Customer and Order Info */}
                <div className="om-details-section">
                  <div className="om-details-card">
                    <div className="om-details-card-header">
                      <h3 className="om-details-card-title">
                        <User className="om-details-icon" />
                        Informations Client
                      </h3>
                    </div>
                    <div className="om-details-card-content">
                      <div className="om-detail-item">
                        <label className="om-detail-label">Nom</label>
                        <span className="om-detail-value">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="om-detail-item">
                        <label className="om-detail-label">Téléphone</label>
                        <span className="om-detail-value">{selectedOrder.customer.phone}</span>
                      </div>
                      {selectedOrder.customer.email && (
                        <div className="om-detail-item">
                          <label className="om-detail-label">Email</label>
                          <span className="om-detail-value">{selectedOrder.customer.email}</span>
                        </div>
                      )}
                      <div className="om-detail-item">
                        <label className="om-detail-label">Adresse de livraison</label>
                        <span className="om-detail-value">
                          {selectedOrder.deliveryAddress.street}<br />
                          {selectedOrder.deliveryAddress.postalCode} {selectedOrder.deliveryAddress.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="om-details-section">
                  <div className="om-details-card">
                    <div className="om-details-card-header">
                      <h3 className="om-details-card-title">
                        <Calendar className="om-details-icon" />
                        Informations Commande
                      </h3>
                    </div>
                    <div className="om-details-card-content">
                      <div className="om-detail-item">
                        <label className="om-detail-label">Date de commande</label>
                        <span className="om-detail-value">{new Date(selectedOrder.orderDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="om-detail-item">
                        <label className="om-detail-label">Livraison souhaitée</label>
                        <span className="om-detail-value">{new Date(selectedOrder.requestedDeliveryDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="om-detail-item">
                        <label className="om-detail-label">Statut</label>
                        <div className={`om-status-badge ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="om-status-text">{getStatusText(selectedOrder.status)}</span>
                        </div>
                      </div>
                      <div className="om-detail-item">
                        <label className="om-detail-label">Priorité</label>
                        <div className={`om-priority-badge ${getPriorityColor(selectedOrder.priority)}`}>
                          {getPriorityIcon(selectedOrder.priority)}
                          <span className="om-priority-text">{getPriorityText(selectedOrder.priority)}</span>
                        </div>
                      </div>
                      <div className="om-detail-item">
                        <label className="om-detail-label">Source</label>
                        <div className="om-source-info">
                          {getOrderSourceIcon(selectedOrder.orderSource)}
                          <span className="om-source-text">{getOrderSourceText(selectedOrder.orderSource)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="om-products-section">
                <div className="om-details-card">
                  <div className="om-details-card-header">
                    <h3 className="om-details-card-title">
                      <Package className="om-details-icon" />
                      Produits Commandés
                    </h3>
                  </div>
                  <div className="om-details-card-content">
                    <div className="om-products-list">
                      {selectedOrder.products.map((product) => (
                        <div key={product.id} className="om-product-item">
                          <div className="om-product-info">
                            <h4 className="om-product-name">{product.productName}</h4>
                            <p className="om-product-code">Code: {product.productCode}</p>
                          </div>
                          <div className="om-product-details">
                            <p className="om-product-quantity">
                              {product.quantity} {product.unit}
                            </p>
                            <p className="om-product-price">{product.totalPrice.toFixed(2)}€</p>
                          </div>
                        </div>
                      ))}
                      <div className="om-separator" />
                      <div className="om-total-section">
                        <span className="om-total-label">Total:</span>
                        <span className="om-total-value">{selectedOrder.totalAmount.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {(selectedOrder.customerNotes || selectedOrder.internalNotes) && (
                <div className="om-notes-section">
                  <div className="om-details-card">
                    <div className="om-details-card-header">
                      <h3 className="om-details-card-title">Notes</h3>
                    </div>
                    <div className="om-details-card-content">
                      {selectedOrder.customerNotes && (
                        <div className="om-note-item">
                          <label className="om-detail-label">Notes du client</label>
                          <p className="om-customer-note">{selectedOrder.customerNotes}</p>
                        </div>
                      )}
                      {selectedOrder.internalNotes && (
                        <div className="om-note-item">
                          <label className="om-detail-label">Notes internes</label>
                          <p className="om-internal-note">{selectedOrder.internalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              <div className="om-history-section">
                <div className="om-details-card">
                  <div className="om-details-card-header">
                    <h3 className="om-details-card-title">
                      <History className="om-details-icon" />
                      Historique des Changements
                    </h3>
                  </div>
                  <div className="om-details-card-content">
                    <div className="om-history-list">
                      {selectedOrder.history.map((entry) => (
                        <div key={entry.id} className="om-history-item">
                          <div className="om-history-dot" />
                          <div className="om-history-content">
                            <div className="om-history-header">
                              <h4 className="om-history-action">{entry.action}</h4>
                              <span className="om-history-time">
                                {new Date(entry.timestamp).toLocaleString("fr-FR")}
                              </span>
                            </div>
                            <p className="om-history-details">{entry.details}</p>
                            <p className="om-history-user">Par: {entry.userName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Truck Assignment Modal */}
      {isAssignModalOpen && selectedOrder && (
        <div className="om-modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="om-modal-content om-assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="om-modal-header">
              <h2 className="om-modal-title">
                <TruckIcon className="om-modal-icon" />
                Assigner au Camion
              </h2>
              <button 
                className="om-modal-close" 
                onClick={() => setIsAssignModalOpen(false)}
              >
                <X className="om-close-icon" />
              </button>
            </div>

            <div className="om-modal-body">
              <p className="om-assign-description">
                Assignez la commande {selectedOrder.orderNumber} à un camion et définissez sa priorité
              </p>

              <div className="om-assign-form">
                <div className="om-form-group">
                  <label htmlFor="truck-select" className="om-label">Camion *</label>
                  <select
                    id="truck-select"
                    value={assignmentData.truckId}
                    onChange={(e) => setAssignmentData((prev) => ({ ...prev, truckId: e.target.value }))}
                    className="om-select"
                  >
                    <option value="">Sélectionner un camion</option>
                    {mockTrucks.map((truck) => (
                      <option 
                        key={truck.id} 
                        value={truck.id} 
                        disabled={truck.status !== "available"}
                      >
                        {truck.plateNumber} - {truck.model} ({truck.status === "available" ? "Disponible" : "Occupé"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="om-form-group">
                  <label htmlFor="priority-select" className="om-label">Priorité</label>
                  <select
                    id="priority-select"
                    value={assignmentData.priority}
                    onChange={(e) => setAssignmentData((prev) => ({ ...prev, priority: e.target.value }))}
                    className="om-select"
                  >
                    <option value="">Sélectionner une priorité</option>
                    <option value="urgent">Urgente</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>

                <div className="om-form-group">
                  <label htmlFor="assignment-notes" className="om-label">Notes internes (optionnel)</label>
                  <textarea
                    id="assignment-notes"
                    value={assignmentData.notes}
                    onChange={(e) => setAssignmentData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ajoutez des notes pour le chauffeur ou l'équipe..."
                    rows={3}
                    className="om-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="om-modal-footer">
              <button 
                className="om-btn om-btn-secondary" 
                onClick={() => setIsAssignModalOpen(false)}
              >
                <X className="om-btn-icon" />
                Annuler
              </button>
              <button 
                className="om-btn om-btn-primary" 
                onClick={handleSaveAssignment} 
                disabled={loading || !assignmentData.truckId}
              >
                {loading ? (
                  <>
                    <div className="om-spinner" />
                    Assignation...
                  </>
                ) : (
                  <>
                    <Check className="om-btn-icon" />
                    Confirmer l'Assignation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}