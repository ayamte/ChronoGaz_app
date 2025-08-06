import { useState } from "react"  
import {   
  MdSearch as Search,   
  MdAdd as Plus,   
  MdEdit as Edit,  
  MdDelete as Delete,  
  MdClose as X  
} from "react-icons/md"  
import "./gestionRegion.css"  
  
// Données d'exemple pour les régions  
const regionsData = [  
  {  
    id: 1,  
    nom: "Casablanca",  
    nombreCommandes: 245  
  },  
  {  
    id: 2,  
    nom: "Rabat",  
    nombreCommandes: 189  
  },  
  {  
    id: 3,  
    nom: "Marrakech",  
    nombreCommandes: 156  
  },  
  {  
    id: 4,  
    nom: "Fès",  
    nombreCommandes: 134  
  },  
  {  
    id: 5,  
    nom: "Tanger",  
    nombreCommandes: 98  
  },  
  {  
    id: 6,  
    nom: "Agadir",  
    nombreCommandes: 87  
  },  
]  
  
export default function RegionManagement() {  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)  
  const [regions, setRegions] = useState(regionsData)  
  const [editingRegion, setEditingRegion] = useState(null)  
  const [formData, setFormData] = useState({  
    nom: "",  
  })  
  
  // Filtrer les régions selon le terme de recherche  
  const filteredRegions = regions.filter(  
    (region) =>  
      region.nom.toLowerCase().includes(searchTerm.toLowerCase())  
  )  
  
  const handleInputChange = (field, value) => {  
    setFormData((prev) => ({  
      ...prev,  
      [field]: value,  
    }))  
  }  
  
  const handleAddSubmit = (e) => {  
    e.preventDefault()  
    const newRegion = {  
      id: regions.length + 1,  
      nom: formData.nom,  
      nombreCommandes: 0  
    }  
    setRegions([...regions, newRegion])  
    console.log("Nouvelle région:", newRegion)  
  
    // Réinitialiser le formulaire et fermer le modal  
    setFormData({  
      nom: "",  
    })  
    setIsAddDialogOpen(false)  
  }  
  
  const handleEditSubmit = (e) => {  
    e.preventDefault()  
    const updatedRegions = regions.map(region =>   
      region.id === editingRegion.id ? { ...editingRegion, nom: formData.nom } : region  
    )  
    setRegions(updatedRegions)  
    console.log("Région modifiée:", { ...editingRegion, nom: formData.nom })  
  
    // Réinitialiser et fermer  
    setFormData({  
      nom: "",  
    })  
    setEditingRegion(null)  
    setIsEditDialogOpen(false)  
  }  
  
  const handleEdit = (region) => {  
    setEditingRegion(region)  
    setFormData({  
      nom: region.nom,  
    })  
    setIsEditDialogOpen(true)  
  }  
  
  const handleDelete = (regionId) => {  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette région ?")) {  
      const updatedRegions = regions.filter(region => region.id !== regionId)  
      setRegions(updatedRegions)  
      console.log("Région supprimée:", regionId)  
    }  
  }  
  
  const handleAddClick = () => {  
    // Réinitialiser complètement le formulaire pour l'ajout  
    setFormData({  
      nom: "",  
    })  
    setIsAddDialogOpen(true)  
  }  
  
  return (  
    <div className="region-management-layout">  
        
      <div className="region-management-wrapper">  
        <div className="region-management-container">  
          <div className="region-management-content">  
            {/* En-tête */}  
            <div className="region-page-header">  
              <h1 className="region-page-title">Gestion des Régions</h1>  
              <p className="region-page-subtitle">Gérez les régions de livraison</p>  
            </div>  
  
            {/* Bouton Ajouter Région */}  
            <div className="region-action-section">  
              <button className="region-add-button" onClick={handleAddClick}>  
                <Plus className="region-button-icon" />  
                Ajouter Région  
              </button>  
            </div>  
  
            {/* Barre de recherche */}  
            <div className="region-search-section">  
              <div className="region-search-container">  
                <Search className="region-search-icon" />  
                <input  
                  type="text"  
                  placeholder="Rechercher par nom de région..."  
                  value={searchTerm}  
                  onChange={(e) => setSearchTerm(e.target.value)}  
                  className="region-search-input"  
                />  
              </div>  
            </div>  
  
            {/* Tableau */}  
            <div className="region-table-card">  
              <div className="region-table-header">  
                <h3 className="region-table-title">Liste des Régions</h3>  
              </div>  
              <div className="region-table-content">  
                <div className="region-table-container">  
                  <table className="region-regions-table">  
                    <thead>  
                      <tr>  
                        <th>Nom de la région</th>  
                        <th>Nombre des commandes</th>  
                        <th>Actions</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {filteredRegions.map((region) => (  
                        <tr key={region.id}>  
                          <td className="region-font-medium">{region.nom}</td>  
                          <td>{region.nombreCommandes}</td>  
                          <td>  
                            <div className="region-action-buttons">  
                              <button   
                                className="region-edit-action-button"  
                                onClick={() => handleEdit(region)}  
                              >  
                                <Edit className="region-action-icon" />  
                              </button>  
                              <button   
                                className="region-delete-action-button"  
                                onClick={() => handleDelete(region.id)}  
                              >  
                                <Delete className="region-action-icon" />  
                              </button>  
                            </div>  
                          </td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
  
                  {filteredRegions.length === 0 && (  
                    <div className="region-no-results">  
                      Aucune région trouvée pour votre recherche.  
                    </div>  
                  )}  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal pour ajouter une région */}  
      {isAddDialogOpen && (  
        <div className="region-modal-overlay" onClick={() => setIsAddDialogOpen(false)}>  
          <div className="region-modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="region-modal-header">  
              <h2 className="region-modal-title">Ajouter Région</h2>  
              <button className="region-modal-close" onClick={() => setIsAddDialogOpen(false)}>  
                <X className="region-close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleAddSubmit} className="region-modal-form">  
              <div className="region-form-group">  
                <label htmlFor="nom" className="region-form-label">Nom de la région</label>  
                <input  
                  id="nom"  
                  type="text"  
                  placeholder="Ex: Casablanca"  
                  value={formData.nom}  
                  onChange={(e) => handleInputChange("nom", e.target.value)}  
                  className="region-form-input"  
                  required  
                />  
              </div>  
  
              <div className="region-form-actions">  
                <button type="button" className="region-cancel-button" onClick={() => setIsAddDialogOpen(false)}>  
                  Annuler  
                </button>  
                <button type="submit" className="region-submit-button">  
                  Ajouter  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  
  
      {/* Modal pour modifier une région */}  
      {isEditDialogOpen && (  
        <div className="region-modal-overlay" onClick={() => setIsEditDialogOpen(false)}>  
          <div className="region-modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="region-modal-header">  
              <h2 className="region-modal-title">Modifier Région</h2>  
              <button className="region-modal-close" onClick={() => setIsEditDialogOpen(false)}>  
                <X className="region-close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleEditSubmit} className="region-modal-form">  
              <div className="region-form-group">  
                <label htmlFor="edit-nom" className="region-form-label">Nom de la région</label>  
                <input  
                  id="edit-nom"  
                  type="text"  
                  placeholder="Ex: Casablanca"  
                  value={formData.nom}  
                  onChange={(e) => handleInputChange("nom", e.target.value)}  
                  className="region-form-input"  
                  required  
                />  
              </div>  
  
              <div className="region-form-actions">  
                <button type="button" className="region-cancel-button" onClick={() => setIsEditDialogOpen(false)}>  
                  Annuler  
                </button>  
                <button type="submit" className="region-submit-button">  
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