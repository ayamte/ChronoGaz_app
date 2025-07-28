import { useState } from "react"      
import {        
  MdInventory as Package,         
  MdUpload as Upload,        
  MdSave as Save,        
  MdClose as X,        
  MdCheckCircle as CheckCircle,        
  MdWarning as AlertTriangle,        
  MdArrowBack as ArrowLeft,        
  MdImage as ImageIcon,        
  MdAttachMoney as Euro,        
  MdTag as Hash,        
  MdDescription as FileText,        
  MdLabel as TagLabel      
} from "react-icons/md"  
import "./AjouterProduit.css"    
import SidebarNavigation from '../../../components/admin/Sidebar/Sidebar'    
    
// Données d'exemple pour les catégories    
const mockCategories = [    
  {    
    id: "cat-001",    
    name: "Gaz Butane",    
    description: "Bouteilles et équipements gaz butane",    
  },    
  {    
    id: "cat-002",    
    name: "Gaz Propane",    
    description: "Bouteilles et équipements gaz propane",    
  },    
  {    
    id: "cat-003",    
    name: "Citernes",    
    description: "Citernes de gaz de différentes capacités",    
  },    
  {    
    id: "cat-004",    
    name: "Accessoires",    
    description: "Détendeurs, tuyaux et accessoires",    
  },    
  {    
    id: "cat-005",    
    name: "Équipements",    
    description: "Équipements de sécurité et outils",    
  },    
]    
    
