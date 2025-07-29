// ========================================
// CONVERSION SQL vers MongoDB - ChronoGaz
// ========================================

// Sélection de la base
db = db.getSiblingDB('chronogaz_db');

// ========================================
// 1. COLLECTION: regions
// ========================================
db.createCollection("regions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "code", "zone_geographique", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        nom: { bsonType: "string", maxLength: 100 },
        code: { bsonType: "string", maxLength: 10 },
        description: { bsonType: "string" },
        zone_geographique: {
          bsonType: "object",
          properties: {
            type: { enum: ["Polygon"] },
            coordinates: { bsonType: "array" }
          }
        },
        actif: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.regions.createIndex({ "code": 1 }, { unique: true });
db.regions.createIndex({ "zone_geographique": "2dsphere" });

// ========================================
// 2. COLLECTION: addresses
// ========================================
db.createCollection("addresses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["rue", "ville", "region_id", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        num_appt: { bsonType: "string", maxLength: 10 },
        num_immeuble: { bsonType: "string", maxLength: 10 },
        rue: { bsonType: "string", maxLength: 255 },
        quartier: { bsonType: "string", maxLength: 100 },
        ville: { bsonType: "string", maxLength: 100 },
        code_postal: { bsonType: "string", maxLength: 10 },
        region_id: { bsonType: "objectId" },
        latitude: { bsonType: "decimal" },
        longitude: { bsonType: "decimal" },
        point_gps: {
          bsonType: "object",
          properties: {
            type: { enum: ["Point"] },
            coordinates: { bsonType: "array" }
          }
        },
        type_adresse: { enum: ["DOMICILE", "TRAVAIL", "DEPOT", "AUTRE"] },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.addresses.createIndex({ "region_id": 1 });
db.addresses.createIndex({ "point_gps": "2dsphere" });

// ========================================
// 3. COLLECTION: phone_numbers
// ========================================
db.createCollection("phone_numbers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numero", "type", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        numero: { bsonType: "string", maxLength: 20 },
        type: { enum: ["MOBILE", "FIXE", "FAX"] },
        actif: { bsonType: "bool" }
      }
    }
  }
});

