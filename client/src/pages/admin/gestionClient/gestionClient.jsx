import { useState } from "react"  
import {   
  MdSearch as Search,   
  MdAdd as Plus,   
  MdPeople as Users,   
  MdBusiness as Business,  
  MdFactory as Factory,  
  MdEdit as Edit,  
  MdDelete as Delete,  
  MdClose as X  
} from "react-icons/md"  
import "./gestionClient.css"  
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar'  
  
// Données d'exemple pour les clients  
const clientsData = [  
  {  
    id: 1,  
    nom: "Jean Dupont",  
    type: "Particulier",  
    telephone: "+33 6 12 34 56 78",  
    region: "Casablanca",  
    email: "jean.dupont@email.com",  
    adresse: "123 Rue Mohammed V, Casablanca"  
  },  
  {  
    id: 2,  
    nom: "Société SARL",  
    type: "Professionnel",  
    telephone: "+33 5 22 33 44 55",  
    region: "Rabat",  
    email: "contact@societe-sarl.ma",  
    adresse: "456 Avenue Hassan II, Rabat"  
  },  
  {  
    id: 3,  
    nom: "Industries Maroc",  
    type: "Industriel",  
    telephone: "+33 5 23 44 55 66",  
    region: "Tanger",  
    email: "info@industries-maroc.ma",  
    adresse: "789 Zone Industrielle, Tanger"  
  },  
  {  
    id: 4,  
    nom: "Ahmed Benali",  
    type: "Particulier",  
    telephone: "+33 6 77 88 99 00",  
    region: "Fès",  
    email: "ahmed.benali@gmail.com",  
    adresse: "321 Rue Allal Ben Abdellah, Fès"  
  },  
  {  
    id: 5,  
    nom: "Entreprise Atlas",  
    type: "Professionnel",  
    telephone: "+33 5 24 55 66 77",  
    region: "Marrakech",  
    email: "contact@atlas-entreprise.ma",  
    adresse: "654 Boulevard Zerktouni, Marrakech"  
  },  
]  
  
