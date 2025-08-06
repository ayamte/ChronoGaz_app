import React, { useState, useEffect } from 'react';  
import {   
  MdEdit as Edit,   
  MdSave as Save,   
  MdClose as X,   
  MdAdd as Plus,  
  MdLock as Lock,  
  MdLocationOn as LocationOn  
} from 'react-icons/md';  
import { authService } from '../../services/authService';  
import './Profile.css';  
  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  
  
export default function Profile() {  
  const [isEditing, setIsEditing] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  const [user, setUser] = useState(null);  
  const [profile, setProfile] = useState({});  
  const [editedProfile, setEditedProfile] = useState({});  
  
  // Régions autorisées selon votre système  
  const regions = ['2 Mars', 'Maarif', 'Bir Anzarane', 'Boulevard al qods'];  
  
  useEffect(() => {  
    loadProfile();  
  }, []);  
  
  const loadProfile = async () => {  
    try {  
      setLoading(true);  
      const currentUser = authService.getUser();  
      setUser(currentUser);  
          
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {  
        method: 'GET',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
    
      if (response.status === 401) {  
        authService.logout();  
        return;  
      }  
    
      const data = await response.json();  
      if (data.success) {  
        setProfile(data.data.profile);  
        setEditedProfile(data.data.profile);  
          
        // AJOUTÉ: Mettre à jour l'état user avec l'email frais de l'API  
        if (data.data.profile.email && data.data.profile.email !== currentUser?.email) {  
          const updatedUser = { ...currentUser, email: data.data.profile.email };  
          authService.setUser(updatedUser);  
          setUser(updatedUser);  
        }  
      } else {  
        setError('Erreur lors du chargement du profil');  
      }  
    } catch (err) {  
      setError('Erreur de connexion');  
      console.error('Erreur:', err);  
    } finally {  
      setLoading(false);  
    }  
  }; 
  
  const handleEdit = () => {  
    setIsEditing(true);  
    setEditedProfile({ ...profile });  
    setError('');  
    setSuccess('');  
  };  
  
  const handleSave = async () => {  
    try {  
      setLoading(true);  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {  
        method: 'PUT',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({  
          profile: editedProfile  
        })  
      });  
    
      if (response.status === 401) {  
        authService.logout();  
        return;  
      }  
    
      const data = await response.json();  
      if (data.success) {  
        // SOLUTION: Recharger complètement le profil depuis l'API  
        await loadProfile();  
        setIsEditing(false);  
        setSuccess('Profil mis à jour avec succès');  
      } else {  
        setError(data.message || 'Erreur lors de la mise à jour');  
      }  
    } catch (err) {  
      setError('Erreur lors de la mise à jour du profil');  
      console.error('Erreur:', err);  
    } finally {  
      setLoading(false);  
    }  
  };
  
  const handleCancel = () => {  
    setEditedProfile({ ...profile });  
    setIsEditing(false);  
    setError('');  
    setSuccess('');  
  };  
  
  const handleInputChange = (field, value) => {  
    setEditedProfile(prev => ({  
      ...prev,  
      [field]: value  
    }));  
  };  
  
  if (loading && !profile.type) {  
    return (  
      <div className="profile-layout">  
        <div className="profile-container">  
          <div className="loading-message">Chargement du profil...</div>  
        </div>  
      </div>  
    );  
  }  
  
  const isCompany = profile.type === 'MORAL';  
  
  return (  
    <div className="profile-layout">  
      <div className="profile-container">  
        {/* Header */}  
        <div className="profile-header">  
          <h1 className="profile-title">Mon Profil</h1>  
          <p className="profile-subtitle">  
            {isCompany   
              ? 'Gérez les informations de votre entreprise'   
              : 'Gérez vos informations personnelles'  
            }  
          </p>  
        </div>  
  
        {/* Messages */}  
        {error && (  
          <div className="alert alert-error">  
            {error}  
          </div>  
        )}  
        {success && (  
          <div className="alert alert-success">  
            {success}  
          </div>  
        )}  
  
        {/* Profile Card */}  
        <div className="profile-card">  
          <div className="card-header">  
            <div className="card-header-content">  
              <h2 className="card-title">  
                {isCompany ? 'Informations Entreprise' : 'Informations Personnelles'}  
              </h2>  
              <p className="card-description">  
                Gérez vos informations de profil et vos préférences  
              </p>  
            </div>  
            {!isEditing ? (  
              <button onClick={handleEdit} className="btn btn-outline btn-sm">  
                <Edit className="btn-icon" />  
                Modifier  
              </button>  
            ) : (  
              <div className="btn-group">  
                <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={loading}>  
                  <Save className="btn-icon" />  
                  {loading ? 'Enregistrement...' : 'Enregistrer'}  
                </button>  
                <button onClick={handleCancel} className="btn btn-outline btn-sm">  
                  <X className="btn-icon" />  
                  Annuler  
                </button>  
              </div>  
            )}  
          </div>  
  
          <div className="card-content">  
            {/* Email - Commun */}  
            <div className="form-group">  
              <label className="form-label">Adresse Email</label>  
              {isEditing ? (  
                <input  
                  type="email"  
                  value={editedProfile.email || ''}  
                  onChange={(e) => handleInputChange('email', e.target.value)}  
                  className="form-input"  
                />  
              ) : (  
                <div className="form-display">  
                  {user?.email || 'Non renseigné'}  
                </div>  
              )}  
            </div>  
  
            <div className="form-separator"></div>  
  
            {/* Champs spécifiques aux particuliers */}  
            {!isCompany && (  
              <>  
                <div className="form-grid">  
                  <div className="form-group">  
                    <label className="form-label">Prénom</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.first_name || ''}  
                        onChange={(e) => handleInputChange('first_name', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.first_name || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                  <div className="form-group">  
                    <label className="form-label">Nom</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.last_name || ''}  
                        onChange={(e) => handleInputChange('last_name', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.last_name || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                </div>  
  
                <div className="form-group">  
                  <label className="form-label">Civilité</label>  
                  {isEditing ? (  
                    <select  
                      value={editedProfile.civilite || 'M'}  
                      onChange={(e) => handleInputChange('civilite', e.target.value)}  
                      className="form-select"  
                    >  
                      <option value="M">M.</option>  
                      <option value="Mme">Mme</option>  
                      <option value="Mlle">Mlle</option>  
                    </select>  
                  ) : (  
                    <div className="form-display">  
                      {profile.civilite || 'Non renseigné'}  
                    </div>  
                  )}  
                </div>  
              </>  
            )}  
  
            {/* Champs spécifiques aux entreprises */}  
            {isCompany && (  
              <>  
                <div className="form-group">  
                  <label className="form-label">Raison Sociale</label>  
                  {isEditing ? (  
                    <input  
                      type="text"  
                      value={editedProfile.raison_sociale || ''}  
                      onChange={(e) => handleInputChange('raison_sociale', e.target.value)}  
                      className="form-input"  
                    />  
                  ) : (  
                    <div className="form-display">  
                      {profile.raison_sociale || 'Non renseigné'}  
                    </div>  
                  )}  
                </div>  
  
                <div className="form-grid">  
                  <div className="form-group">  
                    <label className="form-label">ICE</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.ice || ''}  
                        onChange={(e) => handleInputChange('ice', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.ice || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                  <div className="form-group">  
                    <label className="form-label">RC</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.rc || ''}  
                        onChange={(e) => handleInputChange('rc', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.rc || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                </div>  
  
                <div className="form-grid">  
                  <div className="form-group">  
                    <label className="form-label">Ville RC</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.ville_rc || ''}  
                        onChange={(e) => handleInputChange('ville_rc', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.ville_rc || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                  <div className="form-group">  
                    <label className="form-label">Patente</label>  
                    {isEditing ? (  
                      <input  
                        type="text"  
                        value={editedProfile.patente || ''}  
                        onChange={(e) => handleInputChange('patente', e.target.value)}  
                        className="form-input"  
                      />  
                    ) : (  
                      <div className="form-display">  
                        {profile.patente || 'Non renseigné'}  
                      </div>  
                    )}  
                  </div>  
                </div>  
              </>  
            )}  
  
            {/* Contact - Commun */}  
            <div className="form-separator"></div>  
            <h3 className="section-title">Informations de Contact</h3>  
  
            <div className="form-group">  
              <label className="form-label">Téléphone</label>  
              {isEditing ? (  
                <input  
                  type="tel"  
                  value={editedProfile.telephone_principal || ''}  
                  onChange={(e) => handleInputChange('telephone_principal', e.target.value)}  
                  className="form-input"  
                  placeholder="Ex: 0612345678"  
                />  
              ) : (  
                <div className="form-display">  
                  {profile.telephone_principal || 'Non renseigné'}  
                </div>  
              )}  
            </div>  
  
            {/* Adresse - Commun */}  
            <div className="form-separator"></div>  
            <h3 className="section-title">Adresse Principale</h3>  
  
            <div className="form-group">  
              <label className="form-label">Adresse</label>  
              {isEditing ? (  
                <textarea  
                  value={editedProfile.adresse_principale || ''}  
                  onChange={(e) => handleInputChange('adresse_principale', e.target.value)}  
                  className="form-textarea"  
                  rows="2"  
                  placeholder="Votre adresse complète"  
                />  
              ) : (  
                <div className="form-display">  
                  {profile.adresse_principale || 'Non renseigné'}  
                </div>  
              )}  
            </div>  
  
            <div className="form-grid">  
                <div className="form-group">  
                <label className="form-label">Ville</label>  
                {isEditing ? (  
                    <select  
                    value={editedProfile.ville || 'Casablanca'}  
                    onChange={(e) => handleInputChange('ville', e.target.value)}  
                    className="form-select"  
                    >  
                    <option value="Casablanca">Casablanca</option>  
                    </select>  
                ) : (  
                    <div className="form-display">  
                    {profile.ville || 'Casablanca'}  
                    </div>  
                )}  
                </div>
              <div className="form-group">  
                <label className="form-label">Région</label>  
                {isEditing ? (  
                  <select  
                    value={editedProfile.region_principale || ''}  
                    onChange={(e) => handleInputChange('region_principale', e.target.value)}  
                    className="form-select"  
                  >  
                    <option value="">Sélectionner une région</option>  
                    {regions.map((region) => (  
                      <option key={region} value={region}>  
                        {region}  
                      </option>  
                    ))}  
                  </select>  
                ) : (  
                  <div className="form-display">  
                    {profile.region_principale || 'Non renseigné'}  
                  </div>  
                )}  
              </div>  
            </div>  
          </div>  
        </div>  
  
        {/* Actions supplémentaires */}  
        <div className="profile-card">  
          <div className="card-header">  
            <div className="card-header-content">  
              <h2 className="card-title">Actions Supplémentaires</h2>  
            </div>  
          </div>  
          <div className="card-content">  
            <div className="actions-grid">  
              <button className="btn btn-outline action-btn">  
                <LocationOn className="btn-icon" />  
                Ajouter une adresse secondaire  
              </button>  
              <button className="btn btn-outline action-btn">  
                <Lock className="btn-icon" />  
                Modifier le mot de passe  
              </button>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}