// ========================================
// 4. COLLECTION: physical_users
// ========================================
db.createCollection("physical_users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["first_name", "last_name", "email", "civilite", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        first_name: { bsonType: "string", maxLength: 100 },
        last_name: { bsonType: "string", maxLength: 100 },
        email: { bsonType: "string", maxLength: 255 },
        password_hash: { bsonType: "string", maxLength: 255 },
        civilite: { enum: ["M", "Mme", "Mlle"] },
        date_naissance: { bsonType: "date" },
        addresses: [{
          address_id: { bsonType: "objectId" },
          is_principal: { bsonType: "bool" }
        }],
        phones: [{
          phone_id: { bsonType: "objectId" },
          is_principal: { bsonType: "bool" }
        }],
        actif: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.physical_users.createIndex({ "email": 1 }, { unique: true });

// ========================================
// 5. COLLECTION: moral_users
// ========================================
db.createCollection("moral_users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["raison_sociale", "email", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        raison_sociale: { bsonType: "string", maxLength: 255 },
        email: { bsonType: "string", maxLength: 255 },
        ice: { bsonType: "string", maxLength: 15 },
        patente: { bsonType: "string", maxLength: 50 },
        rc: { bsonType: "string", maxLength: 50 },
        ville_rc: { bsonType: "string", maxLength: 100 },
        forme_juridique: { bsonType: "string", maxLength: 100 },
        secteur_activite: { bsonType: "string", maxLength: 100 },
        addresses: [{
          address_id: { bsonType: "objectId" },
          is_principal: { bsonType: "bool" }
        }],
        phones: [{
          phone_id: { bsonType: "objectId" },
          is_principal: { bsonType: "bool" }
        }],
        actif: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
db.moral_users.createIndex({ "email": 1 }, { unique: true });
db.moral_users.createIndex({ "ice": 1 }, { unique: true, sparse: true });

// ========================================
// 6. COLLECTION: role_employes
// ========================================
db.createCollection("role_employes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        nom: { bsonType: "string", maxLength: 50 },
        description: { bsonType: "string" },
        permissions: { bsonType: "object" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.role_employes.createIndex({ "nom": 1 }, { unique: true });

// ========================================
// 7. COLLECTION: employes
// ========================================
db.createCollection("employes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["matricule", "cin", "physical_user_id", "role_employe_id", "date_embauche", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        matricule: { bsonType: "string", maxLength: 20 },
        cin: { bsonType: "string", maxLength: 20 },
        cnss: { bsonType: "string", maxLength: 20 },
        physical_user_id: { bsonType: "objectId" },
        role_employe_id: { bsonType: "objectId" },
        date_embauche: { bsonType: "date" },
        date_sortie: { bsonType: "date" },
        salaire_base: { bsonType: "decimal" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.employes.createIndex({ "matricule": 1 }, { unique: true });
db.employes.createIndex({ "cin": 1 }, { unique: true });
db.employes.createIndex({ "physical_user_id": 1 });
db.employes.createIndex({ "role_employe_id": 1 });

// ========================================
// 8. COLLECTION: customers
// ========================================
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customer_code", "type_client", "region_id"],
      properties: {
        _id: { bsonType: "objectId" },
        customer_code: { bsonType: "string", maxLength: 20 },
        type_client: { enum: ["PHYSIQUE", "MORAL"] },
        physical_user_id: { bsonType: "objectId" },
        moral_user_id: { bsonType: "objectId" },
        region_id: { bsonType: "objectId" },
        date_inscription: { bsonType: "date" },
        statut: { enum: ["ACTIF", "INACTIF", "SUSPENDU"] }
      }
    }
  }
});
db.customers.createIndex({ "customer_code": 1 }, { unique: true });
db.customers.createIndex({ "physical_user_id": 1 });
db.customers.createIndex({ "moral_user_id": 1 });
db.customers.createIndex({ "region_id": 1 });

// ========================================
// 9. COLLECTION: products
// ========================================
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["reference", "nom_court", "type_gaz", "capacite", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        reference: { bsonType: "string", maxLength: 50 },
        nom_court: { bsonType: "string", maxLength: 100 },
        nom_long: { bsonType: "string", maxLength: 255 },
        type_gaz: { enum: ["BUTANE", "PROPANE", "MIXTE"] },
        capacite: { bsonType: "decimal" },
        gamme: { bsonType: "string", maxLength: 100 },
        marque: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string" },
        image_url: { bsonType: "string", maxLength: 500 },
        poids_vide: { bsonType: "decimal" },
        poids_plein: { bsonType: "decimal" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.products.createIndex({ "reference": 1 }, { unique: true });

// ========================================
// 10. COLLECTION: unit_measures
// ========================================
db.createCollection("unit_measures", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "nom", "type", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        code: { bsonType: "string", maxLength: 10 },
        nom: { bsonType: "string", maxLength: 50 },
        symbole: { bsonType: "string", maxLength: 10 },
        type: { enum: ["POIDS", "VOLUME", "UNITE"] },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.unit_measures.createIndex({ "code": 1 }, { unique: true });

// ========================================
// 11. COLLECTION: statut_commandes
// ========================================
db.createCollection("statut_commandes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "nom", "ordre_affichage", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        code: { bsonType: "string", maxLength: 20 },
        nom: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string" },
        ordre_affichage: { bsonType: "int" },
        couleur: { bsonType: "string", maxLength: 7 },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.statut_commandes.createIndex({ "code": 1 }, { unique: true });

// ========================================
// 12. COLLECTION: commandes
// ========================================
db.createCollection("commandes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numero_commande", "customer_id", "address_livraison_id", "statut_id"],
      properties: {
        _id: { bsonType: "objectId" },
        numero_commande: { bsonType: "string", maxLength: 30 },
        customer_id: { bsonType: "objectId" },
        address_livraison_id: { bsonType: "objectId" },
        date_commande: { bsonType: "date" },
        date_souhaite: { bsonType: "date" },
        statut_id: { bsonType: "objectId" },
        total_ht: { bsonType: "decimal" },
        total_tva: { bsonType: "decimal" },
        total_ttc: { bsonType: "decimal" },
        mode_paiement: { enum: ["ESPECES", "CHEQUE", "VIREMENT", "CARTE"] },
        commentaires: { bsonType: "string" },
        urgent: { bsonType: "bool" },
        lines: [{
          product_id: { bsonType: "objectId" },
          um_id: { bsonType: "objectId" },
          quantite: { bsonType: "decimal" },
          prix_unitaire: { bsonType: "decimal" },
          total_ligne: { bsonType: "decimal" }
        }],
        status_history: [{
          ancien_statut_id: { bsonType: "objectId" },
          nouveau_statut_id: { bsonType: "objectId" },
          date_changement: { bsonType: "date" },
          employe_id: { bsonType: "objectId" },
          commentaire: { bsonType: "string" }
        }]
      }
    }
  }
});
db.commandes.createIndex({ "numero_commande": 1 }, { unique: true });
db.commandes.createIndex({ "customer_id": 1 });
db.commandes.createIndex({ "address_livraison_id": 1 });
db.commandes.createIndex({ "statut_id": 1 });
db.commandes.createIndex({ "date_commande": 1 });

// ========================================
// 13. COLLECTION: depots
// ========================================
db.createCollection("depots", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "nom", "address_id", "region_id", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        code: { bsonType: "string", maxLength: 20 },
        nom: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string" },
        surface_totale: { bsonType: "decimal" },
        capacite_max: { bsonType: "int" },
        address_id: { bsonType: "objectId" },
        region_id: { bsonType: "objectId" },
        responsable_id: { bsonType: "objectId" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.depots.createIndex({ "code": 1 }, { unique: true });
db.depots.createIndex({ "address_id": 1 });
db.depots.createIndex({ "region_id": 1 });
db.depots.createIndex({ "responsable_id": 1 });

// ========================================
// 14. COLLECTION: trucks
// ========================================
db.createCollection("trucks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["matricule", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        matricule: { bsonType: "string", maxLength: 20 },
        marque: { bsonType: "string", maxLength: 50 },
        modele: { bsonType: "string", maxLength: 50 },
        annee_construction: { bsonType: "int" },
        capacite_charge: { bsonType: "decimal" },
        capacite_volume: { bsonType: "decimal" },
        carburant: { enum: ["ESSENCE", "DIESEL", "ELECTRIQUE", "HYBRIDE"] },
        puissance_fiscale: { bsonType: "int" },
        gps_actif: { bsonType: "bool" },
        region_id: { bsonType: "objectId" },
        depot_attache_id: { bsonType: "objectId" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.trucks.createIndex({ "matricule": 1 }, { unique: true });
db.trucks.createIndex({ "region_id": 1 });
db.trucks.createIndex({ "depot_attache_id": 1 });

// ========================================
// 15. COLLECTION: stock_depots
// ========================================
db.createCollection("stock_depots", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["depot_id", "responsable_id"],
      properties: {
        _id: { bsonType: "objectId" },
        depot_id: { bsonType: "objectId" },
        date_inventaire: { bsonType: "date" },
        type_inventaire: { enum: ["INITIAL", "PERIODIQUE", "EXCEPTIONNEL"] },
        responsable_id: { bsonType: "objectId" },
        statut: { enum: ["EN_COURS", "VALIDE", "ARCHIVE"] },
        commentaires: { bsonType: "string" },
        lines: [{
          product_id: { bsonType: "objectId" },
          um_id: { bsonType: "objectId" },
          quantite_theorique: { bsonType: "decimal" },
          quantite_physique: { bsonType: "decimal" },
          quantite_disponible: { bsonType: "decimal" },
          quantite_reservee: { bsonType: "decimal" },
          seuil_alerte: { bsonType: "decimal" },
          prix_unitaire: { bsonType: "decimal" }
        }]
      }
    }
  }
});
db.stock_depots.createIndex({ "depot_id": 1 });
db.stock_depots.createIndex({ "responsable_id": 1 });
db.stock_depots.createIndex({ "lines.product_id": 1 });

// ========================================
// 16. COLLECTION: type_operations
// ========================================
db.createCollection("type_operations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "nom", "actif"],
      properties: {
        _id: { bsonType: "objectId" },
        code: { bsonType: "string", maxLength: 20 },
        nom: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string" },
        actif: { bsonType: "bool" }
      }
    }
  }
});
db.type_operations.createIndex({ "code": 1 }, { unique: true });

