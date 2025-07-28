// Initialisation complète de la base de données ChronoGaz MongoDB  
print('🚀 Initialisation complète de ChronoGaz MongoDB...');  
  
db = db.getSiblingDB('chronogaz_db');  
  
// Créer un utilisateur pour l'application  
db.createUser({  
  user: 'chronogaz_user',  
  pwd: 'chronogaz_app_password',  
  roles: [  
    {  
      role: 'readWrite',  
      db: 'chronogaz_db'  
    }  
  ]  
});  
  
// ===== COLLECTIONS PRINCIPALES =====  
  
// Collection Users (remplace user, physical_user, moral_user, customer, employe, admin)  
db.createCollection('users', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['email', 'password_hash', 'role_id'],  
      properties: {  
        email: { bsonType: 'string' },  
        password_hash: { bsonType: 'string' },  
        role_id: { bsonType: 'objectId' },  
        statut: { enum: ['ACTIF', 'INACTIF', 'SUSPENDU', 'EN_ATTENTE'] }  
      }  
    }  
  }  
});  
  
// Collection Roles  
db.createCollection('roles', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['code', 'nom'],  
      properties: {  
        code: { bsonType: 'string' },  
        nom: { bsonType: 'string' }  
      }  
    }  
  }  
});  
  
// Collection PhysicalUsers  
db.createCollection('physicalusers', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['user_id', 'first_name', 'last_name', 'civilite'],  
      properties: {  
        user_id: { bsonType: 'objectId' },  
        first_name: { bsonType: 'string' },  
        last_name: { bsonType: 'string' },  
        civilite: { enum: ['M', 'Mme', 'Mlle'] }  
      }  
    }  
  }  
});  
  
// Collection MoralUsers  
db.createCollection('moralusers', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['user_id', 'raison_sociale'],  
      properties: {  
        user_id: { bsonType: 'objectId' },  
        raison_sociale: { bsonType: 'string' }  
      }  
    }  
  }  
});  
  
// Collection Customers  
db.createCollection('customers', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['customer_code', 'type_client'],  
      properties: {  
        customer_code: { bsonType: 'string' },  
        type_client: { enum: ['PHYSIQUE', 'MORAL'] }  
      }  
    }  
  }  
});  
  
// Collection Employes  
db.createCollection('employes', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['physical_user_id', 'matricule', 'fonction', 'date_embauche'],  
      properties: {  
        physical_user_id: { bsonType: 'objectId' },  
        matricule: { bsonType: 'string' },  
        fonction: { enum: ['CHAUFFEUR', 'ACCOMPAGNANT', 'MAGASINIER', 'MANAGER', 'COMMERCIAL'] }  
      }  
    }  
  }  
});  
  
// Collection Products  
db.createCollection('products', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['reference', 'nom_court', 'type_gaz', 'capacite'],  
      properties: {  
        reference: { bsonType: 'string' },  
        nom_court: { bsonType: 'string' },  
        type_gaz: { enum: ['BUTANE', 'PROPANE', 'MIXTE'] },  
        capacite: { bsonType: 'number', minimum: 0 }  
      }  
    }  
  }  
});  
  
// Collection Commandes  
db.createCollection('commandes', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['numero_commande', 'customer_id', 'statut_id'],  
      properties: {  
        numero_commande: { bsonType: 'string' },  
        customer_id: { bsonType: 'objectId' },  
        statut_id: { bsonType: 'objectId' }  
      }  
    }  
  }  
});  
  