export default function AjouterProduit() {   
  const [formData, setFormData] = useState({  
    name: "",  
    code: "",  
    description: "",  
    unitPrice: "",  
    stockQuantity: "",  
    categoryId: "",  
    image: null,  
  })  
  
  const [errors, setErrors] = useState({})  
  const [loading, setLoading] = useState(false)  
  const [showSuccess, setShowSuccess] = useState(false)  
  const [imagePreview, setImagePreview] = useState(null)  
  
  // Fonction de validation  
  const validateForm = () => {  
    const newErrors = {}  
  
    // Validation du nom  
    if (!formData.name.trim()) {  
      newErrors.name = "Le nom du produit est obligatoire."  
    } else if (formData.name.trim().length < 3) {  
      newErrors.name = "Le nom doit contenir au moins 3 caractères."  
    }  
  
    // Validation du code  
    if (!formData.code.trim()) {  
      newErrors.code = "Le code du produit est obligatoire."  
    } else if (!/^[A-Z0-9-]+$/.test(formData.code.trim())) {  
      newErrors.code = "Le code doit contenir uniquement des lettres majuscules, chiffres et tirets."  
    }  
  
    // Validation de la description  
    if (!formData.description.trim()) {  
      newErrors.description = "La description est obligatoire."  
    } else if (formData.description.trim().length < 10) {  
      newErrors.description = "La description doit contenir au moins 10 caractères."  
    }  
  
    // Validation du prix unitaire  
    if (!formData.unitPrice.trim()) {  
      newErrors.unitPrice = "Le prix unitaire est obligatoire."  
    } else {  
      const price = parseFloat(formData.unitPrice)  
      if (isNaN(price) || price <= 0) {  
        newErrors.unitPrice = "Le prix doit être un nombre positif."  
      } else if (price > 10000) {  
        newErrors.unitPrice = "Le prix ne peut pas dépasser 10 000€."  
      }  
    }  
  
    // Validation de la quantité en stock  
    if (!formData.stockQuantity.trim()) {  
      newErrors.stockQuantity = "La quantité en stock est obligatoire."  
    } else {  
      const quantity = parseInt(formData.stockQuantity)  
      if (isNaN(quantity) || quantity < 0) {  
        newErrors.stockQuantity = "La quantité doit être un nombre entier positif ou zéro."  
      } else if (quantity > 100000) {  
        newErrors.stockQuantity = "La quantité ne peut pas dépasser 100 000 unités."  
      }  
    }  
  
    // Validation de la catégorie  
    if (!formData.categoryId) {  
      newErrors.categoryId = "Veuillez sélectionner une catégorie."  
    }  
  
    // Validation de l'image (optionnelle mais si fournie, valider)  
    if (formData.image) {  
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]  
      if (!allowedTypes.includes(formData.image.type)) {  
        newErrors.image = "Format d'image non supporté. Utilisez JPG, PNG ou WebP."  
      } else if (formData.image.size > 5 * 1024 * 1024) {  
        // Limite de 5MB  
        newErrors.image = "L'image ne doit pas dépasser 5MB."  
      }  
    }  
  
    return newErrors  
  }  
  
  const handleInputChange = (field, value) => {  
    setFormData(prev => ({ ...prev, [field]: value }))  
  
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper  
    if (errors[field]) {  
      setErrors(prev => ({ ...prev, [field]: undefined }))  
    }  
  }  
  
  const handleImageUpload = (event) => {  
    const file = event.target.files?.[0]  
    if (file) {  
      setFormData(prev => ({ ...prev, image: file }))  
  
      // Créer un aperçu  
      const reader = new FileReader()  
      reader.onload = (e) => {  
        setImagePreview(e.target?.result)  
      }  
      reader.readAsDataURL(file)  
  
      // Effacer l'erreur d'image  
      if (errors.image) {  
        setErrors(prev => ({ ...prev, image: undefined }))  
      }  
    }  
  }  
  
  const removeImage = () => {  
    setFormData(prev => ({ ...prev, image: null }))  
    setImagePreview(null)  
    // Réinitialiser l'input file  
    const fileInput = document.getElementById("image-upload")  
    if (fileInput) {  
      fileInput.value = ""  
    }  
  }  
  
  const handleSubmit = async (e) => {  
    e.preventDefault()  
  
    const validationErrors = validateForm()  
    if (Object.keys(validationErrors).length > 0) {  
      setErrors(validationErrors)  
      return  
    }  
  
    setLoading(true)  
    try {  
      // Simuler un appel API  
      await new Promise(resolve => setTimeout(resolve, 2000))  
  
      console.log("Données du produit à sauvegarder:", {  
        ...formData,  
        unitPrice: parseFloat(formData.unitPrice),  
        stockQuantity: parseInt(formData.stockQuantity),  
      })  
  
      setShowSuccess(true)  
  
      // Réinitialiser le formulaire après soumission réussie  
      setTimeout(() => {  
        setFormData({  
          name: "",  
          code: "",  
          description: "",  
          unitPrice: "",  
          stockQuantity: "",  
          categoryId: "",  
          image: null,  
        })  
        setImagePreview(null)  
        setShowSuccess(false)  
      }, 3000)  
    } catch (error) {  
      setErrors({ name: "Erreur lors de l'ajout du produit. Veuillez réessayer." })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const resetForm = () => {  
    setFormData({  
      name: "",  
      code: "",  
      description: "",  
      unitPrice: "",  
      stockQuantity: "",  
      categoryId: "",  
      image: null,  
    })  
    setErrors({})  
    setImagePreview(null)  
  
    // Réinitialiser l'input file  
    const fileInput = document.getElementById("image-upload")  
    if (fileInput) {  
      fileInput.value = ""  
    }  
  }  
  
  if (showSuccess) {  
    return (  
      <div className="product-management-layout">  
        <SidebarNavigation />  
          
        <div className="product-management-wrapper">  
          <div className="product-management-container">  
            <main className="product-main">  
              <div className="success-card">  
                <div className="success-content">  
                  <div className="success-icon">  
                    <CheckCircle className="success-check" />  
                  </div>  
                  <h3 className="success-title">Produit Ajouté avec Succès</h3>  
                  <p className="success-message">  
                    Le produit <strong>{formData.name}</strong> a été ajouté à l'inventaire.  
                  </p>  
                  <div className="success-actions">  
                    <button   
                      className="success-btn success-btn-primary"   
                      onClick={() => setShowSuccess(false)}  
                    >  
                      <Package className="btn-icon" />  
                      Ajouter un Autre Produit  
                    </button>  
                    <button className="success-btn success-btn-secondary">  
                      Voir Tous les Produits  
                    </button>  
                  </div>  
                </div>  
              </div>  
            </main>  
          </div>  
        </div>  
      </div>  
    )  
  }  
  
  return (  
    <div className="product-management-layout">  
      <SidebarNavigation />  
        
      <div className="product-management-wrapper">  
        <div className="product-management-container">  
          <main className="product-main">  
            <div className="page-header">  
              <div className="page-header-content">  
                <div className="page-header-left">  
                  <h2 className="page-title">Ajouter un Nouveau Produit</h2>  
                  <p className="page-subtitle">  
                    Ajoutez un nouveau produit à votre inventaire avec toutes les informations nécessaires  
                  </p>  
                </div>  
              </div>  
            </div>  
  
            <form onSubmit={handleSubmit} className="product-form">  
              <div className="form-grid">  
                {/* Section principale du formulaire */}  
                <div className="form-main">  
                  {/* Informations de base */}  
                  <div className="form-card">  
                    <div className="form-card-header">  
                      <div className="form-card-title">  
                        <Package className="form-card-icon" />  
                        <span>Informations de Base</span>  
                      </div>  
                    </div>  
                    <div className="form-card-content">  
                      <div className="form-row">  
                        <div className="form-group">  
                          <label htmlFor="product-name" className="form-label">  
                            <FileText className="label-icon" />  
                            <span>Nom du Produit *</span>  
                          </label>  
                          <input  
                            id="product-name"  
                            type="text"  
                            value={formData.name}  
                            onChange={(e) => handleInputChange("name", e.target.value)}  
                            placeholder="Ex: Bouteille Gaz Butane 13kg"  
                            className={`form-input ${errors.name ? "form-input-error" : ""}`}  
                          />  
                          {errors.name && (  
                            <p className="form-error">  
                              <AlertTriangle className="error-icon" />  
                              <span>{errors.name}</span>  
                            </p>  
                          )}  
                          <p className="form-help">Nom commercial du produit (minimum 3 caractères)</p>  
                        </div>  
  
                        <div className="form-group">  
                          <label htmlFor="product-code" className="form-label">  
                            <Hash className="label-icon" />  
                            <span>Code du Produit *</span>  
                          </label>  
                          <input  
                            id="product-code"  
                            type="text"  
                            value={formData.code}  
                            onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}  
                            placeholder="Ex: BUT13"  
                            className={`form-input ${errors.code ? "form-input-error" : ""}`}  
                          />  
                          {errors.code && (  
                            <p className="form-error">  
                              <AlertTriangle className="error-icon" />  
                              <span>{errors.code}</span>  
                            </p>  
                          )}  
                          <p className="form-help">  
                            Code unique (lettres majuscules, chiffres et tirets uniquement)  
                          </p>  
                        </div>  
                      </div>  
  
                      <div className="form-group">  
                        <label htmlFor="description" className="form-label">  
                          <FileText className="label-icon" />  
                          <span>Description *</span>  
                        </label>  
                        <textarea  
                          id="description"  
                          value={formData.description}  
                          onChange={(e) => handleInputChange("description", e.target.value)}  
                          placeholder="Description détaillée du produit, ses caractéristiques et utilisations..."  
                          rows={4}  
                          className={`form-textarea ${errors.description ? "form-input-error" : ""}`}  
                        />    
                        {errors.description && (    
                          <p className="form-error">    
                            <AlertTriangle className="error-icon" />    
                            <span>{errors.description}</span>    
                          </p>    
                        )}    
                        <p className="form-help">    
                          Description complète du produit (minimum 10 caractères)    
                        </p>    
                      </div>    
                    </div>    
                  </div>    
    
                  {/* Prix et Inventaire */}    
                  <div className="form-card">    
                    <div className="form-card-header">    
                      <div className="form-card-title">    
                        <Euro className="form-card-icon" />    
                        <span>Prix et Inventaire</span>    
                      </div>    
                    </div>    
                    <div className="form-card-content">    
                      <div className="form-row">    
                        <div className="form-group">    
                          <label htmlFor="unit-price" className="form-label">    
                            <Euro className="label-icon" />    
                            <span>Prix Unitaire (€) *</span>    
                          </label>    
                          <input    
                            id="unit-price"    
                            type="number"    
                            step="0.01"    
                            min="0"    
                            max="10000"    
                            value={formData.unitPrice}    
                            onChange={(e) => handleInputChange("unitPrice", e.target.value)}    
                            placeholder="0.00"    
                            className={`form-input ${errors.unitPrice ? "form-input-error" : ""}`}    
                          />    
                          {errors.unitPrice && (    
                            <p className="form-error">    
                              <AlertTriangle className="error-icon" />    
                              <span>{errors.unitPrice}</span>    
                            </p>    
                          )}    
                          <p className="form-help">Prix de vente unitaire en euros</p>    
                        </div>    
  
                        <div className="form-group">    
                          <label htmlFor="stock-quantity" className="form-label">    
                            <Package className="label-icon" />    
                            <span>Quantité en Stock *</span>    
                          </label>    
                          <input    
                            id="stock-quantity"    
                            type="number"    
                            min="0"    
                            max="100000"    
                            value={formData.stockQuantity}    
                            onChange={(e) => handleInputChange("stockQuantity", e.target.value)}    
                            placeholder="0"    
                            className={`form-input ${errors.stockQuantity ? "form-input-error" : ""}`}    
                          />    
                          {errors.stockQuantity && (    
                            <p className="form-error">    
                              <AlertTriangle className="error-icon" />    
                              <span>{errors.stockQuantity}</span>    
                            </p>    
                          )}    
                          <p className="form-help">Quantité disponible en stock</p>    
                        </div>    
                      </div>    
    
                      <div className="form-group">    
                        <label htmlFor="category" className="form-label">    
                          <TagLabel className="label-icon" />    
                          <span>Catégorie *</span>    
                        </label>    
                        <select    
                          id="category"    
                          value={formData.categoryId}    
                          onChange={(e) => handleInputChange("categoryId", e.target.value)}    
                          className={`form-select ${errors.categoryId ? "form-input-error" : ""}`}    
                        >    
                          <option value="">Sélectionner une catégorie</option>    
                          {mockCategories.map((category) => (    
                            <option key={category.id} value={category.id}>    
                              {category.name} - {category.description}    
                            </option>    
                          ))}    
                        </select>    
                        {errors.categoryId && (    
                          <p className="form-error">    
                            <AlertTriangle className="error-icon" />    
                            <span>{errors.categoryId}</span>    
                          </p>    
                        )}    
                        <p className="form-help">Catégorie à laquelle appartient le produit</p>    
                      </div>    
                    </div>    
                  </div>    
                </div>    
    
                {/* Section latérale */}    
                <div className="form-sidebar">    
                  {/* Upload d'image */}    
                  <div className="form-card">    
                    <div className="form-card-header">    
                      <div className="form-card-title">    
                        <ImageIcon className="form-card-icon" />    
                        <span>Image du Produit</span>    
                      </div>    
                    </div>    
                    <div className="form-card-content">    
                      {imagePreview ? (    
                        <div className="image-preview-container">    
                          <img    
                            src={imagePreview}    
                            alt="Aperçu du produit"    
                            className="image-preview"    
                          />    
                          <button    
                            type="button"    
                            onClick={removeImage}    
                            className="image-remove-btn"    
                          >    
                            <X className="remove-icon" />    
                          </button>    
                        </div>    
                      ) : (    
                        <div className="image-placeholder">    
                          <ImageIcon className="placeholder-icon" />    
                          <p className="placeholder-text">Aucune image sélectionnée</p>    
                          <p className="placeholder-help">JPG, PNG ou WebP (max 5MB)</p>    
                        </div>    
                      )}    
    
                      <div className="form-group">    
                        <label htmlFor="image-upload" className="form-label">    
                          <Upload className="label-icon" />    
                          <span>Télécharger une Image</span>    
                        </label>    
                        <input    
                          id="image-upload"    
                          type="file"    
                          accept="image/jpeg,image/jpg,image/png,image/webp"    
                          onChange={handleImageUpload}    
                          className={`form-input-file ${errors.image ? "form-input-error" : ""}`}    
                        />    
                        {errors.image && (    
                          <p className="form-error">    
                            <AlertTriangle className="error-icon" />    
                            <span>{errors.image}</span>    
                          </p>    
                        )}    
                        <p className="form-help">    
                          Image optionnelle du produit (JPG, PNG, WebP - max 5MB)    
                        </p>    
                      </div>    
                    </div>    
                  </div>    
    
                  {/* Actions du formulaire */}    
                  <div className="form-card">    
                    <div className="form-card-header">    
                      <div className="form-card-title">    
                        <span>Actions</span>    
                      </div>    
                    </div>    
                    <div className="form-card-content">    
                      <div className="form-actions-vertical">    
                        <button     
                          type="submit"     
                          disabled={loading}     
                          className="form-btn form-btn-primary"    
                        >    
                          {loading ? (    
                            <>    
                              <div className="loading-spinner" />    
                              Ajout en cours...    
                            </>    
                          ) : (    
                            <>    
                              <Save className="btn-icon" />    
                              Ajouter le Produit    
                            </>    
                          )}    
                        </button>    
    
                        <button    
                          type="button"    
                          onClick={resetForm}    
                          disabled={loading}    
                          className="form-btn form-btn-secondary"    
                        >    
                          <X className="btn-icon" />    
                          Réinitialiser    
                        </button>    
    
                        <div className="form-separator"></div>    
    
                        <button className="form-btn form-btn-outline">    
                          <ArrowLeft className="btn-icon" />    
                          Annuler    
                        </button>    
                      </div>    
                    </div>    
                  </div>    
    
                  {/* Aide */}    
                  <div className="form-card">    
                    <div className="form-card-header">    
                      <div className="form-card-title">    
                        <span>Aide</span>    
                      </div>    
                    </div>    
                    <div className="form-card-content">    
                      <div className="help-content">    
                        <div className="help-item">    
                          <strong>Nom:</strong> Nom commercial du produit    
                        </div>    
                        <div className="help-item">    
                          <strong>Code:</strong> Identifiant unique (ex: BUT13)    
                        </div>    
                        <div className="help-item">    
                          <strong>Prix:</strong> Prix de vente en euros    
                        </div>    
                        <div className="help-item">    
                          <strong>Stock:</strong> Quantité disponible    
                        </div>    
                        <div className="help-item">    
                          <strong>Image:</strong> Photo du produit (optionnel)    
                        </div>    
                      </div>    
                    </div>    
                  </div>    
                </div>    
              </div>    
            </form>    
          </main>    
        </div>    
      </div>    
    </div>    
  )    
}