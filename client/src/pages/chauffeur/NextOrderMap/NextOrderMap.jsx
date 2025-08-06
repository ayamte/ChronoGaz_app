import React, { useState, useEffect, useRef } from 'react'
import {
  MdLocationOn as MapPin,
  MdNavigation as Navigation,
  MdInventory as Package,
  MdAccessTime as Clock,
  MdCheckCircle as CheckCircle,
  MdRoute as Route,
  MdWarning as AlertTriangle,
  MdKeyboardArrowUp as ArrowUp,
  MdKeyboardArrowDown as ArrowDown,
  MdRemove as Minus,
  MdGpsFixed as Target,
  MdRefresh as Loader2,
  MdClose as X,
  MdVisibility as Eye,
  MdPhone as Phone,
  MdEmail as Email,
  MdAdd as Plus
} from 'react-icons/md'
import './NextOrderMap.css'

// Mock data
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
      latitude: 48.8566,
      longitude: 2.3522,
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-16",
    status: "assigned",
    priority: "urgent",
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
    customerNotes: "Livraison urgente - ouverture restaurant à 18h. Accès par la cour arrière.",
    estimatedDeliveryTime: "14:30",
    timeWindow: { start: "14:00", end: "16:00" },
    history: [
      {
        id: "hist-001",
        action: "Commande assignée",
        details: "Assignée au camion AB-123-CD",
        timestamp: "2024-01-15T10:30:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
    ],
    distanceFromCurrent: 2.5,
    estimatedTravelTime: 15,
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
      latitude: 48.8698,
      longitude: 2.3075,
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-16",
    status: "assigned",
    priority: "high",
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
    customerNotes: "Accès par la cour arrière. Sonner 2 fois.",
    estimatedDeliveryTime: "16:00",
    timeWindow: { start: "15:30", end: "17:30" },
    history: [
      {
        id: "hist-002",
        action: "Commande assignée",
        details: "Assignée au camion AB-123-CD",
        timestamp: "2024-01-15T11:00:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
    ],
    distanceFromCurrent: 4.2,
    estimatedTravelTime: 25,
  },
  {
    id: "order-003",
    orderNumber: "CMD-2024-003",
    customer: {
      id: "cust-003",
      name: "Café Central",
      phone: "01 56 78 90 12",
      email: "contact@cafecentral.fr",
    },
    deliveryAddress: {
      id: "addr-003",
      street: "25 Boulevard Saint-Germain",
      city: "Paris",
      postalCode: "75005",
      region: "Île-de-France",
      latitude: 48.8534,
      longitude: 2.3488,
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-16",
    status: "assigned",
    priority: "medium",
    products: [
      {
        id: "prod-004",
        productName: "Bouteille Gaz Butane 6kg",
        productCode: "BUT06",
        quantity: 8,
        unit: "bottles",
        unitPrice: 18.5,
        totalPrice: 148.0,
      },
    ],
    totalAmount: 148.0,
    customerNotes: "Réception au sous-sol. Demander M. Dubois.",
    estimatedDeliveryTime: "17:30",
    timeWindow: { start: "17:00", end: "19:00" },
    history: [
      {
        id: "hist-003",
        action: "Commande assignée",
        details: "Assignée au camion AB-123-CD",
        timestamp: "2024-01-15T11:30:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
    ],
    distanceFromCurrent: 3.1,
    estimatedTravelTime: 18,
  },
  {
    id: "order-004",
    orderNumber: "CMD-2024-004",
    customer: {
      id: "cust-004",
      name: "Hôtel Moderne",
      phone: "01 67 89 01 23",
      email: "reception@hotelmoderne.fr",
    },
    deliveryAddress: {
      id: "addr-004",
      street: "8 Rue de Rivoli",
      city: "Paris",
      postalCode: "75004",
      region: "Île-de-France",
      latitude: 48.8575,
      longitude: 2.3514,
    },
    orderDate: "2024-01-15",
    requestedDeliveryDate: "2024-01-16",
    status: "assigned",
    priority: "low",
    products: [
      {
        id: "prod-005",
        productName: "Bouteille Gaz Butane 13kg",
        productCode: "BUT13",
        quantity: 3,
        unit: "bottles",
        unitPrice: 25.5,
        totalPrice: 76.5,
      },
    ],
    totalAmount: 76.5,
    customerNotes: "Livraison en matinée de préférence.",
    estimatedDeliveryTime: "18:30",
    timeWindow: { start: "18:00", end: "20:00" },
    history: [
      {
        id: "hist-004",
        action: "Commande assignée",
        details: "Assignée au camion AB-123-CD",
        timestamp: "2024-01-15T12:00:00Z",
        userId: "admin-001",
        userName: "Admin System",
      },
    ],
    distanceFromCurrent: 1.8,
    estimatedTravelTime: 12,
  },
]

const mockUser = {
  id: "driver-001",
  name: "Jean Dupont",
  role: "chauffeur",
  truckId: "truck-001",
  currentLocation: {
    latitude: 48.8566,
    longitude: 2.3522,
  },
}

export default function NextOrderMapPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusAction, setStatusAction] = useState('') // 'delivered' ou 'cancelled'
  const [statusNote, setStatusNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)

  // Filtrer les commandes actives (exclure livrées et annulées)
  const activeOrders = orders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  )

  // Sort orders by priority and estimated travel time
  const sortedOrders = [...activeOrders].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return (a.estimatedTravelTime || 0) - (b.estimatedTravelTime || 0)
  })

  // Get next order (highest priority, shortest travel time)
  const nextOrder = sortedOrders[0]

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "nom-priority-urgent"
      case "high":
        return "nom-priority-high"
      case "medium":
        return "nom-priority-medium"
      case "low":
        return "nom-priority-low"
      default:
        return "nom-priority-default"
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
        return <ArrowUp className="nom-priority-icon" />
      case "medium":
        return <Minus className="nom-priority-icon" />
      case "low":
        return <ArrowDown className="nom-priority-icon" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "nom-status-assigned"
      case "en_route":
        return "nom-status-en-route"
      case "delivered":
        return "nom-status-delivered"
      default:
        return "nom-status-default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "assigned":
        return "Assignée"
      case "en_route":
        return "En route"
      case "delivered":
        return "Livrée"
      default:
        return status
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleStartRoute = async (order) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            status: "en_route",
            history: [
              ...o.history,
              {
                id: `hist-${Date.now()}`,
                action: "En route",
                details: "Chauffeur en route vers le client",
                timestamp: new Date().toISOString(),
                userId: mockUser.id,
                userName: mockUser.name,
              },
            ],
          }
        }
        return o
      })

      setOrders(updatedOrders)
      setNotification({
        type: "success",
        message: `Route démarrée vers ${order.customer.name}`,
      })

      // Open navigation app
      const address = `${order.deliveryAddress.street}, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
      const encodedAddress = encodeURIComponent(address)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")

      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({
        type: "error",
        message: "Erreur lors du démarrage de la route",
      })
    } finally {
      setLoading(false)
    }
  }

  // Nouvelle fonction pour gérer le changement de statut
  const handleStatusChange = async (order, newStatus, note = '') => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            status: newStatus,
            history: [
              ...o.history,
              {
                id: `hist-${Date.now()}`,
                action: newStatus === 'delivered' ? 'Livrée' : 'Annulée',
                details: note || (newStatus === 'delivered' ? 'Commande livrée avec succès' : 'Commande annulée'),
                timestamp: new Date().toISOString(),
                userId: mockUser.id,
                userName: mockUser.name,
              },
            ],
          }
        }
        return o
      })

      setOrders(updatedOrders)
      setIsStatusModalOpen(false)
      setStatusNote('')
      setNotification({
        type: "success",
        message: `Commande ${order.orderNumber} marquée comme ${newStatus === 'delivered' ? 'livrée' : 'annulée'}`,
      })

      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({
        type: "error",
        message: "Erreur lors de la mise à jour du statut",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMapMarkerColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#ef4444" // red-500
      case "high":
        return "#f97316" // orange-500
      case "medium":
        return "#eab308" // yellow-500
      case "low":
        return "#22c55e" // green-500
      default:
        return "#6b7280" // gray-500
    }
  }

  return (
    <div className="nom-layout">
      
      <div className="nom-wrapper">
        <div className="nom-container">
          {/* Header */}


          <main className="nom-main">
            <div className="nom-page-header">
              <h2 className="nom-page-title">Carte des Prochaines Commandes</h2>
              <p className="nom-page-subtitle">Visualisez vos commandes assignées et planifiez votre itinéraire</p>
            </div>

            {/* Notification */}
            {notification && (
              <div className={`nom-alert nom-alert-${notification.type}`}>
                {notification.type === "success" ? (
                  <CheckCircle className="nom-alert-icon" />
                ) : notification.type === "error" ? (
                  <AlertTriangle className="nom-alert-icon" />
                ) : (
                  <Target className="nom-alert-icon" />
                )}
                <div className="nom-alert-content">
                  {notification.message}
                </div>
              </div>
            )}

            {/* Next Order Priority Card */}
            {nextOrder && (
              <div className="nom-card nom-priority-card">
                <div className="nom-card-header">
                  <div className="nom-card-title">
                    <Target className="nom-card-icon" />
                    <span>Prochaine Commande Prioritaire</span>
                  </div>
                </div>
                <div className="nom-card-content">
                  <div className="nom-priority-content">
                    <div className="nom-priority-info">
                      <div className="nom-badges">
                        <span className={`nom-badge ${getPriorityColor(nextOrder.priority)}`}>
                          {getPriorityIcon(nextOrder.priority)}
                          <span className="nom-badge-text">{getPriorityText(nextOrder.priority)}</span>
                        </span>
                        <span className={`nom-badge ${getStatusColor(nextOrder.status)}`}>
                          {getStatusText(nextOrder.status)}
                        </span>
                      </div>
                      <h3 className="nom-customer-name">{nextOrder.customer.name}</h3>
                      <p className="nom-order-number">Commande: {nextOrder.orderNumber}</p>
                      <div className="nom-order-details">
                        <div className="nom-detail-item">
                          <MapPin className="nom-detail-icon" />
                          <span>
                            {nextOrder.deliveryAddress.street}, {nextOrder.deliveryAddress.city}
                          </span>
                        </div>
                        <div className="nom-detail-item">
                          <Clock className="nom-detail-icon" />
                          <span>
                            {nextOrder.timeWindow.start} - {nextOrder.timeWindow.end}
                          </span>
                        </div>
                        <div className="nom-detail-item">
                          <Route className="nom-detail-icon" />
                          <span>
                            {nextOrder.distanceFromCurrent}km • {nextOrder.estimatedTravelTime}min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="nom-priority-actions">
                      <button 
                        className="nom-btn nom-btn-secondary" 
                        onClick={() => handleViewDetails(nextOrder)}
                      >
                        Détails
                      </button>
                      
                      {/* Nouveau bouton pour marquer comme livré */}
                      <button 
                        className="nom-btn nom-btn-success" 
                        onClick={() => {
                          setSelectedOrder(nextOrder)
                          setStatusAction('delivered')
                          setIsStatusModalOpen(true)
                        }}
                        disabled={loading}
                      >
                        <CheckCircle className="nom-btn-icon" />
                        Marquer Livré
                      </button>

                      {/* Nouveau bouton pour annuler */}
                      <button 
                        className="nom-btn nom-btn-danger" 
                        onClick={() => {
                          setSelectedOrder(nextOrder)
                          setStatusAction('cancelled')
                          setIsStatusModalOpen(true)
                        }}
                        disabled={loading}
                      >
                        <X className="nom-btn-icon" />
                        Annuler
                      </button>

                      {nextOrder.status === "assigned" && (
                        <button 
                          className="nom-btn nom-btn-primary" 
                          onClick={() => handleStartRoute(nextOrder)} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="nom-btn-icon nom-spinner" />
                              Démarrage...
                            </>
                          ) : (
                            <>
                              <Navigation className="nom-btn-icon" />
                              Démarrer Route
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="nom-content-grid">
              {/* Map Section */}
              <div className="nom-map-section">
                <div className="nom-card nom-map-card">
                  <div className="nom-card-header">
                    <div className="nom-card-title">
                      <MapPin className="nom-card-icon" />
                      <span>Carte Interactive</span>
                    </div>
                  </div>
                  <div className="nom-card-content nom-map-content">
                    <div ref={mapRef} className="nom-map-container">
                      {!mapLoaded ? (
                        <div className="nom-map-loading">
                          <div className="nom-loading-content">
                            <Loader2 className="nom-loading-spinner" />
                            <p className="nom-loading-text">Chargement de la carte...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="nom-map-wrapper">
                          {/* Simulated Map Background */}
                          <div className="nom-map-bg" />

                          {/* Map Legend */}
                          <div className="nom-map-legend">
                            <h4 className="nom-legend-title">Légende des Priorités</h4>
                            <div className="nom-legend-items">
                              <div className="nom-legend-item">
                                <div className="nom-legend-color nom-legend-urgent"></div>
                                <span className="nom-legend-label">Urgente</span>
                              </div>
                              <div className="nom-legend-item">
                                <div className="nom-legend-color nom-legend-high"></div>
                                <span className="nom-legend-label">Haute</span>
                              </div>
                              <div className="nom-legend-item">
                                <div className="nom-legend-color nom-legend-medium"></div>
                                <span className="nom-legend-label">Moyenne</span>
                              </div>
                              <div className="nom-legend-item">
                                <div className="nom-legend-color nom-legend-low"></div>
                                <span className="nom-legend-label">Basse</span>
                              </div>
                            </div>
                          </div>

                          {/* Simulated Map Markers */}
                          <div className="nom-map-markers">
                            {activeOrders.map((order, index) => (
                              <div
                                key={order.id}
                                className="nom-map-marker"
                                style={{
                                  left: `${20 + index * 15}%`,
                                  top: `${30 + index * 10}%`,
                                  backgroundColor: getMapMarkerColor(order.priority)
                                }}
                                onClick={() => handleViewDetails(order)}
                              >
                                <span className="nom-marker-number">{index + 1}</span>
                                <div className="nom-marker-tooltip">
                                  <p className="nom-tooltip-name">{order.customer.name}</p>
                                  <p className="nom-tooltip-order">{order.orderNumber}</p>
                                </div>
                              </div>
                            ))}

                            {/* Current Location Marker */}
                            <div className="nom-current-location">
                              <div className="nom-current-marker"></div>
                              <div className="nom-current-label">Ma position</div>
                            </div>
                          </div>

                          {/* Map Controls */}
                          <div className="nom-map-controls">
                            <button className="nom-map-control">
                              <Navigation className="nom-control-icon" />
                            </button>
                            <button className="nom-map-control">
                              <Plus className="nom-control-icon" />
                            </button>
                            <button className="nom-map-control">
                              <Minus className="nom-control-icon" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="nom-orders-section">
                <div className="nom-card nom-orders-card">
                  <div className="nom-card-header">
                    <div className="nom-card-title">
                      <Package className="nom-card-icon" />
                      <span>Mes Commandes</span>
                    </div>
                    <span className="nom-orders-count">{activeOrders.length} commandes</span>
                  </div>
                  <div className="nom-card-content nom-orders-content">
                    <div className="nom-orders-list">
                      {sortedOrders.map((order, index) => (
                        <div
                          key={order.id}
                          className={`nom-order-item ${
                            order.id === nextOrder?.id ? "nom-order-next" : ""
                          }`}
                          onClick={() => handleViewDetails(order)}
                        >
                          <div className="nom-order-header">
                            <div className="nom-order-left">
                              <div
                                className="nom-order-marker"
                                style={{ backgroundColor: getMapMarkerColor(order.priority) }}
                              >
                                {index + 1}
                              </div>
                              <span className={`nom-badge ${getPriorityColor(order.priority)}`}>
                                {getPriorityIcon(order.priority)}
                                <span className="nom-badge-text">{getPriorityText(order.priority)}</span>
                              </span>
                            </div>
                            <span className={`nom-badge ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>

                          <h3 className="nom-order-customer">{order.customer.name}</h3>
                          <p className="nom-order-number">{order.orderNumber}</p>

                          <div className="nom-order-info">
                            <div className="nom-order-detail">
                              <MapPin className="nom-order-icon" />
                              <span className="nom-order-address">
                                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                              </span>
                            </div>
                            <div className="nom-order-detail">
                              <Clock className="nom-order-icon" />
                              <span>
                                {order.timeWindow.start} - {order.timeWindow.end}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="nom-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="nom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="nom-modal-header">
              <div className="nom-modal-title">
                <Eye className="nom-modal-icon" />
                <span>Détails de la Commande</span>
              </div>
              <button 
                className="nom-modal-close" 
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <X className="nom-close-icon" />
              </button>
            </div>

            <div className="nom-modal-body">
              <div className="nom-details-grid">
                {/* Customer Info */}
                <div className="nom-details-section">
                  <div className="nom-details-card">
                    <div className="nom-details-header">
                      <h4 className="nom-details-title">Informations Client</h4>
                    </div>
                    <div className="nom-details-content">
                      <div className="nom-detail-row">
                        <span className="nom-detail-label">Nom:</span>
                        <span className="nom-detail-value">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="nom-detail-row">
                        <Phone className="nom-detail-icon" />
                        <span className="nom-detail-value">{selectedOrder.customer.phone}</span>
                      </div>
                      {selectedOrder.customer.email && (
                        <div className="nom-detail-row">
                          <Email className="nom-detail-icon" />
                          <span className="nom-detail-value">{selectedOrder.customer.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="nom-details-section">
                  <div className="nom-details-card">
                    <div className="nom-details-header">
                      <h4 className="nom-details-title">Adresse de Livraison</h4>
                    </div>
                    <div className="nom-details-content">
                      <div className="nom-detail-row">
                        <MapPin className="nom-detail-icon" />
                        <div className="nom-address-info">
                          <p>{selectedOrder.deliveryAddress.street}</p>
                          <p>{selectedOrder.deliveryAddress.postalCode} {selectedOrder.deliveryAddress.city}</p>
                          <p>{selectedOrder.deliveryAddress.region}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="nom-details-section nom-full-width">
                <div className="nom-details-card">
                  <div className="nom-details-header">
                    <h4 className="nom-details-title">Produits Commandés</h4>
                  </div>
                  <div className="nom-details-content">
                    <div className="nom-products-list">
                      {selectedOrder.products.map((product) => (
                        <div key={product.id} className="nom-product-item">
                          <div className="nom-product-info">
                            <h5 className="nom-product-name">{product.productName}</h5>
                            <p className="nom-product-code">Code: {product.productCode}</p>
                          </div>
                          <div className="nom-product-details">
                            <p className="nom-product-quantity">
                              {product.quantity} {product.unit}
                            </p>
                            <p className="nom-product-price">
                              {product.unitPrice.toFixed(2)}€ / unité
                            </p>
                            <p className="nom-product-total">
                              Total: {product.totalPrice.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="nom-order-total">
                      <div className="nom-total-row">
                        <span className="nom-total-label">Total Commande:</span>
                        <span className="nom-total-value">{selectedOrder.totalAmount.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.customerNotes && (
                <div className="nom-details-section nom-full-width">
                  <div className="nom-details-card">
                    <div className="nom-details-header">
                      <h4 className="nom-details-title">Notes du Client</h4>
                    </div>
                    <div className="nom-details-content">
                      <p className="nom-customer-notes">{selectedOrder.customerNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History */}
              <div className="nom-details-section nom-full-width">
                <div className="nom-details-card">
                  <div className="nom-details-header">
                    <h4 className="nom-details-title">Historique de la Commande</h4>
                  </div>
                  <div className="nom-details-content">
                    <div className="nom-history-list">
                      {selectedOrder.history.map((entry) => (
                        <div key={entry.id} className="nom-history-item">
                          <div className="nom-history-dot"></div>
                          <div className="nom-history-content">
                            <div className="nom-history-header">
                              <h5 className="nom-history-action">{entry.action}</h5>
                              <span className="nom-history-time">
                                {new Date(entry.timestamp).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            <p className="nom-history-details">{entry.details}</p>
                            <p className="nom-history-user">Par: {entry.userName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="nom-modal-footer">
              <button 
                className="nom-btn nom-btn-secondary" 
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Fermer
              </button>
              {selectedOrder.status === "assigned" && (
                <button 
                  className="nom-btn nom-btn-primary" 
                  onClick={() => handleStartRoute(selectedOrder)} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="nom-btn-icon nom-spinner" />
                      Démarrage...
                    </>
                  ) : (
                    <>
                      <Navigation className="nom-btn-icon" />
                      Démarrer Route
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="nom-modal-overlay" onClick={() => setIsStatusModalOpen(false)}>
          <div className="nom-modal-content nom-status-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nom-modal-header">
              <div className="nom-modal-title">
                {statusAction === 'delivered' ? (
                  <>
                    <CheckCircle className="nom-modal-icon" />
                    <span>Marquer comme Livrée</span>
                  </>
                ) : (
                  <>
                    <X className="nom-modal-icon" />
                    <span>Annuler la Commande</span>
                  </>
                )}
              </div>
              <button 
                className="nom-modal-close" 
                onClick={() => setIsStatusModalOpen(false)}
              >
                <X className="nom-close-icon" />
              </button>
            </div>

            <div className="nom-modal-body">
              <div className="nom-status-info">
                <h3 className="nom-status-customer">{selectedOrder.customer.name}</h3>
                <p className="nom-status-order">Commande: {selectedOrder.orderNumber}</p>
              </div>

              <div className="nom-form-group">
                <label htmlFor="status-note" className="nom-form-label">
                  {statusAction === 'delivered' ? 'Note de livraison (optionnel)' : 'Raison de l\'annulation'}
                </label>
                <textarea
                  id="status-note"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={statusAction === 'delivered' 
                    ? "Ajouter une note sur la livraison..." 
                    : "Expliquer la raison de l'annulation..."
                  }
                  className="nom-form-textarea"
                  rows={3}
                  required={statusAction === 'cancelled'}
                />
              </div>
            </div>

            <div className="nom-modal-footer">
              <button 
                className="nom-btn nom-btn-secondary" 
                onClick={() => setIsStatusModalOpen(false)}
              >
                Annuler
              </button>
              <button 
                className={`nom-btn ${statusAction === 'delivered' ? 'nom-btn-success' : 'nom-btn-danger'}`}
                onClick={() => handleStatusChange(selectedOrder, statusAction, statusNote)}
                disabled={loading || (statusAction === 'cancelled' && !statusNote.trim())}
              >
                {loading ? (
                  <>
                    <Loader2 className="nom-btn-icon nom-spinner" />
                    Traitement...
                  </>
                ) : (
                  <>
                    {statusAction === 'delivered' ? (
                      <>
                        <CheckCircle className="nom-btn-icon" />
                        Confirmer Livraison
                      </>
                    ) : (
                      <>
                        <X className="nom-btn-icon" />
                        Confirmer Annulation
                      </>
                    )}
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