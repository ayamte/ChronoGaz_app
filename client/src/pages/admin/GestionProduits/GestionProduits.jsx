import { useState, useEffect } from "react"
import {
  MdLocalGasStation as GasStation,
  MdAdd as Plus,
  MdSearch as Search,
  MdEdit as Edit,
  MdDelete as Delete,
  MdClose as X,
  MdCategory as Category
} from "react-icons/md"
import "./GestionProduits.css"
import productService from '../../../services/productService'

export default function GestionProduits() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    capacity: "",
    weight: "",
    price: "",
    description: "",
    specifications: "",
    actif: true
  })

  // Catégories de produits
  const categories = [
    { value: "BUTANE", label: "Butane" },
    { value: "PROPANE", label: "Propane" },
    { value: "ACCESSOIRE", label: "Accessoires" }
  ]

  // Charger les produits au montage
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getAllProducts()
      setProducts(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err)
      setError("Erreur lors du chargement des produits")
      // Données de test
      setProducts([
        {
          _id: "1",
          code: "BUT13",
          name: "Butane 13kg",
          category: "BUTANE",
          capacity: 13,
          weight: 13,
          price: 125,
          description: "Bouteille de butane 13kg pour usage domestique",
          actif: true
        },
        {
          _id: "2",
          code: "PROP35",
          name: "Propane 35kg",
          category: "PROPANE",
          capacity: 35,
          weight: 35,
          price: 350,
          description: "Bouteille de propane 35kg pour usage industriel",
          actif: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Calculer les statistiques
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.actif).length
  const inactiveProducts = products.filter(p => !p.actif).length

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const productData = {
        ...formData,
        capacity: parseFloat(formData.capacity),
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price)
      }

      if (isEditDialogOpen && selectedProduct) {
        await productService.updateProduct(selectedProduct._id, productData)
      } else {
        await productService.createProduct(productData)
      }
      
      await loadProducts()
      resetForm()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du produit:", error)
      alert("Erreur lors de l'enregistrement du produit")
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      capacity: product.capacity,
      weight: product.weight,
      price: product.price,
      description: product.description || "",
      specifications: product.specifications || "",
      actif: product.actif
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await productService.deleteProduct(productId)
        await loadProducts()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression du produit")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      category: "",
      capacity: "",
      weight: "",
      price: "",
      description: "",
      specifications: "",
      actif: true
    })
    setSelectedProduct(null)
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="product-management-layout">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-management-layout">
      
      <div className="product-management-wrapper">
        <div className="product-management-container">
          <div className="product-management-content">
            {/* En-tête */}
            <div className="product-header">
              <div className="header-content">
                <h1 className="page-title">
                  <GasStation className="icon" />
                  Gestion des Produits
                </h1>
                <p className="page-subtitle">
                  Gérez votre catalogue de bouteilles de gaz et accessoires
                </p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="icon" />
                Nouveau Produit
              </button>
            </div>

            {/* Cartes de statistiques */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <GasStation />
                </div>
                <div className="stat-content">
                  <h3>{totalProducts}</h3>
                  <p>Total Produits</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <Category />
                </div>
                <div className="stat-content">
                  <h3>{activeProducts}</h3>
                  <p>Produits Actifs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <Category />
                </div>
                <div className="stat-content">
                  <h3>{inactiveProducts}</h3>
                  <p>Produits Inactifs</p>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, code ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Tableau des produits */}
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Capacité</th>
                    <th>Poids</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product._id}>
                      <td className="font-medium">{product.code}</td>
                      <td>{product.name}</td>
                      <td>
                        <span className={`category-badge ${product.category?.toLowerCase()}`}>
                          {product.category}
                        </span>
                      </td>
                      <td>{product.capacity} kg</td>
                      <td>{product.weight} kg</td>
                      <td>{product.price} DH</td>
                      <td>
                        <span className={`badge ${product.actif ? 'badge-success' : 'badge-danger'}`}>
                          {product.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(product)}
                            title="Modifier"
                          >
                            <Edit />
                          </button>
                          <button 
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(product._id)}
                            title="Supprimer"
                          >
                            <Delete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <GasStation className="empty-icon" />
                  <p>Aucun produit trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Ajouter/Modifier Produit */}
      {(isAddDialogOpen || isEditDialogOpen) && (
        <div className="dialog-overlay" onClick={resetForm}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{isEditDialogOpen ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Code produit</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Ex: BUT13"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Butane 13kg"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacité (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="Ex: 13"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Poids (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="Ex: 13"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prix (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Ex: 125"
                    required
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du produit..."
                  rows="3"
                />
              </div>
              <div className="form-group full-width">
                <label>Spécifications techniques</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder="Spécifications techniques..."
                  rows="3"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => handleInputChange('actif', e.target.checked)}
                  />
                  Produit actif
                </label>
              </div>
              <div className="dialog-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditDialogOpen ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