// ========================================
// COLLECTIONS SECONDAIRES
// ========================================
db.createCollection("administrateurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        _id: { bsonType: "objectId" },
        nom: { bsonType: "string", maxLength: 50 },
        prenom: { bsonType: "string", maxLength: 50 },
        email: { bsonType: "string", maxLength: 100 },
        motDePasse: { bsonType: "string", maxLength: 100 },
        telephone: { bsonType: "string", maxLength: 20 }
      }
    }
  }
});
db.administrateurs.createIndex({ "email": 1 }, { unique: true });
db.createCollection("fournisseurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        _id: { bsonType: "objectId" },
        nom: { bsonType: "string", maxLength: 100 },
        adresse: { bsonType: "string", maxLength: 255 },
        telephone: { bsonType: "string", maxLength: 20 },
        email: { bsonType: "string", maxLength: 100 }
      }
    }
  }
});
db.createCollection("bouteilles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type"],
      properties: {
        _id: { bsonType: "objectId" },
        type: { bsonType: "string", maxLength: 50 },
        couleur: { bsonType: "string", maxLength: 50 },
        poids: { bsonType: "double" },
        prixTTC: { bsonType: "double" }
      }
    }
  }
});
db.createCollection("bon_commande_fournisseurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        _id: { bsonType: "objectId" },
        fournisseur_id: { bsonType: "objectId" },
        employe_id: { bsonType: "objectId" },
        typeBouteille: { bsonType: "string", maxLength: 50 },
        quantite: { bsonType: "int" },
        prixUnitaire: { bsonType: "double" },
        imageBon: { bsonType: "string", maxLength: 255 },
        date: { bsonType: "date" }
      }
    }
  }
});
db.bon_commande_fournisseurs.createIndex({ "fournisseur_id": 1 });
db.bon_commande_fournisseurs.createIndex({ "employe_id": 1 });

