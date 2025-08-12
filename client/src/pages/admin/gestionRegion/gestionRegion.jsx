import { useState, useEffect } from "react"  
import { useNavigate } from "react-router-dom"  
import {  
  MdSearch as Search,  
  MdAdd as Plus,  
  MdEdit as Edit,  
  MdDelete as Delete,  
  MdClose as X,  
  MdExpandMore as ExpandMore,  
  MdExpandLess as ExpandLess,  
  MdLocationCity as LocationCity,  
  MdPlace as Place,  
  MdSave as Save  
} from "react-icons/md"  
import "./gestionRegion.css"  
import locationService from '../../../services/locationService'  
  
export default function GestionRegion() {  
  const navigate = useNavigate()  
  const [cities, setCities] = useState([])  
  const [expandedCities, setExpandedCities] = useState(new Set())  
  const [loading, setLoading] = useState(true)  
  const [searchTerm, setSearchTerm] = useState("")  
    
  // Modals  
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false)  
  const [isEditCityModalOpen, setIsEditCityModalOpen] = useState(false)  
  const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false)  
  const [isEditRegionModalOpen, setIsEditRegionModalOpen] = useState(false)  
    
  // États pour les formulaires  
  const [selectedCity, setSelectedCity] = useState(null)  
  const [selectedRegion, setSelectedRegion] = useState(null)  
  const [cityFormData, setCityFormData] = useState({ name: "", code: "" })  
  const [regionFormData, setRegionFormData] = useState({ nom: "", code: "", description: "" })  
  
  useEffect(() => {  
    loadCitiesWithRegions()  
  }, [])  
  
  const loadCitiesWithRegions = async () => {  
    try {  
      setLoading(true)  
      const citiesResponse = await locationService.getCities()  
      const citiesWithRegions = await Promise.all(  
        citiesResponse.data.map(async (city) => {  
          const regionsResponse = await locationService.getRegionsByCity(city._id)  
          return { ...city, regions: regionsResponse.data || [] }  
        })  
      )  
      setCities(citiesWithRegions)  
    } catch (error) {  
      console.error('Erreur chargement:', error)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const toggleCityExpansion = (cityId) => {  
    const newExpanded = new Set(expandedCities)  
    if (newExpanded.has(cityId)) {  
      newExpanded.delete(cityId)  
    } else {  
      newExpanded.add(cityId)  
    }  
    setExpandedCities(newExpanded)  
  }  
  
  // Gestion des villes  
  const handleAddCity = () => {  
    setCityFormData({ name: "", code: "" })  
    setIsAddCityModalOpen(true)  
  }  
  
  const handleEditCity = (city) => {  
    setSelectedCity(city)  
    setCityFormData({ name: city.name, code: city.code })  
    setIsEditCityModalOpen(true)  
  }  
  
  const handleSubmitCity = async (e) => {  
    e.preventDefault()  
    try {  
      if (isEditCityModalOpen) {  
        await locationService.updateCity(selectedCity._id, cityFormData)  
      } else {  
        await locationService.createCity(cityFormData)  
      }  
      await loadCitiesWithRegions()  
      setIsAddCityModalOpen(false)  
      setIsEditCityModalOpen(false)  
      setSelectedCity(null)  
    } catch (error) {  
      console.error('Erreur:', error)  
    }  
  }  
  
  const handleDeleteCity = async (cityId) => {  
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ville et toutes ses régions ?')) {  
      try {  
        await locationService.deleteCity(cityId)  
        await loadCitiesWithRegions()  
      } catch (error) {  
        console.error('Erreur:', error)  
      }  
    }  
  }  
  
  // Gestion des régions  
  const handleAddRegionToCity = (city) => {  
    setSelectedCity(city)  
    setRegionFormData({ nom: "", code: "", description: "" })  
    setIsAddRegionModalOpen(true)  
  }  
  
  const handleEditRegion = (region, city) => {  
    setSelectedCity(city)  
    setSelectedRegion(region)  
    setRegionFormData({ nom: region.nom, code: region.code, description: region.description })  
    setIsEditRegionModalOpen(true)  
  }  
  
  const handleSubmitRegion = async (e) => {  
    e.preventDefault()  
    try {  
      const regionData = { ...regionFormData, city_id: selectedCity._id }  
      if (isEditRegionModalOpen) {  
        await locationService.updateRegion(selectedRegion._id, regionData)  
      } else {  
        await locationService.createRegion(regionData)  
      }  
      await loadCitiesWithRegions()  
      setIsAddRegionModalOpen(false)  
      setIsEditRegionModalOpen(false)  
      setSelectedCity(null)  
      setSelectedRegion(null)  
    } catch (error) {  
      console.error('Erreur:', error)  
    }  
  }  
  
  const handleDeleteRegion = async (regionId) => {  
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette région ?')) {  
      try {  
        await locationService.deleteRegion(regionId)  
        await loadCitiesWithRegions()  
      } catch (error) {  
        console.error('Erreur:', error)  
      }  
    }  
  }  
  
  // Filtrer les villes selon le terme de recherche  
  const filteredCities = cities.filter(city =>  
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    city.code.toLowerCase().includes(searchTerm.toLowerCase())  
  )  
  
  // Calculer les statistiques  
  const totalCities = cities.length  
  const totalRegions = cities.reduce((sum, city) => sum + city.regions.length, 0)  
  const activeCities = cities.filter(city => city.actif).length  
  
  return (  
    <div className="region-management-layout">  
      <div className="region-management-wrapper">  
        <div className="region-management-container">  
          <div className="region-management-content">  
            {/* En-tête */}  
            <div className="page-header">  
              <h1 className="page-title">Gestion des Villes et Régions</h1>  
              <p className="page-subtitle">Gérez les villes et leurs régions pour la livraison</p>  
            </div>  
  
            {/* Statistiques */}  
            <div className="stats-grid">  
              <div className="stat-card gradient-card">  
                <div className="stat-content">  
                  <h3 className="stat-label">Total Villes</h3>  
                  <div className="stat-value">{totalCities}</div>  
                  <p className="stat-description">Villes configurées</p>  
                </div>  
              </div>  
              <div className="stat-card gradient-card">  
                <div className="stat-content">  
                  <h3 className="stat-label">Total Régions</h3>  
                  <div className="stat-value">{totalRegions}</div>  
                  <p className="stat-description">Régions disponibles</p>  
                </div>  
              </div>  
              <div className="stat-card gradient-card">  
                <div className="stat-content">  
                  <h3 className="stat-label">Villes Actives</h3>  
                  <div className="stat-value">{activeCities}</div>  
                  <p className="stat-description">Villes en service</p>  
                </div>  
              </div>  
            </div>  
  
            {/* Actions */}  
            <div className="action-section">  
              <button className="add-button" onClick={handleAddCity}>  
                <Plus className="button-icon" />  
                Ajouter Ville  
              </button>  
            </div>  
  
            {/* Recherche */}  
            <div className="search-section">  
              <div className="search-container">  
                <Search className="search-icon" />  
                <input  
                  type="text"  
                  placeholder="Rechercher par nom ou code de ville..."  
                  value={searchTerm}  
                  onChange={(e) => setSearchTerm(e.target.value)}  
                  className="search-input"  
                />  
              </div>  
            </div>  
  
            {/* Liste hiérarchique */}  
            <div className="cities-container">  
              {loading ? (  
                <div className="loading-container">Chargement...</div>  
              ) : (  
                <div className="cities-list">  
                  {filteredCities.map(city => (  
                    <div key={city._id} className="city-item">  
                      <div className="city-header">  
                        <div className="city-info">  
                          <LocationCity className="city-icon" />  
                          <div className="city-details">  
                            <h3 className="city-name">{city.name}</h3>  
                            <span className="city-code">Code: {city.code}</span>  
                            <span className="regions-count">{city.regions.length} région(s)</span>  
                          </div>  
                        </div>  
                        <div className="city-actions">  
                          <button   
                            className="action-btn edit-btn"  
                            onClick={() => handleEditCity(city)}  
                            title="Modifier la ville"  
                          >  
                            <Edit />  
                          </button>  
                          <button   
                            className="action-btn delete-btn"  
                            onClick={() => handleDeleteCity(city._id)}  
                            title="Supprimer la ville"  
                          >  
                            <Delete />  
                          </button>  
                          <button   
                            className="action-btn add-btn"  
                            onClick={() => handleAddRegionToCity(city)}  
                            title="Ajouter une région"  
                          >  
                            <Plus />  
                          </button>  
                          <button   
                            className="expand-btn"  
                            onClick={() => toggleCityExpansion(city._id)}  
                          >  
                            {expandedCities.has(city._id) ? <ExpandLess /> : <ExpandMore />}  
                          </button>  
                        </div>  
                      </div>  
                        
                      {expandedCities.has(city._id) && (  
                        <div className="regions-list">  
                          {city.regions.length === 0 ? (  
                            <div className="no-regions">  
                              <p>Aucune région configurée pour cette ville</p>  
                              <button   
                                className="add-region-btn"  
                                onClick={() => handleAddRegionToCity(city)}  
                              >  
                                <Plus /> Ajouter la première région  
                              </button>  
                            </div>  
                          ) : (  
                            city.regions.map(region => (  
                              <div key={region._id} className="region-item">  
                                <div className="region-info">  
                                  <Place className="region-icon" />  
                                  <div className="region-details">  
                                    <h4 className="region-name">{region.nom}</h4>  
                                    <span className="region-code">Code: {region.code}</span>  
                                    {region.description && (  
                                      <p className="region-description">{region.description}</p>  
                                    )}  
                                  </div>  
                                </div>  
                                <div className="region-actions">  
                                  <button   
                                    className="action-btn edit-btn"  
                                    onClick={() => handleEditRegion(region, city)}  
                                    title="Modifier la région"  
                                  >  
                                    <Edit />  
                                  </button>  
                                  <button   
                                    className="action-btn delete-btn"  
                                    onClick={() => handleDeleteRegion(region._id)}  
                                    title="Supprimer la région"  
                                  >  
                                    <Delete />  
                                  </button>  
                                </div>  
                              </div>  
                            ))  
                          )}  
                        </div>  
                      )}  
                    </div>  
                  ))}  
                </div>  
              )}  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* Modal Ajouter/Modifier Ville */}  
      {(isAddCityModalOpen || isEditCityModalOpen) && (  
        <div className="modal-overlay" onClick={() => {  
          setIsAddCityModalOpen(false)  
          setIsEditCityModalOpen(false)  
        }}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">  
                {isEditCityModalOpen ? 'Modifier la ville' : 'Ajouter une ville'}  
              </h2>  
              <button className="modal-close" onClick={() => {  
                setIsAddCityModalOpen(false)  
                setIsEditCityModalOpen(false)  
              }}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleSubmitCity} className="modal-form">  
              <div className="form-group">  
                <label className="form-label">Nom de la ville</label>  
                <input  
                  type="text"  
                  value={cityFormData.name}  
                  onChange={(e) => setCityFormData({...cityFormData, name: e.target.value})}  
                  className="form-input"  
                  placeholder="Ex: Casablanca"  
                  required  
                />  
              </div>  
                
              <div className="form-group">  
                <label className="form-label">Code de la ville</label>  
                <input  
                  type="text"  
                  value={cityFormData.code}  
                  onChange={(e) => setCityFormData({...cityFormData, code: e.target.value.toUpperCase()})}  
                  className="form-input"  
                  placeholder="Ex: CASA"  
                  required  
                />  
              </div>  
                
              <div className="form-actions">  
                <button type="button" className="cancel-button" onClick={() => {  
                  setIsAddCityModalOpen(false)  
                  setIsEditCityModalOpen(false)  
                }}>  
                  Annuler  
                </button>  
                <button type="submit" className="submit-button">  
                  <Save className="btn-icon" />  
                  {isEditCityModalOpen ? 'Modifier' : 'Ajouter'}  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  
  
      {/* Modal Ajouter/Modifier Région */}  
      {(isAddRegionModalOpen || isEditRegionModalOpen) && (  
        <div className="modal-overlay" onClick={() => {  
          setIsAddRegionModalOpen(false)  
          setIsEditRegionModalOpen(false)  
        }}>  
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
            <div className="modal-header">  
              <h2 className="modal-title">  
                {isEditRegionModalOpen ? 'Modifier la région' : `Ajouter une région à ${selectedCity?.name}`}  
              </h2>  
              <button className="modal-close" onClick={() => {  
                setIsAddRegionModalOpen(false)  
                setIsEditRegionModalOpen(false)  
              }}>  
                <X className="close-icon" />  
              </button>  
            </div>  
              
            <form onSubmit={handleSubmitRegion} className="modal-form">  
              <div className="form-group">  
                <label className="form-label">Nom de la région</label>  
                <input  
                  type="text"  
                  value={regionFormData.nom}  
                  onChange={(e) => setRegionFormData({...regionFormData, nom: e.target.value})}  
                  className="form-input"  
                  placeholder="Ex: 2 Mars"  
                  required  
                />  
              </div>  
                
              <div className="form-group">  
                <label className="form-label">Code de la région</label>  
                <input  
                  type="text"  
                  value={regionFormData.code}  
                  onChange={(e) => setRegionFormData({...regionFormData, code: e.target.value.toUpperCase()})}  
                  className="form-input"  
                  placeholder="Ex: 2MARS"  
                  required  
                />  
              </div>  
                
              <div className="form-group">  
                <label className="form-label">Description</label>  
                <textarea  
                  value={regionFormData.description}  
                  onChange={(e) => setRegionFormData({...regionFormData, description: e.target.value})}  
                  className="form-textarea"  
                  placeholder="Description de la région..."  
                  rows="3"  
                />  
              </div>  
                
              <div className="form-actions">  
                <button type="button" className="cancel-button" onClick={() => {  
                  setIsAddRegionModalOpen(false)  
                  setIsEditRegionModalOpen(false)  
                }}>  
                  Annuler  
                </button>  
                <button type="submit" className="submit-button">  
                  <Save className="btn-icon" />  
                  {isEditRegionModalOpen ? 'Modifier' : 'Ajouter'}  
                </button>  
              </div>  
            </form>  
          </div>  
        </div>  
      )}  
    </div>  
  )  
}