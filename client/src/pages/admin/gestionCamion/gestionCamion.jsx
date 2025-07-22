import { useState } from "react" 
import { useNavigate } from "react-router-dom"
import {   
  MdSearch as Search,   
  MdAdd as Plus,   
  MdLocalShipping as Truck,   
  MdPeople as Users,   
  MdLocationOn as MapPin,   
  MdVisibility as Eye,  
  MdClose as X  
} from "react-icons/md"  
import "./gestionCamion.css"  
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar'  
  
// Données d'exemple pour les camions  
const trucksData = [  
  {  
    id: 1,  
    plaque: "AB-123-CD",  
    marque: "Mercedes Actros",  
    capacite: "25 tonnes",  
    chauffeur: "Jean Dupont",  
    statut: "Disponible",  
  },  
  {  
    id: 2,  
    plaque: "EF-456-GH",  
    marque: "Volvo FH",  
    capacite: "30 tonnes",  
    chauffeur: "Marie Martin",  
    statut: "En mission",  
  },  
  {  
    id: 3,  
    plaque: "IJ-789-KL",  
    marque: "Scania R-Series",  
    capacite: "28 tonnes",  
    chauffeur: "Pierre Moreau",  
    statut: "Maintenance",  
  },  
  {  
    id: 4,  
    plaque: "MN-012-OP",  
    marque: "DAF XF",  
    capacite: "32 tonnes",  
    chauffeur: "Sophie Bernard",  
    statut: "Disponible",  
  },  
  {  
    id: 5,  
    plaque: "QR-345-ST",  
    marque: "Iveco Stralis",  
    capacite: "26 tonnes",  
    chauffeur: "Luc Petit",  
    statut: "En mission",  
  },  
]  
  