// ========================================
// EXEMPLES D'INSERTION DE DONNÉES
// ========================================
db.regions.insertOne({
  nom: "Casablanca-Settat",
  code: "CS",
  description: "Région économique du Maroc",
  zone_geographique: {
    type: "Polygon",
    coordinates: [[
      [-8.0, 32.0],
      [-6.0, 32.0],
      [-6.0, 34.0],
      [-8.0, 34.0],
      [-8.0, 32.0]
    ]]
  },
  actif: true,
  created_at: new Date(),
  updated_at: new Date()
});
db.unit_measures.insertMany([
  {
    code: "KG",
    nom: "Kilogramme",
    symbole: "kg",
    type: "POIDS",
    actif: true
  },
  {
    code: "UNIT",
    nom: "Unité",
    symbole: "u",
    type: "UNITE",
    actif: true
  },
  {
    code: "L",
    nom: "Litre",
    symbole: "l",
    type: "VOLUME",
    actif: true
  }
]);
db.statut_commandes.insertMany([
  {
    code: "EN_ATTENTE",
    nom: "En attente",
    description: "Commande en attente de traitement",
    ordre_affichage: 1,
    couleur: "#FFA500",
    actif: true
  },
  {
    code: "CONFIRMEE",
    nom: "Confirmée",
    description: "Commande confirmée",
    ordre_affichage: 2,
    couleur: "#008000",
    actif: true
  },
  {
    code: "EN_LIVRAISON",
    nom: "En livraison",
    description: "Commande en cours de livraison",
    ordre_affichage: 3,
    couleur: "#0000FF",
    actif: true
  },
  {
    code: "LIVREE",
    nom: "Livrée",
    description: "Commande livrée",
    ordre_affichage: 4,
    couleur: "#32CD32",
    actif: true
  }
]);
db.products.insertOne({
  reference: "BUT13KG",
  nom_court: "Bouteille Butane 13kg",
  nom_long: "Bouteille de gaz butane 13 kilogrammes",
  type_gaz: "BUTANE",
  capacite: NumberDecimal("13.0"),
  gamme: "Standard",
  marque: "ChronoGaz",
  description: "Bouteille de gaz butane pour usage domestique",
  image_url: "https://example.com/bouteille-butane-13kg.jpg",
  poids_vide: NumberDecimal("4.5"),
  poids_plein: NumberDecimal("17.5"),
  actif: true
});

print("Conversion SQL vers MongoDB terminée avec succès!");
print("Base de données: chronogaz_db");
print("Collections créées avec validation et index appropriés.");
