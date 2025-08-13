// chronogaz_front/src/pages/admin/OrderTrackingManagement/suiviCommande.jsx

import { useState, useEffect } from "react"
import {
  MdSearch as Search,
  MdVisibility as Eye,
  MdClose as X,
  MdStar as Star,
  MdStarBorder as StarBorder,
} from "react-icons/md"
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar'
import "./suiviCommande.css"

export default function OrderTrackingManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedOrder, setSelectedOrder] = useState(null)
const [selectedOrderLignes, setSelectedOrderLignes] = useState([]) // Nouvel état pour les lignes de commande
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
const [detailsLoading, setDetailsLoading] = useState(false)

  // Fonction asynchrone pour récupérer les commandes depuis l'API backend
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/commands");
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      // La réponse de l'API contient un objet avec une propriété 'data' qui est le tableau des commandes.
      // Il faut transformer ce tableau pour qu'il corresponde au format attendu par le composant.
      const transformedOrders = result.data.map(order => {
        // Gérer le cas où l'utilisateur physique est manquant pour les clients MORAUX
        const clientName = order.customer_id.physical_user_id 
          ? `${order.customer_id.physical_user_id.first_name} ${order.customer_id.physical_user_id.last_name}`
          : "Client moral";
        
        // Gérer les cas où le camion n'est pas encore planifié
        const camionMatricule = order.planification && order.planification.truck_id 
          ? order.planification.truck_id.matricule 
          : '-';
          
        // Mappage des types de clients de l'API vers le composant
        let typeClient = order.customer_id.type_client;
        if (typeClient === 'PHYSIQUE') {
          typeClient = 'Particulier';
        } else if (typeClient === 'MORAL') {
          typeClient = 'Professionnel'; // ou Industriel, selon la logique métier
        }
        
        return {
          id: order._id, // Utiliser l'ID unique de MongoDB
          numeroCmd: order.numero_commande,
          client: clientName,
          typeClient: typeClient,
          adresseComplete: `${order.address_livraison_id.rue}, ${order.address_livraison_id.ville}`,
          region: `${order.address_livraison_id.ville}, ${order?.address_livraison_id?.region_id?.nom}`,
          date: order.date_commande,
          heure: new Date(order.date_commande).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          // Ces valeurs ne sont pas dans l'API, on utilise des valeurs par défaut pour éviter les erreurs
          typeProduit: "Non spécifié",
          prixUnitaire: 0, 
          prixLivraison: 0,
          total: order.total_ttc,
          statut: order.statut_id.nom,
          camion: camionMatricule,
          commentaire: order.commentaires || "Aucun commentaire",
          evaluation: 0 // Valeur par défaut
        };
      });
      
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error("Échec de la récupération des commandes:", err);
      setError("Impossible de charger les commandes. Veuillez vérifier votre connexion et l'état du serveur.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = Array.isArray(orders) ? orders.filter(
    (order) =>
      order.numeroCmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.camion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.includes(searchTerm)
  ) : [];

  const getStatusBadgeClass = (statut) => {
    switch (statut.toLowerCase()) {
      case 'livrée':
        return 'tracking-badge-delivered'
      case 'en cours':
        return 'tracking-badge-in-progress'
      case 'planifiée':
        return 'tracking-badge-preparing'
      case 'confirmée':
        return 'tracking-badge-in-progress'
      case 'annulée':
        return 'tracking-badge-cancelled'
      default:
        return 'tracking-badge-default'
    }
  }

  const getClientTypeBadgeClass = (typeClient) => {
    switch (typeClient.toLowerCase()) {
      case 'particulier':
        return 'tracking-client-badge-particulier'
      case 'professionnel':
        return 'tracking-client-badge-professionnel'
      case 'industriel':
        return 'tracking-client-badge-industriel'
      default:
        return 'tracking-client-badge-default'
    }
  }

  const handleViewDetails = async (order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
    setDetailsLoading(true) // Activer le chargement
  
    try {
      const response = await fetch(`http://localhost:5001/api/commands/${order.id}`)
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      setSelectedOrderLignes(result.data.lignes);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails de la commande:", err);
      setSelectedOrderLignes([]);
    } finally {
      setDetailsLoading(false); // Désactiver le chargement
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ?
        <Star key={i} className="tracking-star-filled" /> :
        <StarBorder key={i} className="tracking-star-empty" />
      )
    }
    return stars
  }

  return (
    <div className="tracking-management-layout">
      <SidebarNavigation />
      
      <div className="tracking-management-wrapper">
        <div className="tracking-management-container">
          <div className="tracking-management-content">
            {/* En-tête */}
            <div className="tracking-page-header">
              <h1 className="tracking-page-title">Suivi des Commandes</h1>
              <p className="tracking-page-subtitle">Suivez l'état de toutes les commandes en temps réel</p>
            </div>

            {/* Barre de recherche */}
            <div className="tracking-search-section">
              <div className="tracking-search-container">
                <Search className="tracking-search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher par N° commande, client, région, statut..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tracking-search-input"
                />
              </div>
            </div>

            {/* Affichage conditionnel basé sur l'état de l'API */}
            {loading ? (
              <div className="tracking-loading-container">
                <div className="tracking-loading-spinner"></div>
                <p>Chargement des commandes en cours...</p>
              </div>
            ) : error ? (
              <div className="tracking-error-container">
                <p className="tracking-error-message">{error}</p>
                <button onClick={fetchOrders} className="tracking-retry-button">
                  Réessayer
                </button>
              </div>
            ) : (
              /* Tableau */
              <div className="tracking-table-card">
                <div className="tracking-table-header">
                  <h3 className="tracking-table-title">Liste des Commandes</h3>
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
                          <th>Total (MAD)</th>
                          <th>Statut</th>
                          <th>Camion</th>
                          <th>Détails</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="tracking-font-medium">{order.numeroCmd}</td>
                              <td>{order.client}</td>
                              <td>{order.region}</td>
                              <td>{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                              <td className="tracking-font-medium">{order.total.toFixed(2)} MAD</td>
                              <td>
                                <span className={`tracking-badge ${getStatusBadgeClass(order.statut)}`}>
                                  {order.statut}
                                </span>
                              </td>
                              <td>{order.camion}</td>
                              <td>
                                <button
                                  className="tracking-details-button"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  <Eye className="tracking-details-icon" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="tracking-no-results">
                              Aucune commande trouvée pour votre recherche.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails de commande */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="tracking-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h2 className="tracking-modal-title">Détails de la commande {selectedOrder.numeroCmd}</h2>
              <button className="tracking-modal-close" onClick={() => setIsDetailsModalOpen(false)}>
                <X className="tracking-close-icon" />
              </button>
            </div>
            
            <div className="tracking-modal-body">
              <div className="tracking-details-grid">
                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Nom du client</label>
                  <span className="tracking-detail-value">{selectedOrder.client}</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Type de client</label>
                  <span className={`tracking-client-badge ${getClientTypeBadgeClass(selectedOrder.typeClient)}`}>
                    {selectedOrder.typeClient}
                  </span>
                </div>

                <div className="tracking-detail-item tracking-full-width">
                  <label className="tracking-detail-label">Adresse complète</label>
                  <span className="tracking-detail-value">{selectedOrder.adresseComplete}</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Région</label>
                  <span className="tracking-detail-value">{selectedOrder.region}</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Type de produit</label>
                  <span className="tracking-detail-value">{selectedOrder.typeProduit}</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Prix unitaire</label>
                  <span className="tracking-detail-value">{selectedOrder.prixUnitaire.toFixed(2)} MAD</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Prix de livraison</label>
                  <span className="tracking-detail-value">{selectedOrder.prixLivraison.toFixed(2)} MAD</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Total</label>
                  <span className="tracking-detail-value tracking-total-highlight">{selectedOrder.total.toFixed(2)} MAD</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Date et heure de commande</label>
                  <span className="tracking-detail-value">
                    {new Date(selectedOrder.date).toLocaleDateString('fr-FR')} à {selectedOrder.heure}
                  </span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">Camion</label>
                  <span className="tracking-detail-value">{selectedOrder.camion}</span>
                </div>

                <div className="tracking-detail-item">
                  <label className="tracking-detail-label">État de la commande</label>
                  <span className={`tracking-badge ${getStatusBadgeClass(selectedOrder.statut)}`}>
                    {selectedOrder.statut}
                  </span>
                </div>

                <div className="tracking-detail-item tracking-full-width">
                  <label className="tracking-detail-label">Évaluation</label>
                  <div className="tracking-rating">
                    {renderStars(selectedOrder.evaluation)}
                    <span className="tracking-rating-text">({selectedOrder.evaluation}/5)</span>
                  </div>
                </div>

                <div className="tracking-detail-item tracking-full-width">
                  <label className="tracking-detail-label">Commentaire ou réclamation</label>
                  <span className="tracking-detail-value">{selectedOrder.commentaire || "Aucun commentaire"}</span>
                </div>
              </div>
              {/* NOUVELLE SECTION À AJOUTER ICI */}
        <hr className="tracking-modal-divider" />
        <h3 className="tracking-modal-subtitle">Détails des produits</h3>

        {/* Le code que vous avez fourni pour afficher les lignes de commande */}
        {detailsLoading ? (
            <p className="tracking-details-loading">Chargement des produits...</p>
        ) : (
            <div className="tracking-products-list">
                {selectedOrderLignes.length > 0 ? (
                    selectedOrderLignes.map(ligne => (
                        <div key={ligne._id} className="tracking-product-item">
                            <span className="tracking-product-name">{ligne.product_id.nom_long}</span>
                            <span className="tracking-product-quantity">
                                Quantité: {ligne.quantite} {/*{ligne.um_id.code}*/}
                            </span>
                            <span className="tracking-product-price">
                                Prix unitaire: {ligne.product_id.prix_unitaire.toFixed(2)} MAD
                            </span>
                            <span className="tracking-product-total">
                                Total ligne: {(ligne.quantite * ligne.product_id.prix_unitaire).toFixed(2)} MAD
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Aucun produit trouvé pour cette commande.</p>
                )}
            </div>
        )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

