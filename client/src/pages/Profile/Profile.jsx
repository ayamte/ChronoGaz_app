import React, { useState, useEffect } from 'react';  
import {  
  MdEdit as Edit,  
  MdSave as Save,  
  MdClose as X,  
  MdAdd as Plus,  
  MdLock as Lock,  
  MdLocationOn as LocationOn,  
  MdVisibility as Eye,  
  MdVisibilityOff as EyeOff  
} from 'react-icons/md';  
import { authService } from '../../services/authService';  
import './Profile.css';  
import CityRegionSelector from '../../components/common/CityRegionSelector'; 
  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  
  
export default function Profile() {  
  const [isEditing, setIsEditing] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  const [user, setUser] = useState(null);  
  const [profile, setProfile] = useState({});  
  const [editedProfile, setEditedProfile] = useState({});  
  
  // ✅ États pour les sélecteurs ville/région
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  
  // États pour le modal de changement de mot de passe  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);  
  const [passwordLoading, setPasswordLoading] = useState(false);  
  const [passwordError, setPasswordError] = useState('');  
  const [passwordSuccess, setPasswordSuccess] = useState('');  
  const [passwordData, setPasswordData] = useState({  
    currentPassword: '',  
    newPassword: '',  
    confirmPassword: ''  
  });  
  const [showPasswords, setShowPasswords] = useState({  
    current: false,  
    new: false,  
    confirm: false  
  });  
  
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
        
        // ✅ Initialiser les sélecteurs
        setSelectedCity(data.data.profile.city_id || '');
        setSelectedRegion(data.data.profile.region_principale || '');
  
        // Mettre à jour l'état user avec l'email frais de l'API  
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
    
    // ✅ Initialiser les sélecteurs en mode édition
    setSelectedCity(profile.city_id || '');
    setSelectedRegion(profile.region_principale || '');
    
    setError('');  
    setSuccess('');  
  };  
  
  const handleSave = async () => {  
    try {  
      setLoading(true);  
      const token = authService.getToken();  
      
      // ✅ Inclure les valeurs des sélecteurs
      const profileToSave = {
        ...editedProfile,
        city_id: selectedCity,
        region_principale: selectedRegion
      };
      
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {  
        method: 'PUT',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({  
          profile: profileToSave  
        })  
      });  
  
      if (response.status === 401) {  
        authService.logout();  
        return;  
      }  
  
      const data = await response.json();  
      if (data.success) {  
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
    
    // ✅ Réinitialiser les sélecteurs
    setSelectedCity(profile.city_id || '');
    setSelectedRegion(profile.region_principale || '');
    
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
  
  // Fonctions pour le changement de mot de passe  
  const handlePasswordModalOpen = () => {  
    setIsPasswordModalOpen(true);  
    setPasswordError('');  
    setPasswordSuccess('');  
    setPasswordData({  
      currentPassword: '',  
      newPassword: '',  
      confirmPassword: ''  
    });  
  };  
  
  const handlePasswordModalClose = () => {  
    setIsPasswordModalOpen(false);  
    setPasswordData({  
      currentPassword: '',  
      newPassword: '',  
      confirmPassword: ''  
    });  
    setPasswordError('');  
    setPasswordSuccess('');  
  };  
  
  const handlePasswordInputChange = (field, value) => {  
    setPasswordData(prev => ({  
      ...prev,  
      [field]: value  
    }));  
  };  
  
  const togglePasswordVisibility = (field) => {  
    setShowPasswords(prev => ({  
      ...prev,  
      [field]: !prev[field]  
    }));  
  };  
  
  const handlePasswordSubmit = async (e) => {  
    e.preventDefault();  
    setPasswordError('');  
  
    // Validation  
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {  
      setPasswordError('Tous les champs sont requis');  
      return;  
    }  
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {  
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');  
      return;  
    }  
  
    if (passwordData.newPassword.length < 8) {  
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');  
      return;  
    }  
  
    try {  
      setPasswordLoading(true);  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {  
        method: 'PUT',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({  
          currentPassword: passwordData.currentPassword,  
          newPassword: passwordData.newPassword  
        })  
      });  
  
      if (response.status === 401) {  
        authService.logout();  
        return;  
      }  
  
      const data = await response.json();  
      if (data.success) {  
        setPasswordSuccess('Mot de passe modifié avec succès');  
        setTimeout(() => {  
          handlePasswordModalClose();  
        }, 2000);  
      } else {  
        setPasswordError(data.message || 'Erreur lors du changement de mot de passe');  
      }  
    } catch (err) {  
      setPasswordError('Erreur de connexion');  
      console.error('Erreur:', err);  
    } finally {  
      setPasswordLoading(false);  
    }  
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
  
            {/* ✅ Ville et Région - Conditionné par isEditing */}  
            {isEditing ? (  
              <CityRegionSelector  
                selectedCity={selectedCity}  
                selectedRegion={selectedRegion}  
                onCityChange={setSelectedCity}  
                onRegionChange={setSelectedRegion}  
                required={false}  
              />  
            ) : (  
              <div className="form-grid">  
                <div className="form-group">  
                  <label className="form-label">Ville</label>  
                  <div className="form-display">  
                    {profile.city_id?.name || 'Non renseigné'}  
                  </div>  
                </div>  
                <div className="form-group">  
                  <label className="form-label">Région</label>  
                  <div className="form-display">  
                    {profile.region_principale?.nom || 'Non renseigné'}  
                  </div>  
                </div>  
              </div>  
            )}  
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
              <button     
                className="btn btn-outline action-btn"    
                onClick={handlePasswordModalOpen}    
              >    
                <Lock className="btn-icon" />    
                Modifier le mot de passe    
              </button>    
            </div>    
          </div>    
        </div>    
    
        {/* Modal de changement de mot de passe */}    
        {isPasswordModalOpen && (    
          <div className="modal-overlay" onClick={handlePasswordModalClose}>    
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>    
              <div className="modal-header">    
                <h3 className="modal-title">Modifier le mot de passe</h3>    
                <button     
                  className="modal-close-btn"    
                  onClick={handlePasswordModalClose}    
                >    
                  <X className="modal-close-icon" />    
                </button>    
              </div>    
    
              <form onSubmit={handlePasswordSubmit} className="modal-body">    
                {passwordError && (    
                  <div className="alert alert-error">    
                    {passwordError}    
                  </div>    
                )}    
                {passwordSuccess && (    
                  <div className="alert alert-success">    
                    {passwordSuccess}    
                  </div>    
                )}    
    
                <div className="form-group">    
                  <label className="form-label">Mot de passe actuel</label>    
                  <div className="password-input-container">    
                    <input    
                      type={showPasswords.current ? 'text' : 'password'}    
                      value={passwordData.currentPassword}    
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}    
                      className="form-input password-input"    
                      required    
                    />    
                    <button    
                      type="button"    
                      className="password-toggle-btn"    
                      onClick={() => togglePasswordVisibility('current')}    
                    >    
                      {showPasswords.current ? <EyeOff /> : <Eye />}    
                    </button>    
                  </div>    
                </div>    
    
                <div className="form-group">    
                  <label className="form-label">Nouveau mot de passe</label>    
                  <div className="password-input-container">    
                    <input    
                      type={showPasswords.new ? 'text' : 'password'}    
                      value={passwordData.newPassword}    
                      onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}    
                      className="form-input password-input"    
                      required    
                      minLength="8"    
                    />    
                    <button    
                      type="button"    
                      className="password-toggle-btn"    
                      onClick={() => togglePasswordVisibility('new')}    
                    >    
                      {showPasswords.new ? <EyeOff /> : <Eye />}    
                    </button>    
                  </div>    
                  <small className="form-help">    
                    Le mot de passe doit contenir au moins 8 caractères    
                  </small>    
                </div>    
    
                <div className="form-group">    
                  <label className="form-label">Confirmer le nouveau mot de passe</label>    
                  <div className="password-input-container">    
                    <input    
                      type={showPasswords.confirm ? 'text' : 'password'}    
                      value={passwordData.confirmPassword}    
                      onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}    
                      className="form-input password-input"    
                      required    
                    />    
                    <button    
                      type="button"    
                      className="password-toggle-btn"    
                      onClick={() => togglePasswordVisibility('confirm')}    
                    >    
                      {showPasswords.confirm ? <EyeOff /> : <Eye />}    
                    </button>    
                  </div>    
                </div>    
    
                <div className="modal-footer">    
                  <button    
                    type="button"    
                    className="btn btn-outline"    
                    onClick={handlePasswordModalClose}    
                    disabled={passwordLoading}    
                  >    
                    Annuler    
                  </button>    
                  <button    
                    type="submit"    
                    className="btn btn-primary"    
                    disabled={passwordLoading}    
                  >    
                    {passwordLoading ? 'Modification...' : 'Modifier le mot de passe'}    
                  </button>    
                </div>    
              </form>    
            </div>    
          </div>    
        )}    
      </div>    
    </div>    
  );    
}