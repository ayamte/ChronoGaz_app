import { useState } from "react"  
import {   
  MdLocalShipping as Truck,   
  MdFitnessCenter as Weight,   
  MdPerson as User,   
  MdEdit as Edit,   
  MdPhone as Phone,   
  MdArrowBack as ArrowLeft,  
  MdClose as X  
} from "react-icons/md"  
import { useNavigate } from "react-router-dom"  
import "./infoCamion.css"  
  
// Données d'exemple pour un camion  
const initialTruckData = {  
  id: 1,  
  plaque: "AB-123-CD",  
  marque: "Mercedes Actros",  
  capacite: "25 tonnes",  
  chauffeur: "Jean Dupont",  
  telephone: "+33 6 12 34 56 78",  
  statut: "Disponible",  
}  
  
export default function TruckDetails() {  
  const [truckData, setTruckData] = useState(initialTruckData)  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)  
  const [formData, setFormData] = useState(truckData)  
  const navigate = useNavigate()  
  
  const handleInputChange = (field, value) => {  
    setFormData((prev) => ({  
      ...prev,  
      [field]: value,  
    }))  
  }  
  
  const handleSubmit = (e) => {  
    e.preventDefault()  
    // Mettre à jour les données du camion  
    setTruckData(formData)  
    setIsEditDialogOpen(false)  
    console.log("Camion modifié:", formData)  
  }  
  
  const handleEditClick = () => {  
    setFormData(truckData) // Réinitialiser le formulaire avec les données actuelles  
    setIsEditDialogOpen(true)  
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
    <div className="truck-details-layout">  
        
      <div className="truck-details-wrapper">  
        <div className="truck-details-container">  
          <div className="truck-details-content">  
            {/* Titre de la page */}  
            <div className="page-header">  
              <button   
                className="back-button"   
                onClick={() => navigate(-1)}  
              >  
                <ArrowLeft className="back-icon" />  
              </button>  
              <h1 className="page-title">Informations du Camion</h1>  
            </div>  
  
            {/* Carte principale avec gradient */}  
            <div className="truck-info-card">  
              <div className="truck-info-content">  
                {/* En-tête avec plaque et statut */}  
                <div className="truck-header">  
                  <h2 className="truck-plaque">{truckData.plaque}</h2>  
                  {getStatusBadge(truckData.statut)}  
                </div>  
  
                {/* Informations du camion en deux colonnes */}  
                <div className="truck-info-grid">  
                  {/* Première colonne */}  
                  <div className="info-column">  
                    {/* Marque */}  
                    <div className="info-item">  
                      <div className="info-icon-container">  
                        <Truck className="info-icon" />  
                      </div>  
                      <div className="info-content">  
                        <p className="info-label">Marque</p>  
                        <p className="info-value">{truckData.marque}</p>  
                      </div>  
                    </div>  
  
                    {/* Capacité */}  
                    <div className="info-item">  
                      <div className="info-icon-container">  
                        <Weight className="info-icon" />  
                      </div>  
                      <div className="info-content">  
                        <p className="info-label">Capacité</p>  
                        <p className="info-value">{truckData.capacite}</p>  
                      </div>  
                    </div>  
                  </div>  
  
                  {/* Deuxième colonne */}  
                  <div className="info-column">  
                    {/* Chauffeur assigné */}  
                    <div className="info-item">  
                      <div className="info-icon-container">  
                        <User className="info-icon" />  
                      </div>  
                      <div className="info-content">  
                        <p className="info-label">Chauffeur assigné</p>  
                        <p className="info-value">{truckData.chauffeur}</p>  
                      </div>  
                    </div>  
  
                    {/* Numéro de téléphone */}  
                    <div className="info-item">  
                      <div className="info-icon-container">  
                        <Phone className="info-icon" />  
                      </div>  
                      <div className="info-content">  
                        <p className="info-label">Téléphone du chauffeur</p>  
                        <p className="info-value">{truckData.telephone}</p>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
  
                {/* Bouton Modifier */}  
                <div className="action-section">  
                  <button  
                    onClick={handleEditClick}  
                    className="edit-button"  
                  >  
                    <Edit className="edit-icon" />  
                    Modifier  
                  </button>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal de modification */}  
      {isEditDialogOpen && (  
        <div className="modal-overlay" onClick={() => setIsEditDialogOpen(false)}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">Modifier les informations du camion</h2>  
              <button className="modal-close" onClick={() => setIsEditDialogOpen(false)}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleSubmit} className="modal-form">  
              <div className="form-group">  
                <label htmlFor="plaque" className="form-label">Plaque d'immatriculation</label>  
                <input  
                  id="plaque"  
                  type="text"  
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
                  value={formData.chauffeur}  
                  onChange={(e) => handleInputChange("chauffeur", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="telephone" className="form-label">Téléphone du chauffeur</label>  
                <input  
                  id="telephone"  
                  type="tel"  
                  value={formData.telephone}  
                  onChange={(e) => handleInputChange("telephone", e.target.value)}  
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
                <button type="button" className="cancel-button" onClick={() => setIsEditDialogOpen(false)}>  
                  Annuler  
                </button>  
                <button type="submit" className="submit-button">  
                  Sauvegarder  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  
    </div>  
  )  
}