export default function ClientManagement() {  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)  
  const [clients, setClients] = useState(clientsData)  
  const [editingClient, setEditingClient] = useState(null)  
  const [formData, setFormData] = useState({  
    nom: "",  
    type: "",  
    telephone: "",  
    region: "",  
    email: "",  
    adresse: "",  
  })  
  
  // Filtrer les clients selon le terme de recherche  
  const filteredClients = clients.filter(  
    (client) =>  
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      client.type.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),  
  )  
  
  // Calculer les statistiques  
  const totalClients = clients.length  
  const particuliers = clients.filter((client) => client.type === "Particulier").length  
  const professionnels = clients.filter((client) => client.type === "Professionnel").length  
  const industriels = clients.filter((client) => client.type === "Industriel").length  
  
  const handleInputChange = (field, value) => {  
    setFormData((prev) => ({  
      ...prev,  
      [field]: value,  
    }))  
  }  
  
  const handleAddSubmit = (e) => {  
    e.preventDefault()  
    const newClient = {  
      id: clients.length + 1,  
      ...formData  
    }  
    setClients([...clients, newClient])  
    console.log("Nouveau client:", newClient)  
  
    // Réinitialiser le formulaire et fermer le modal  
    setFormData({  
      nom: "",  
      type: "",  
      telephone: "",  
      region: "",  
      email: "",  
      adresse: "",  
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
    adresse: "",  
  })  
  setIsAddDialogOpen(true)  
}  
  
  const handleEditSubmit = (e) => {  
    e.preventDefault()  
    const updatedClients = clients.map(client =>   
      client.id === editingClient.id ? { ...editingClient, ...formData } : client  
    )  
    setClients(updatedClients)  
    console.log("Client modifié:", { ...editingClient, ...formData })  
  
    // Réinitialiser et fermer  
    setFormData({  
      nom: "",  
      type: "",  
      telephone: "",  
      region: "",  
      email: "",  
      adresse: "",  
    })  
    setEditingClient(null)  
    setIsEditDialogOpen(false)  
  }  
  
  const handleEdit = (client) => {  
    setEditingClient(client)  
    setFormData({  
      nom: client.nom,  
      type: client.type,  
      telephone: client.telephone,  
      region: client.region,  
      email: client.email,  
      adresse: client.adresse,  
    })  
    setIsEditDialogOpen(true)  
  }  
  
  const handleDelete = (clientId) => {  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {  
      const updatedClients = clients.filter(client => client.id !== clientId)  
      setClients(updatedClients)  
      console.log("Client supprimé:", clientId)  
    }  
  }  
  
  const getTypeBadge = (type) => {  
    switch (type) {  
      case "Particulier":  
        return <span className="badge badge-particulier">Particulier</span>  
      case "Professionnel":  
        return <span className="badge badge-professionnel">Professionnel</span>  
      case "Industriel":  
        return <span className="badge badge-industriel">Industriel</span>  
      default:  
        return <span className="badge badge-default">{type}</span>  
    }  
  }  
  
  const getTypeIcon = (type) => {  
    switch (type) {  
      case "Particulier":  
        return <Users className="icon" />  
      case "Professionnel":  
        return <Business className="icon" />  
      case "Industriel":  
        return <Factory className="icon" />  
      default:  
        return <Users className="icon" />  
    }  
  }  
  
  return (  
    <div className="client-management-layout">  
      <SidebarNavigation />  
        
      <div className="client-management-wrapper">  
        <div className="client-management-container">  
          <div className="client-management-content">  
            {/* En-tête */}  
            <div className="page-header">  
              <h1 className="page-title">Gestion des Clients</h1>  
              <p className="page-subtitle">Gérez votre base de clients</p>  
            </div>  
  
            {/* 4 Cards en haut avec gradient */}  
            <div className="stats-grid">  
            <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                <div className="stat-content">  
                    <h3 className="stat-label">Total Clients</h3>  
                    <div className="stat-value">{totalClients}</div>  
                    <p className="stat-description">Clients enregistrés</p>  
                </div>  
                </div>  
            </div>  
            
            <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                <div className="stat-content">  
                    <h3 className="stat-label">Particuliers</h3>  
                    <div className="stat-value">{particuliers}</div>  
                    <p className="stat-description">Clients particuliers</p>  
                </div>  
                </div>  
            </div>  
            
            <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                <div className="stat-content">  
                    <h3 className="stat-label">Professionnels</h3>  
                    <div className="stat-value">{professionnels}</div>  
                    <p className="stat-description">Clients professionnels</p>  
                </div>  
                </div>  
            </div>  
            
            <div className="stat-card gradient-card">  
                <div className="stat-card-header">  
                <div className="stat-content">  
                    <h3 className="stat-label">Industriels</h3>  
                    <div className="stat-value">{industriels}</div>  
                    <p className="stat-description">Clients industriels</p>  
                </div>  
                </div>  
            </div>  
            </div> 
  
            {/* Bouton Ajouter Client */}  
            <div className="action-section">  
              <button className="add-button" onClick={handleAddClick}>  
                <Plus className="button-icon" />  
                Ajouter Client  
               </button> 
            </div>  
  
            {/* Barre de recherche */}  
            <div className="search-section">  
              <div className="search-container">  
                <Search className="search-icon" />  
                <input  
                  type="text"  
                  placeholder="Rechercher par nom, type, région ou email..."  
                  value={searchTerm}  
                  onChange={(e) => setSearchTerm(e.target.value)}  
                  className="search-input"  
                />  
              </div>  
            </div>  
  
            {/* Tableau */}  
            <div className="table-card">  
              <div className="table-header">  
                <h3 className="table-title">Liste des Clients</h3>  
              </div>  
              <div className="table-content">  
                <div className="table-container">  
                  <table className="clients-table">  
                    <thead>  
                      <tr>  
                        <th>Nom du client</th>  
                        <th>Type</th>  
                        <th>Téléphone</th>  
                        <th>Région</th>  
                        <th>Email</th>  
                        <th>Actions</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {filteredClients.map((client) => (  
                        <tr key={client.id}>  
                          <td className="font-medium">{client.nom}</td>  
                          <td>{getTypeBadge(client.type)}</td>  
                          <td>{client.telephone}</td>  
                          <td>{client.region}</td>  
                          <td>{client.email}</td>  
                          <td>  
                            <div className="action-buttons">  
                              <button   
                                className="edit-action-button"  
                                onClick={() => handleEdit(client)}  
                              >  
                                <Edit className="action-icon" />  
                              </button>  
                              <button   
                                className="delete-action-button"  
                                onClick={() => handleDelete(client.id)}  
                              >  
                                <Delete className="action-icon" />  
                              </button>  
                            </div>  
                          </td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
  
                  {filteredClients.length === 0 && (  
                    <div className="no-results">  
                      Aucun client trouvé pour votre recherche.  
                    </div>  
                  )}  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal pour ajouter un client */}  
      {isAddDialogOpen && (  
        <div className="modal-overlay" onClick={() => setIsAddDialogOpen(false)}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">Ajouter Client</h2>  
              <button className="modal-close" onClick={() => setIsAddDialogOpen(false)}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleAddSubmit} className="modal-form">  
              <div className="form-group">  
                <label htmlFor="nom" className="form-label">Nom du client</label>  
                <input  
                  id="nom"  
                  type="text"  
                  placeholder="Ex: Jean Dupont"  
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
                  <option value="Particulier">Particulier</option>  
                  <option value="Professionnel">Professionnel</option>  
                  <option value="Industriel">Industriel</option>  
                </select>  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="telephone" className="form-label">Téléphone</label>  
                <input  
                  id="telephone"  
                  type="tel"  
                  placeholder="Ex: +33 6 12 34 56 78"  
                  value={formData.telephone}  
                  onChange={(e) => handleInputChange("telephone", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="region" className="form-label">Région</label>  
                <input  
                  id="region"  
                  type="text"  
                  placeholder="Ex: Casablanca"  
                  value={formData.region}  
                  onChange={(e) => handleInputChange("region", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="email" className="form-label">Email</label>  
                <input  
                  id="email"  
                  type="email"  
                  placeholder="Ex: client@email.com"  
                  value={formData.email}  
                  onChange={(e) => handleInputChange("email", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="adresse" className="form-label">Adresse</label>  
                <textarea  
                  id="adresse"  
                  placeholder="Ex: 123 Rue Mohammed V, Casablanca"  
                  value={formData.adresse}  
                  onChange={(e) => handleInputChange("adresse", e.target.value)}  
                  className="form-textarea"  
                  rows="3"  
                  required  
                />  
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
  
      {/* Modal pour modifier un client */}  
      {isEditDialogOpen && (  
        <div className="modal-overlay" onClick={() => setIsEditDialogOpen(false)}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">Modifier Client</h2>  
              <button className="modal-close" onClick={() => setIsEditDialogOpen(false)}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleEditSubmit} className="modal-form">  
              <div className="form-group">  
                <label htmlFor="edit-nom" className="form-label">Nom du client</label>  
                <input  
                  id="edit-nom"  
                  type="text"  
                  placeholder="Ex: Jean Dupont"  
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
                  <option value="Particulier">Particulier</option>  
                  <option value="Professionnel">Professionnel</option>  
                  <option value="Industriel">Industriel</option>  
                </select>  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="edit-telephone" className="form-label">Téléphone</label>  
                <input  
                  id="edit-telephone"  
                  type="tel"  
                  placeholder="Ex: +33 6 12 34 56 78"  
                  value={formData.telephone}  
                  onChange={(e) => handleInputChange("telephone", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="edit-region" className="form-label">Région</label>  
                <input  
                  id="edit-region"  
                  type="text"  
                  placeholder="Ex: Casablanca"  
                  value={formData.region}  
                  onChange={(e) => handleInputChange("region", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="edit-email" className="form-label">Email</label>  
                <input  
                  id="edit-email"  
                  type="email"  
                  placeholder="Ex: client@email.com"  
                  value={formData.email}  
                  onChange={(e) => handleInputChange("email", e.target.value)}  
                  className="form-input"  
                  required  
                />  
              </div>  
  
              <div className="form-group">  
                <label htmlFor="edit-adresse" className="form-label">Adresse</label>  
                <textarea  
                  id="edit-adresse"  
                  placeholder="Ex: 123 Rue Mohammed V, Casablanca"  
                  value={formData.adresse}  
                  onChange={(e) => handleInputChange("adresse", e.target.value)}  
                  className="form-textarea"  
                  rows="3"  
                  required  
                />  
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