import { useState } from "react"  
import {   
  MdSearch as Search,   
  MdAdd as Plus,   
  MdPerson as Driver,   
  MdPeople as Companion,  
  MdLocalShipping as Truck,  
  MdEdit as Edit,  
  MdDelete as Delete,  
  MdClose as X,
  MdPhone as Phone,
  MdEmail as Email  
} from "react-icons/md"  
import "./GestionChauffeur.css"  
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar'  
  
// Données d'exemple pour les chauffeurs et accompagnants  
const chauffeursData = [  
  {  
    id: 1,  
    nom: "Mohamed Alami",  
    type: "Chauffeur",  
    telephone: "+212 6 12 34 56 78",  
    region: "Casablanca",  
    email: "mohamed.alami@chronogaz.ma",  
    permis: "B, C",
    experience: "5 ans",
    statut: "Actif"
  },  
  {  
    id: 2,  
    nom: "Fatima Benali",  
    type: "Accompagnant",  
    telephone: "+212 6 22 33 44 55",  
    region: "Rabat",  
    email: "fatima.benali@chronogaz.ma",  
    permis: "B",
    experience: "2 ans",
    statut: "Actif"
  },  
  {  
    id: 3,  
    nom: "Ahmed Tazi",  
    type: "Chauffeur",  
    telephone: "+212 6 33 44 55 66",  
    region: "Tanger",  
    email: "ahmed.tazi@chronogaz.ma",  
    permis: "B, C, D",
    experience: "8 ans",
    statut: "En congé"
  },  
  {  
    id: 4,  
    nom: "Youssef Idrissi",  
    type: "Accompagnant",  
    telephone: "+212 6 44 55 66 77",  
    region: "Fès",  
    email: "youssef.idrissi@chronogaz.ma",  
    permis: "B",
    experience: "1 an",
    statut: "Actif"
  },  
  {  
    id: 5,  
    nom: "Rachid Bennani",  
    type: "Chauffeur",  
    telephone: "+212 6 55 66 77 88",  
    region: "Marrakech",  
    email: "rachid.bennani@chronogaz.ma",  
    permis: "B, C",
    experience: "10 ans",
    statut: "Actif"
  },  
]  
  