export default function TruckManagement() {
  const navigate = useNavigate()  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  const [formData, setFormData] = useState({  
    plaque: "",  
    marque: "",  
    capacite: "",  
    chauffeur: "",  
    statut: "",  
  })  
  const handleViewDetails = (truckId) => {  
    navigate(`/truck-details/${truckId}`)  
  }
  
  // Filtrer les camions selon le terme de recherche  
  const filteredTrucks = trucksData.filter(  
    (truck) =>  
      truck.plaque.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      truck.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      truck.chauffeur.toLowerCase().includes(searchTerm.toLowerCase()),  
  )  
  
  // Calculer les statistiques  
  const totalTrucks = trucksData.length  
  const availableTrucks = trucksData.filter((truck) => truck.statut === "Disponible").length  
  const trucksInMission = trucksData.filter((truck) => truck.statut === "En mission").length  
  
  const handleInputChange = (field, value) => {  
    setFormData((prev) => ({  
      ...prev,  
      [field]: value,  
    }))  
  }  
  
  const handleSubmit = (e) => {  
    e.preventDefault()  
    // Ici vous pouvez ajouter la logique pour sauvegarder le camion  
    console.log("Nouveau camion:", formData)  
  
    // Réinitialiser le formulaire et fermer le modal  
    setFormData({  
      plaque: "",  
      marque: "",  
      capacite: "",  
      chauffeur: "",  
      statut: "",  
    })  
    setIsDialogOpen(false)  
  }  
  
  const getStatusBadge = (statut) => {  
    switch (statut) {  
      case "Disponible":  
        return <span className="badge badge-available">Disponible</span>  
      case "En mission":  
        return <span className="badge badge-mission">En mission</span>  
      case "Maintenance":  
        return <span className="badge badge-maintenance">Maintenance</span>  
      default:  
        return <span className="badge badge-default">{statut}</span>  
    }  
  }  
  
  return (  
    <div className="truck-management-layout">  
      <SidebarNavigation />  
        
      <div className="truck-management-wrapper">  
        <div className="truck-management-container">  
          <div className="truck-management-content">  
            {/* En-tête */}  
            <div className="page-header">  
              <h1 className="page-title">Gestion des Camions</h1>  
            </div>  
  
            {/* 3 Cards en haut avec gradient */}  
            <div className="camion-stats-grid">  
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Total Camions</h3>  
                    <div className="stat-value">{totalTrucks}</div>  
                    <p className="stat-description">Véhicules dans la flotte</p>  
                  </div>  
                  <div className="stat-icon-container">  
                    <div className="stat-icon blue">  
                      <Truck className="icon" />  
                    </div>  
                  </div>  
                </div>  
              </div>  
  
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Disponibles</h3>  
                    <div className="stat-value">{availableTrucks}</div>  
                    <p className="stat-description">Prêts pour mission</p>  
                  </div>  
                  <div className="stat-icon-container">  
                    <div className="stat-icon green">  
                      <MapPin className="icon" />  
                    </div>  
                  </div>  
                </div>  
              </div>  
  
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">En Mission</h3>  
                    <div className="stat-value">{trucksInMission}</div>  
                    <p className="stat-description">Actuellement en cours</p>  
                  </div>  
                  <div className="stat-icon-container">  
                    <div className="stat-icon orange">  
                      <Users className="icon" />  
                    </div>  
                  </div>  
                </div>  
              </div>  
            </div>  
  
            {/* Bouton Ajouter Camion */}  
            <div className="action-section">  
              <button className="add-button" onClick={() => setIsDialogOpen(true)}>  
                <Plus className="button-icon" />  
                Ajouter Camion  
              </button>  
            </div>  
  
            {/* Barre de recherche */}  
            <div className="search-section">  
              <div className="search-container">  
                <Search className="search-icon" />  
                <input  
                  type="text"  
                  placeholder="Rechercher par plaque, marque ou chauffeur..."  
                  value={searchTerm}  
                  onChange={(e) => setSearchTerm(e.target.value)}  
                  className="search-input"  
                />  
              </div>  
            </div>  
  
            {/* Tableau */}  
            <div className="table-card">  
              <div className="table-header">  
                <h3 className="table-title">Liste des Camions</h3>  
              </div>  
              <div className="table-content">  
                <div className="table-container">  
                  <table className="trucks-table">  
                    <thead>  
                      <tr>  
                        <th>Plaque d'immatriculation</th>  
                        <th>Marque</th>  
                        <th>Capacité</th>  
                        <th>Chauffeur assigné</th>  
                        <th>Statut</th>  
                        <th>Détails</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {filteredTrucks.map((truck) => (  
                        <tr key={truck.id}>  
                          <td className="font-medium">{truck.plaque}</td>  
                          <td>{truck.marque}</td>  
                          <td>{truck.capacite}</td>  
                          <td>{truck.chauffeur}</td>  
                          <td>{getStatusBadge(truck.statut)}</td>  
                          <td>  
                            <button   
                              className="details-button"  
                              onClick={() => handleViewDetails(truck.id)}  
                            >  
                              <Eye className="details-icon" />  
                            </button>  
                          </td> 
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
  
                  {filteredTrucks.length === 0 && (  
                    <div className="no-results">  
                      Aucun camion trouvé pour votre recherche.  
                    </div>  
                  )}  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal/Dialog pour ajouter un camion */}  
      {isDialogOpen && (  
        <div className="modal-overlay" onClick={() => setIsDialogOpen(false)}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">Ajouter Camion</h2>  
              <button className="modal-close" onClick={() => setIsDialogOpen(false)}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleSubmit} className="modal-form">  
              <div className="form-group">  
                <label htmlFor="plaque" className="form-label">Plaque d'immatriculation</label>  
                <input  
                  id="plaque"  
                  type="text"  
                  placeholder="Ex: AB-123-CD"  
                  value={formData.plaque}  
                  onChange={(e) => handleInputChange("plaque", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="marque" className="form-label">Marque</label>  
                <input  
                  id="marque"  
                  type="text"  
                  placeholder="Ex: Mercedes Actros"  
                  value={formData.marque}  
                  onChange={(e) => handleInputChange("marque", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="capacite" className="form-label">Capacité</label>  
                <input  
                  id="capacite"  
                  type="text"  
                  placeholder="Ex: 25 tonnes"  
                  value={formData.capacite}  
                  onChange={(e) => handleInputChange("capacite", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="chauffeur" className="form-label">Chauffeur assigné</label>  
                <input  
                  id="chauffeur"  
                  type="text"  
                  placeholder="Ex: Jean Dupont"  
                  value={formData.chauffeur}  
                  onChange={(e) => handleInputChange("chauffeur", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="statut" className="form-label">Statut</label>  
                <select  
                  id="statut"  
                  value={formData.statut}  
                  onChange={(e) => handleInputChange("statut", e.target.value)}  
                  className="form-select"  
                  required  
                >  
                  <option value="">Sélectionner un statut</option>  
                  <option value="Disponible">Disponible</option>  
                  <option value="En mission">En mission</option>  
                  <option value="Maintenance">Maintenance</option>  
                </select>  
              </div>  
  
              <div className="form-actions">  
                <button type="button" className="cancel-button" onClick={() => setIsDialogOpen(false)}>  
                  Annuler  
                </button>  
                <button type="submit" className="submit-button">  
                  Ajouter  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  
    </div>  
  )  
}