// Collection Trucks  
db.createCollection('trucks', {  
  validator: {  
    $jsonSchema: {  
      bsonType: 'object',  
      required: ['matricule'],  
      properties: {  
        matricule: { bsonType: 'string' },  
        carburant: { enum: ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'] }  
      }  
    }  
  }  
});  
  
// Collection Depots  
db.createCollection('depots');  
db.createCollection('regions');  
db.createCollection('addresses');  
db.createCollection('categories');  
db.createCollection('ums');  
db.createCollection('statutcommandes');  
db.createCollection('planifications');  
db.createCollection('livraisons');  
db.createCollection('stockdepots');  
db.createCollection('stocklines');  
db.createCollection('fournisseurs');  
  
// ===== DONNÉES DE BASE =====  
  
// Insérer les rôles  
const roleAdmin = db.roles.insertOne({  
  code: 'ADMIN',  
  nom: 'Administrateur',  
  description: 'Accès complet au système',  
  niveau_acces: 5,  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const roleClient = db.roles.insertOne({  
  code: 'CLIENT',  
  nom: 'Client',  
  description: 'Accès client pour commandes',  
  niveau_acces: 1,  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const roleEmploye = db.roles.insertOne({  
  code: 'EMPLOYE',  
  nom: 'Employé',  
  description: 'Accès employé pour livraisons',  
  niveau_acces: 2,  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les régions  
const regionCasa = db.regions.insertOne({  
  code: 'CASA',  
  nom: 'Casablanca',  
  description: 'Région du Grand Casablanca',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const regionRabat = db.regions.insertOne({  
  code: 'RABAT',  
  nom: 'Rabat-Salé',  
  description: 'Région de Rabat-Salé-Kénitra',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les adresses  
const addressCasa = db.addresses.insertOne({  
  rue: '123 Rue Mohammed V',  
  ville: 'Casablanca',  
  region_id: regionCasa.insertedId,  
  type_adresse: 'DEPOT',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les utilisateurs  
const userAdmin = db.users.insertOne({  
  email: 'admin@chronogaz.ma',  
  password_hash: '$2b$10$example_hash_admin',  
  role_id: roleAdmin.insertedId,  
  statut: 'ACTIF',  
  last_login: null,  
  email_verified: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const userClient = db.users.insertOne({  
  email: 'client@example.ma',  
  password_hash: '$2b$10$example_hash_client',  
  role_id: roleClient.insertedId,  
  statut: 'ACTIF',  
  last_login: null,  
  email_verified: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const userEmploye = db.users.insertOne({  
  email: 'chauffeur@chronogaz.ma',  
  password_hash: '$2b$10$example_hash_employe',  
  role_id: roleEmploye.insertedId,  
  statut: 'ACTIF',  
  last_login: null,  
  email_verified: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les utilisateurs physiques  
const physicalAdmin = db.physicalusers.insertOne({  
  user_id: userAdmin.insertedId,  
  first_name: 'Admin',  
  last_name: 'ChronoGaz',  
  civilite: 'M',  
  telephone_principal: '0612345678',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const physicalClient = db.physicalusers.insertOne({  
  user_id: userClient.insertedId,  
  first_name: 'Jean',  
  last_name: 'Dupont',  
  civilite: 'M',  
  cin: 'AB123456',  
  telephone_principal: '0687654321',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const physicalEmploye = db.physicalusers.insertOne({  
  user_id: userEmploye.insertedId,  
  first_name: 'Ahmed',  
  last_name: 'Alami',  
  civilite: 'M',  
  cin: 'CD789012',  
  telephone_principal: '0698765432',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer le client  
db.customers.insertOne({  
  customer_code: 'CLI-P000001',  
  type_client: 'PHYSIQUE',  
  physical_user_id: physicalClient.insertedId,  
  moral_user_id: null,  
  statut: 'ACTIF',  
  credit_limite: 5000.00,  
  credit_utilise: 0.00,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer l'employé  
db.employes.insertOne({  
  physical_user_id: physicalEmploye.insertedId,  
  matricule: 'EMP001',  
  fonction: 'CHAUFFEUR',  
  date_embauche: new Date('2024-01-15'),  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les catégories  
const categoryButane = db.categories.insertOne({  
  code: 'GAZ_BUT',  
  nom: 'Gaz Butane',  
  description: 'Bouteilles et équipements gaz butane',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const categoryPropane = db.categories.insertOne({  
  code: 'GAZ_PROP',  
  nom: 'Gaz Propane',  
  description: 'Bouteilles et équipements gaz propane',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les unités de mesure  
const umUnite = db.ums.insertOne({  
  code: 'UNITE',  
  nom: 'Unité',  
  symbole: 'u',  
  type: 'UNITE',  
  facteur_conversion: 1,  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
const umKg = db.ums.insertOne({  
  code: 'KG',  
  nom: 'Kilogramme',  
  symbole: 'kg',  
  type: 'POIDS',  
  facteur_conversion: 1,  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
// Insérer les produits  
db.products.insertMany([  
  {  
    reference: 'BUT-13KG',  
    nom_court: 'Butane 13kg',  
    nom_long: 'Bouteille de gaz butane 13kg',  
    type_gaz: 'BUTANE',  
    capacite: 13.0,  
    category_id: categoryButane.insertedId,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    reference: 'BUT-6KG',  
    nom_court: 'Butane 6kg',  
    nom_long: 'Bouteille de gaz butane 6kg',  
    type_gaz: 'BUTANE',  
    capacite: 6.0,  
    category_id: categoryButane.insertedId,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    reference: 'PROP-13KG',  
    nom_court: 'Propane 13kg',  
    nom_long: 'Bouteille de gaz propane 13kg',  
    type_gaz: 'PROPANE',  
    capacite: 13.0,  
    category_id: categoryPropane.insertedId,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  }  
]);  
  
// Insérer les statuts de commande  
const statutNouvelle = db.statutcommandes.insertOne({  
  code: 'NOUVELLE',  
  nom: 'Nouvelle',  
  description: 'Commande nouvellement créée',  
  ordre_affichage: 1,  
  couleur: '#007bff',  
  actif: true,  
  createdAt: new Date(),  
  updatedAt: new Date()  
});  
  
db.statutcommandes.insertMany([  
  {  
    code: 'CONFIRMEE',  
    nom: 'Confirmée',  
    description: 'Commande confirmée par le client',  
    ordre_affichage: 2,  
    couleur: '#28a745',  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    code: 'PLANIFIEE',  
    nom: 'Planifiée',  
    description: 'Commande planifiée pour livraison',  
    ordre_affichage: 3,  
    couleur: '#ffc107',  
    actif: true,  
    createdAt: new Date(),
    updatedAt: new Date()  
  },  
  {  
    code: 'EN_COURS',  
    nom: 'En cours',  
    description: 'Livraison en cours',  
    ordre_affichage: 4,  
    couleur: '#fd7e14',  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    code: 'LIVREE',  
    nom: 'Livrée',  
    description: 'Commande livrée avec succès',  
    ordre_affichage: 5,  
    couleur: '#20c997',  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    code: 'ANNULEE',  
    nom: 'Annulée',  
    description: 'Commande annulée',  
    ordre_affichage: 6,  
    couleur: '#dc3545',  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  }  
]);  
  
// Insérer les camions  
db.trucks.insertMany([  
  {  
    matricule: 'CAM001',  
    marque: 'Mercedes',  
    modele: 'Sprinter',  
    annee_construction: 2022,  
    capacite_charge: 3500.00,  
    carburant: 'DIESEL',  
    gps_actif: true,  
    region_id: regionCasa.insertedId,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  },  
  {  
    matricule: 'CAM002',  
    marque: 'Renault',  
    modele: 'Master',  
    annee_construction: 2021,  
    capacite_charge: 3000.00,  
    carburant: 'DIESEL',  
    gps_actif: true,  
    region_id: regionRabat.insertedId,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  }  
]);  
  
// Insérer les dépôts  
db.depots.insertMany([  
  {  
    code: 'DEP-CASA-01',  
    nom: 'Dépôt Casablanca Centre',  
    description: 'Dépôt principal de Casablanca',  
    address_id: addressCasa.insertedId,  
    region_id: regionCasa.insertedId,  
    capacite_max: 10000,  
    actif: true,  
    createdAt: new Date(),  
    updatedAt: new Date()  
  }  
]);  
  
// ===== INDEX POUR PERFORMANCES =====  
  
// Index Users  
db.users.createIndex({ email: 1 }, { unique: true });  
db.users.createIndex({ role_id: 1 });  
db.users.createIndex({ statut: 1 });  
  
// Index PhysicalUsers  
db.physicalusers.createIndex({ user_id: 1 }, { unique: true });  
db.physicalusers.createIndex({ cin: 1 }, { unique: true, sparse: true });  
  
// Index Customers  
db.customers.createIndex({ customer_code: 1 }, { unique: true });  
db.customers.createIndex({ type_client: 1 });  
  
// Index Employes  
db.employes.createIndex({ matricule: 1 }, { unique: true });  
db.employes.createIndex({ physical_user_id: 1 }, { unique: true });  
  
// Index Products  
db.products.createIndex({ reference: 1 }, { unique: true });  
db.products.createIndex({ type_gaz: 1 });  
db.products.createIndex({ actif: 1 });  
  
// Index Trucks  
db.trucks.createIndex({ matricule: 1 }, { unique: true });  
db.trucks.createIndex({ region_id: 1 });  
  
// Index Roles  
db.roles.createIndex({ code: 1 }, { unique: true });  
  
print('✅ Base de données ChronoGaz complète initialisée avec succès!');  
print('📊 Collections créées avec validation');  
print('🔍 Index créés pour optimiser les performances');  
print('📝 Données d\'exemple insérées');  
print('👥 Utilisateurs créés: admin@chronogaz.ma, client@example.ma, chauffeur@chronogaz.ma');