export default function GestionChauffeur() {  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)  
  const [chauffeurs, setChauffeurs] = useState(chauffeursData)  
  const [editingChauffeur, setEditingChauffeur] = useState(null)  
  const [formData, setFormData] = useState({  
    nom: "",  
    type: "",  
    telephone: "",  
    region: "",  
    email: "",  
    permis: "",
    experience: "",
    statut: "Actif"
  })  
  
  // Filtrer les chauffeurs selon le terme de recherche  
  const filteredChauffeurs = chauffeurs.filter(  
    (chauffeur) =>  
      chauffeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      chauffeur.type.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      chauffeur.region.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      chauffeur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.statut.toLowerCase().includes(searchTerm.toLowerCase()),  
  )  
  
  // Calculer les statistiques  
  const totalChauffeurs = chauffeurs.length  
  const chauffeursPrincipaux = chauffeurs.filter((c) => c.type === "Chauffeur").length  
  const accompagnants = chauffeurs.filter((c) => c.type === "Accompagnant").length  
  const actifs = chauffeurs.filter((c) => c.statut === "Actif").length  
  
  const handleInputChange = (field, value) => {  
    setFormData((prev) => ({  
      ...prev,  
      [field]: value,  
    }))  
  }  
  
  const handleAddSubmit = (e) => {  
    e.preventDefault()  
    const newChauffeur = {  
      id: chauffeurs.length + 1,  
      ...formData  
    }  
    setChauffeurs([...chauffeurs, newChauffeur])  
    console.log("Nouveau chauffeur:", newChauffeur)  
  
    // Réinitialiser le formulaire et fermer le modal  
    setFormData({  
      nom: "",  
      type: "",  
      telephone: "",  
      region: "",  
      email: "",  
      permis: "",
      experience: "",
      statut: "Actif"
    })  
    setIsAddDialogOpen(false)  
  }  

  const handleAddClick = () => {  
    // Réinitialiser complètement le formulaire pour l'ajout  
    setFormData({  
      nom: "",  
      type: "",  
      telephone: "",  
      region: "",  
      email: "",  
      permis: "",
      experience: "",
      statut: "Actif"
    })  
    setIsAddDialogOpen(true)  
  }  
  
  const handleEditSubmit = (e) => {  
    e.preventDefault()  
    const updatedChauffeurs = chauffeurs.map(chauffeur =>   
      chauffeur.id === editingChauffeur.id ? { ...editingChauffeur, ...formData } : chauffeur  
    )  
    setChauffeurs(updatedChauffeurs)  
    console.log("Chauffeur modifié:", { ...editingChauffeur, ...formData })  
  
    // Réinitialiser et fermer  
    setFormData({  
      nom: "",  
      type: "",  
      telephone: "",  
      region: "",  
      email: "",  
      permis: "",
      experience: "",
      statut: "Actif"
    })  
    setEditingChauffeur(null)  
    setIsEditDialogOpen(false)  
  }  
  
  const handleEdit = (chauffeur) => {  
    setEditingChauffeur(chauffeur)  
    setFormData({  
      nom: chauffeur.nom,  
      type: chauffeur.type,  
      telephone: chauffeur.telephone,  
      region: chauffeur.region,  
      email: chauffeur.email,  
      permis: chauffeur.permis,
      experience: chauffeur.experience,
      statut: chauffeur.statut
    })  
    setIsEditDialogOpen(true)  
  }  
  
  const handleDelete = (chauffeurId) => {  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {  
      const updatedChauffeurs = chauffeurs.filter(chauffeur => chauffeur.id !== chauffeurId)  
      setChauffeurs(updatedChauffeurs)  
      console.log("Chauffeur supprimé:", chauffeurId)  
    }  
  }  
  
  const getTypeBadge = (type) => {  
    switch (type) {  
      case "Chauffeur":  
        return <span className="badge badge-chauffeur">Chauffeur</span>  
      case "Accompagnant":  
        return <span className="badge badge-accompagnant">Accompagnant</span>  
      default:  
        return <span className="badge badge-default">{type}</span>  
    }  
  }  

  const getStatutBadge = (statut) => {  
    switch (statut) {  
      case "Actif":  
        return <span className="badge badge-actif">Actif</span>  
      case "En congé":  
        return <span className="badge badge-conge">En congé</span>  
      case "Inactif":  
        return <span className="badge badge-inactif">Inactif</span>  
      default:  
        return <span className="badge badge-default">{statut}</span>  
    }  
  }  
  
  const getTypeIcon = (type) => {  
    switch (type) {  
      case "Chauffeur":  
        return <Driver className="icon" />  
      case "Accompagnant":  
        return <Companion className="icon" />  
      default:  
        return <Driver className="icon" />  
    }  
  }  
  
  return (  
    <div className="chauffeur-management-layout">  
      <SidebarNavigation />  
        
      <div className="chauffeur-management-wrapper">  
        <div className="chauffeur-management-container">  
          <div className="chauffeur-management-content">  
            {/* En-tête */}  
            <div className="page-header">  
              <h1 className="page-title">Gestion des Chauffeurs</h1>  
              <p className="page-subtitle">Gérez votre équipe de chauffeurs et accompagnants</p>  
            </div>  
  
            {/* 4 Cards en haut avec gradient */}  
            <div className="stats-grid">  
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Total Personnel</h3>  
                    <div className="stat-value">{totalChauffeurs}</div>  
                    <p className="stat-description">Membres de l'équipe</p>  
                  </div>  
                </div>  
              </div>  
              
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Chauffeurs</h3>  
                    <div className="stat-value">{chauffeursPrincipaux}</div>  
                    <p className="stat-description">Chauffeurs principaux</p>  
                  </div>  
                </div>  
              </div>  
              
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Accompagnants</h3>  
                    <div className="stat-value">{accompagnants}</div>  
                    <p className="stat-description">Accompagnants</p>  
                  </div>  
                </div>  
              </div>  
              
              <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                  <div className="stat-content">  
                    <h3 className="stat-label">Actifs</h3>  
                    <div className="stat-value">{actifs}</div>  
                    <p className="stat-description">Personnel actif</p>  
                  </div>  
                </div>  
              </div>  
            </div> 
  
            {/* Bouton Ajouter Chauffeur */}  
            <div className="action-section">  
              <button className="add-button" onClick={handleAddClick}>  
                <Plus className="button-icon" />  
                Ajouter Personnel  
              </button> 
            </div>  
  
            {/* Barre de recherche */}  
            <div className="search-section">  
              <div className="search-container">  
                <Search className="search-icon" />  
                <input  
                  type="text"  
                  placeholder="Rechercher par nom, type, région, email ou statut..."  
                  value={searchTerm}  
                  onChange={(e) => setSearchTerm(e.target.value)}  
                  className="search-input"  
                />  
              </div>  
            </div>  
  
            {/* Tableau */}  
            <div className="table-card">  
              <div className="table-header">  
                <h3 className="table-title">Liste du Personnel</h3>  
              </div>  
              <div className="table-content">  
                <div className="table-container">  
                  <table className="chauffeurs-table">  
                    <thead>  
                      <tr>  
                        <th>Nom</th>  
                        <th>Type</th>  
                        <th>Téléphone</th>  
                        <th>Région</th>  
                        <th>Permis</th>  
                        <th>Expérience</th>  
                        <th>Statut</th>  
                        <th>Actions</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {filteredChauffeurs.map((chauffeur) => (  
                        <tr key={chauffeur.id}>  
                          <td className="font-medium">{chauffeur.nom}</td>  
                          <td>{getTypeBadge(chauffeur.type)}</td>  
                          <td>{chauffeur.telephone}</td>  
                          <td>{chauffeur.region}</td>  
                          <td>{chauffeur.permis}</td>  
                          <td>{chauffeur.experience}</td>  
                          <td>{getStatutBadge(chauffeur.statut)}</td>  
                          <td>  
                            <div className="action-buttons">  
                              <button   
                                className="edit-action-button"  
                                onClick={() => handleEdit(chauffeur)}  
                              >  
                                <Edit className="action-icon" />  
                              </button>  
                              <button   
                                className="delete-action-button"  
                                onClick={() => handleDelete(chauffeur.id)}  
                              >  
                                <Delete className="action-icon" />  
                              </button>  
                            </div>  
                          </td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>
                  {filteredChauffeurs.length === 0 && (    
                    <div className="no-results">    
                      Aucun chauffeur trouvé pour votre recherche.    
                    </div>    
                  )}    
                </div>    
              </div>    
            </div>    
          </div>    
        </div>    
      </div>    
    
      {/* Modal pour ajouter un chauffeur */}    
      {isAddDialogOpen && (    
        <div className="modal-overlay" onClick={() => setIsAddDialogOpen(false)}>    
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>    
            <div className="modal-header">    
              <h2 className="modal-title">Ajouter Personnel</h2>    
              <button className="modal-close" onClick={() => setIsAddDialogOpen(false)}>    
                <X className="close-icon" />    
              </button>    
            </div>    
                
            <form onSubmit={handleAddSubmit} className="modal-form">    
              <div className="form-group">    
                <label htmlFor="nom" className="form-label">Nom complet</label>    
                <input    
                  id="nom"    
                  type="text"    
                  placeholder="Ex: Mohamed Alami"    
                  value={formData.nom}    
                  onChange={(e) => handleInputChange("nom", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="type" className="form-label">Type</label>    
                <select    
                  id="type"    
                  value={formData.type}    
                  onChange={(e) => handleInputChange("type", e.target.value)}    
                  className="form-select"    
                  required    
                >    
                  <option value="">Sélectionner un type</option>    
                  <option value="Chauffeur">Chauffeur</option>    
                  <option value="Accompagnant">Accompagnant</option>    
                </select>    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="telephone" className="form-label">Téléphone</label>    
                <input    
                  id="telephone"    
                  type="tel"    
                  placeholder="Ex: +212 6 12 34 56 78"    
                  value={formData.telephone}    
                  onChange={(e) => handleInputChange("telephone", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="region" className="form-label">Région</label>    
                <select    
                  id="region"    
                  value={formData.region}    
                  onChange={(e) => handleInputChange("region", e.target.value)}    
                  className="form-select"    
                  required    
                >    
                  <option value="">Sélectionner une région</option>    
                  <option value="Casablanca">Casablanca</option>    
                  <option value="Rabat">Rabat</option>    
                  <option value="Tanger">Tanger</option>    
                  <option value="Fès">Fès</option>    
                  <option value="Marrakech">Marrakech</option>    
                  <option value="Agadir">Agadir</option>    
                </select>    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="email" className="form-label">Email</label>    
                <input    
                  id="email"    
                  type="email"    
                  placeholder="Ex: mohamed.alami@chronogaz.ma"    
                  value={formData.email}    
                  onChange={(e) => handleInputChange("email", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="permis" className="form-label">Permis de conduire</label>    
                <input    
                  id="permis"    
                  type="text"    
                  placeholder="Ex: B, C, D"    
                  value={formData.permis}    
                  onChange={(e) => handleInputChange("permis", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
  
              <div className="form-group">    
                <label htmlFor="experience" className="form-label">Expérience</label>    
                <input    
                  id="experience"    
                  type="text"    
                  placeholder="Ex: 5 ans"    
                  value={formData.experience}    
                  onChange={(e) => handleInputChange("experience", e.target.value)}    
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
                  <option value="Actif">Actif</option>    
                  <option value="En congé">En congé</option>    
                  <option value="Inactif">Inactif</option>    
                </select>    
              </div>    
    
              <div className="form-actions">    
                <button type="button" className="cancel-button" onClick={() => setIsAddDialogOpen(false)}>    
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
    
      {/* Modal pour modifier un chauffeur */}    
      {isEditDialogOpen && (    
        <div className="modal-overlay" onClick={() => setIsEditDialogOpen(false)}>    
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>    
            <div className="modal-header">    
              <h2 className="modal-title">Modifier Personnel</h2>    
              <button className="modal-close" onClick={() => setIsEditDialogOpen(false)}>    
                <X className="close-icon" />    
              </button>    
            </div>    
                
            <form onSubmit={handleEditSubmit} className="modal-form">    
              <div className="form-group">    
                <label htmlFor="edit-nom" className="form-label">Nom complet</label>    
                <input    
                  id="edit-nom"    
                  type="text"    
                  placeholder="Ex: Mohamed Alami"    
                  value={formData.nom}    
                  onChange={(e) => handleInputChange("nom", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="edit-type" className="form-label">Type</label>    
                <select    
                  id="edit-type"    
                  value={formData.type}    
                  onChange={(e) => handleInputChange("type", e.target.value)}    
                  className="form-select"    
                  required    
                >    
                  <option value="">Sélectionner un type</option>    
                  <option value="Chauffeur">Chauffeur</option>    
                  <option value="Accompagnant">Accompagnant</option>    
                </select>    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="edit-telephone" className="form-label">Téléphone</label>    
                <input    
                  id="edit-telephone"    
                  type="tel"    
                  placeholder="Ex: +212 6 12 34 56 78"    
                  value={formData.telephone}    
                  onChange={(e) => handleInputChange("telephone", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="edit-region" className="form-label">Région</label>    
                <select    
                  id="edit-region"    
                  value={formData.region}    
                  onChange={(e) => handleInputChange("region", e.target.value)}    
                  className="form-select"    
                  required    
                >    
                  <option value="">Sélectionner une région</option>    
                  <option value="Casablanca">Casablanca</option>    
                  <option value="Rabat">Rabat</option>    
                  <option value="Tanger">Tanger</option>    
                  <option value="Fès">Fès</option>    
                  <option value="Marrakech">Marrakech</option>    
                  <option value="Agadir">Agadir</option>    
                </select>    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="edit-email" className="form-label">Email</label>    
                <input    
                  id="edit-email"    
                  type="email"    
                  placeholder="Ex: mohamed.alami@chronogaz.ma"    
                  value={formData.email}    
                  onChange={(e) => handleInputChange("email", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
    
              <div className="form-group">    
                <label htmlFor="edit-permis" className="form-label">Permis de conduire</label>    
                <input    
                  id="edit-permis"    
                  type="text"    
                  placeholder="Ex: B, C, D"    
                  value={formData.permis}    
                  onChange={(e) => handleInputChange("permis", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
  
              <div className="form-group">    
                <label htmlFor="edit-experience" className="form-label">Expérience</label>    
                <input    
                  id="edit-experience"    
                  type="text"    
                  placeholder="Ex: 5 ans"    
                  value={formData.experience}    
                  onChange={(e) => handleInputChange("experience", e.target.value)}    
                  className="form-input"    
                  required    
                />    
              </div>    
  
              <div className="form-group">    
                <label htmlFor="edit-statut" className="form-label">Statut</label>    
                <select    
                  id="edit-statut"    
                  value={formData.statut}    
                  onChange={(e) => handleInputChange("statut", e.target.value)}    
                  className="form-select"    
                  required    
                >    
                  <option value="Actif">Actif</option>    
                  <option value="En congé">En congé</option>    
                  <option value="Inactif">Inactif</option>    
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