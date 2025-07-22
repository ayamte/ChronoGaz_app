import { useState } from "react"  
import "./signup.css"  
  
export function SignupForm({ className = "", ...props }) {  
  const [clientType, setClientType] = useState("")  
  const [formData, setFormData] = useState({  
    firstName: "",  
    lastName: "",  
    email: "",  
    password: "",  
    phone: "",  
    address: "",  
    region: "",  
    clientType: "", // Ajouté  
    taxNumber: ""  
  })  
  
  const handleInputChange = (e) => {  
    const { name, value } = e.target  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }))  
  }  
  
  const handleSelectChange = (e) => {  
    const { name, value } = e.target  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }))  
      
    // Mettre à jour clientType quand le type de client change  
    if (name === "clientType") {  
      setClientType(value)  
    }  
  }  
  
  const handleSubmit = (e) => {  
    e.preventDefault()  
    console.log("Signup attempt:", formData)  
  }  
  
  return (  
    <div className={`signup-page-background`}>  
     <div className={`signup-form-container ${className}`} {...props}>   
      <div className="signup-card">  
        <div className="signup-card-content">  
          <form className="signup-form" onSubmit={handleSubmit}>  
            <div className="signup-form-inner">  
              <div className="signup-header">  
                <h1 className="signup-title">Créer un compte</h1>  
                <p className="signup-subtitle">Rejoignez ChronoGaz aujourd'hui</p>  
              </div>  
  
              <div className="signup-name-row">  
                <div className="signup-field">  
                  <label htmlFor="firstName" className="signup-label">Prénom</label>  
                  <input  
                    id="firstName"  
                    name="firstName"  
                    type="text"  
                    value={formData.firstName}  
                    onChange={handleInputChange}  
                    className="signup-input"  
                    required  
                  />  
                </div>  
                <div className="signup-field">  
                  <label htmlFor="lastName" className="signup-label">Nom</label>  
                  <input  
                    id="lastName"  
                    name="lastName"  
                    type="text"  
                    value={formData.lastName}  
                    onChange={handleInputChange}  
                    className="signup-input"  
                    required  
                  />  
                </div>  
              </div>  
  
              <div className="signup-field">  
                <label htmlFor="email" className="signup-label">Adresse e-mail</label>  
                <input  
                  id="email"  
                  name="email"  
                  type="email"  
                  value={formData.email}  
                  onChange={handleInputChange}  
                  className="signup-input"  
                  required  
                />  
              </div>  
  
              <div className="signup-field">  
                <label htmlFor="password" className="signup-label">Mot de passe</label>  
                <input  
                  id="password"  
                  name="password"  
                  type="password"  
                  value={formData.password}  
                  onChange={handleInputChange}  
                  className="signup-input"  
                  required  
                />  
              </div>  
  
              <div className="signup-field">  
                <label htmlFor="phone" className="signup-label">Numéro de téléphone</label>  
                <input  
                  id="phone"  
                  name="phone"  
                  type="tel"  
                  value={formData.phone}  
                  onChange={handleInputChange}  
                  className="signup-input"  
                  required  
                />  
              </div>  
  
              <div className="signup-field">  
                <label htmlFor="address" className="signup-label">Adresse complète</label>  
                <input  
                  id="address"  
                  name="address"  
                  type="text"  
                  value={formData.address}  
                  onChange={handleInputChange}  
                  className="signup-input"  
                  required  
                />  
              </div>  
  
              <div className="signup-field">  
                <label htmlFor="region" className="signup-label">Région</label>  
                <select  
                  id="region"  
                  name="region"  
                  value={formData.region}  
                  onChange={handleSelectChange}  
                  className="signup-select"  
                  required  
                >  
                  <option value="">Sélectionnez votre région</option>  
                  <option value="2mars">2 Mars</option>  
                  <option value="maarif">Maarif</option>  
                  <option value="biranazarane">Bir Anzarane</option>  
                  <option value="boulevardalqods">Boulevard al qods</option>  
                </select>  
              </div>  
  
              {/* NOUVEAU CHAMP : Type de client */}  
              <div className="signup-field">  
                <label htmlFor="clientType" className="signup-label">Type de client</label>  
                <select  
                  id="clientType"  
                  name="clientType"  
                  value={formData.clientType}  
                  onChange={handleSelectChange}  
                  className="signup-select"  
                  required  
                >  
                  <option value="">Sélectionnez votre type</option>  
                  <option value="particulier">Particulier</option>  
                  <option value="entreprise">Entreprise</option>  
                  <option value="industrie">Industrie</option>  
                </select>  
              </div>  
  
              {/* CHAMP CONDITIONNEL : Matricule fiscal (seulement si entreprise) */}  
              {clientType === "entreprise" && (  
                <div className="signup-field signup-conditional-field">  
                  <label htmlFor="taxNumber" className="signup-label">Matricule fiscal</label>  
                  <input  
                    id="taxNumber"  
                    name="taxNumber"  
                    type="text"  
                    placeholder="Ex: 12345678"  
                    value={formData.taxNumber}  
                    onChange={handleInputChange}  
                    className="signup-input"  
                    required  
                  />  
                </div>  
              )}  
  
              <button type="submit" className="signup-submit-button">  
                Créer mon compte  
              </button>  
  
              <div className="signup-divider">  
                <span className="signup-divider-text">Ou continuez avec</span>  
              </div>  
  
              <div className="signup-social-buttons">  
                <button type="button" className="signup-social-button">  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="signup-social-icon">  
                    <path  
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"  
                      fill="currentColor"  
                    />  
                  </svg>  
                  <span className="signup-sr-only">S'inscrire avec Google</span>  
                </button>  
              </div>  
  
              <div className="signup-login-link">  
                Vous avez déjà un compte ?{" "}  
                <button type="button" className="signup-login-anchor">  
                  Se connecter  
                </button>  
              </div>  
            </div>  
          </form>  
        </div>  
      </div>  
  
      <div className="signup-terms">  
        En cliquant sur continuer, vous acceptez nos <button type="button">Conditions d'utilisation</button> et notre{" "}  
        <button type="button">Politique de confidentialité</button>.  
      </div>  
    </div>
    </div>  
  )  
}  
  
export default SignupForm