// Script pour insérer des commandes de test dans ChronoGaz MongoDB
print('📦 Insertion de commandes de test...');

db = db.getSiblingDB('chronogaz_db');

// Récupérer les IDs nécessaires
const customer = db.customers.findOne({customer_code: 'CLI-P000001'});
const addressLivraison = db.addresses.findOne({ville: 'Casablanca'});
const statutNouvelle = db.statutcommandes.findOne({code: 'NOUVELLE'});
const statutConfirmee = db.statutcommandes.findOne({code: 'CONFIRMEE'});
const statutPlanifiee = db.statutcommandes.findOne({code: 'PLANIFIEE'});
const statutEnCours = db.statutcommandes.findOne({code: 'EN_COURS'});
const statutLivree = db.statutcommandes.findOne({code: 'LIVREE'});

const productButane13 = db.products.findOne({reference: 'BUT-13KG'});
const productButane6 = db.products.findOne({reference: 'BUT-6KG'});
const productPropane13 = db.products.findOne({reference: 'PROP-13KG'});

const umUnite = db.ums.findOne({code: 'UNITE'});
const truck = db.trucks.findOne({matricule: 'CAM001'});
const chauffeur = db.employes.findOne({matricule: 'EMP001'});

// Créer quelques adresses de livraison supplémentaires
const addressRabat = db.addresses.insertOne({
  rue: '45 Avenue Hassan II',
  ville: 'Rabat',
  code_postal: '10000',
  quartier: 'Centre-ville',
  region_id: db.regions.findOne({code: 'RABAT'})._id,
  type_adresse: 'LIVRAISON',
  actif: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const addressSale = db.addresses.insertOne({
  rue: '78 Rue Ibn Sina',
  ville: 'Salé',
  code_postal: '11000',
  quartier: 'Hay Salam',
  region_id: db.regions.findOne({code: 'RABAT'})._id,
  type_adresse: 'LIVRAISON',
  actif: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Créer quelques clients supplémentaires
const userClient2 = db.users.insertOne({
  email: 'client2@example.ma',
  password_hash: '$2b$10$example_hash_client2',
  role_id: db.roles.findOne({code: 'CLIENT'})._id,
  statut: 'ACTIF',
  last_login: null,
  email_verified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const physicalClient2 = db.physicalusers.insertOne({
  user_id: userClient2.insertedId,
  first_name: 'Fatima',
  last_name: 'Alaoui',
  civilite: 'Mme',
  cin: 'EF456789',
  telephone_principal: '0698123456',
  actif: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const customer2 = db.customers.insertOne({
  customer_code: 'CLI-P000002',
  type_client: 'PHYSIQUE',
  physical_user_id: physicalClient2.insertedId,
  moral_user_id: null,
  statut: 'ACTIF',
  credit_limite: 3000.00,
  credit_utilise: 0.00,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Créer un client moral
const userClientMoral = db.users.insertOne({
  email: 'restaurant@tajine.ma',
  password_hash: '$2b$10$example_hash_moral',
  role_id: db.roles.findOne({code: 'CLIENT'})._id,
  statut: 'ACTIF',
  last_login: null,
  email_verified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const moralClient = db.moralusers.insertOne({
  user_id: userClientMoral.insertedId,
  raison_sociale: 'Restaurant Le Tajine SARL',
  numero_rc: 'RC123456',
  forme_juridique: 'SARL',
  secteur_activite: 'Restauration',
  actif: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const customerMoral = db.customers.insertOne({
  customer_code: 'CLI-M000001',
  type_client: 'MORAL',
  physical_user_id: null,
  moral_user_id: moralClient.insertedId,
  statut: 'ACTIF',
  credit_limite: 10000.00,
  credit_utilise: 0.00,
  createdAt: new Date(),
  updatedAt: new Date()
});

// ===== INSÉRER LES COMMANDES DE TEST =====

// Commande 1 - Nouvelle commande
const commande1 = db.commandes.insertOne({
  numero_commande: 'CMD-2025-000001',
  customer_id: customer._id,
  address_livraison_id: addressLivraison._id,
  date_commande: new Date(),
  date_souhaite: new Date(Date.now() + 24*60*60*1000), // Demain
  statut_id: statutNouvelle._id,
  total_ht: 156.00,
  total_tva: 31.20,
  total_ttc: 187.20,
  mode_paiement: 'ESPECES',
  commentaires: 'Livraison urgente demandée par le client',
  urgent: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Lignes de commande pour commande 1
db.commandelines.insertMany([
  {
    commande_id: commande1.insertedId,
    product_id: productButane13._id,
    um_id: umUnite._id,
    quantite: 2,
    prix_unitaire: 65.00,
    total_ligne: 130.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    commande_id: commande1.insertedId,
    product_id: productButane6._id,
    um_id: umUnite._id,
    quantite: 1,
    prix_unitaire: 26.00,
    total_ligne: 26.00,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Commande 2 - Commande confirmée
const commande2 = db.commandes.insertOne({
  numero_commande: 'CMD-2025-000002',
  customer_id: customer2.insertedId,
  address_livraison_id: addressRabat.insertedId,
  date_commande: new Date(Date.now() - 2*24*60*60*1000), // Avant-hier
  date_souhaite: new Date(Date.now() + 1*24*60*60*1000), // Demain
  statut_id: statutConfirmee._id,
  total_ht: 195.00,
  total_tva: 39.00,
  total_ttc: 234.00,
  mode_paiement: 'CARTE',
  commentaires: 'Première commande de ce client',
  urgent: false,
  createdAt: new Date(Date.now() - 2*24*60*60*1000),
  updatedAt: new Date()
});

// Lignes de commande pour commande 2
db.commandelines.insertMany([
  {
    commande_id: commande2.insertedId,
    product_id: productButane13._id,
    um_id: umUnite._id,
    quantite: 3,
    prix_unitaire: 65.00,
    total_ligne: 195.00,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Commande 3 - Commande planifiée
const commande3 = db.commandes.insertOne({
  numero_commande: 'CMD-2025-000003',
  customer_id: customerMoral.insertedId,
  address_livraison_id: addressSale.insertedId,
  date_commande: new Date(Date.now() - 3*24*60*60*1000), // Il y a 3 jours
  date_souhaite: new Date(Date.now() + 2*24*60*60*1000), // Après-demain
  statut_id: statutPlanifiee._id,
  total_ht: 520.00,
  total_tva: 104.00,
  total_ttc: 624.00,
  mode_paiement: 'VIREMENT',
  commentaires: 'Commande pour restaurant - livraison arrière du bâtiment',
  urgent: false,
  createdAt: new Date(Date.now() - 3*24*60*60*1000),
  updatedAt: new Date()
});

// Lignes de commande pour commande 3
db.commandelines.insertMany([
  {
    commande_id: commande3.insertedId,
    product_id: productButane13._id,
    um_id: umUnite._id,
    quantite: 4,
    prix_unitaire: 65.00,
    total_ligne: 260.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    commande_id: commande3.insertedId,
    product_id: productPropane13._id,
    um_id: umUnite._id,
    quantite: 4,
    prix_unitaire: 65.00,
    total_ligne: 260.00,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Planification pour commande 3
db.planifications.insertOne({
  commande_id: commande3.insertedId,
  truck_id: truck._id,
  livreur_id: chauffeur._id,
  accompagnateur_id: null,
  date_planifiee: new Date(Date.now() + 2*24*60*60*1000), // Après-demain
  date_debut_reel: null,
  date_fin_reel: null,
  statut: 'PLANIFIE',
  ordre_livraison: 1,
  commentaires: 'Première livraison de la journée',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Commande 4 - En cours de livraison
const commande4 = db.commandes.insertOne({
  numero_commande: 'CMD-2025-000004',
  customer_id: customer._id,
  address_livraison_id: addressLivraison._id,
  date_commande: new Date(Date.now() - 1*24*60*60*1000), // Hier
  date_souhaite: new Date(), // Aujourd'hui
  statut_id: statutEnCours._id,
  total_ht: 78.00,
  total_tva: 15.60,
  total_ttc: 93.60,
  mode_paiement: 'ESPECES',
  commentaires: 'Livraison en cours',
  urgent: false,
  createdAt: new Date(Date.now() - 1*24*60*60*1000),
  updatedAt: new Date()
});

// Lignes de commande pour commande 4
db.commandelines.insertOne({
  commande_id: commande4.insertedId,
  product_id: productButane6._id,
  um_id: umUnite._id,
  quantite: 3,
  prix_unitaire: 26.00,
  total_ligne: 78.00,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Planification pour commande 4 (en cours)
db.planifications.insertOne({
  commande_id: commande4.insertedId,
  truck_id: truck._id,
  livreur_id: chauffeur._id,
  accompagnateur_id: null,
  date_planifiee: new Date(),
  date_debut_reel: new Date(Date.now() - 2*60*60*1000), // Il y a 2h
  date_fin_reel: null,
  statut: 'EN_COURS',
  ordre_livraison: 2,
  commentaires: 'Livraison démarrée à 08h00',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Commande 5 - Livrée
const commande5 = db.commandes.insertOne({
  numero_commande: 'CMD-2025-000005',
  customer_id: customer2.insertedId,
  address_livraison_id: addressRabat.insertedId,
  date_commande: new Date(Date.now() - 5*24*60*60*1000), // Il y a 5 jours
  date_souhaite: new Date(Date.now() - 2*24*60*60*1000), // Il y a 2 jours
  statut_id: statutLivree._id,
  total_ht: 130.00,
  total_tva: 26.00,
  total_ttc: 156.00,
  mode_paiement: 'CHEQUE',
  commentaires: 'Livraison effectuée avec succès',
  urgent: false,
  createdAt: new Date(Date.now() - 5*24*60*60*1000),
  updatedAt: new Date(Date.now() - 2*24*60*60*1000)
});

// Lignes de commande pour commande 5
db.commandelines.insertOne({
  commande_id: commande5.insertedId,
  product_id: productButane13._id,
  um_id: umUnite._id,
  quantite: 2,
  prix_unitaire: 65.00,
  total_ligne: 130.00,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Planification pour commande 5 (livrée)
db.planifications.insertOne({
  commande_id: commande5.insertedId,
  truck_id: truck._id,
  livreur_id: chauffeur._id,
  accompagnateur_id: null,
  date_planifiee: new Date(Date.now() - 2*24*60*60*1000),
  date_debut_reel: new Date(Date.now() - 2*24*60*60*1000 + 8*60*60*1000), // 08h00
  date_fin_reel: new Date(Date.now() - 2*24*60*60*1000 + 10*60*60*1000), // 10h00
  statut: 'LIVRE',
  ordre_livraison: 1,
  commentaires: 'Livraison terminée à 10h00, client satisfait',
  createdAt: new Date(),
  updatedAt: new Date()
});

// ===== CRÉER LES INDEX POUR LES NOUVELLES COLLECTIONS =====

// Index CommandeLines
db.commandelines.createIndex({ commande_id: 1 });
db.commandelines.createIndex({ product_id: 1 });

// Index Commandes
db.commandes.createIndex({ numero_commande: 1 }, { unique: true });
db.commandes.createIndex({ customer_id: 1 });
db.commandes.createIndex({ statut_id: 1 });
db.commandes.createIndex({ date_commande: -1 });
db.commandes.createIndex({ urgent: 1 });

// Index Planifications
db.planifications.createIndex({ commande_id: 1 });
db.planifications.createIndex({ truck_id: 1 });
db.planifications.createIndex({ date_planifiee: 1 });
db.planifications.createIndex({ statut: 1 });

// Index Addresses
db.addresses.createIndex({ ville: 1 });
db.addresses.createIndex({ region_id: 1 });
db.addresses.createIndex({ type_adresse: 1 });

print('✅ Commandes de test insérées avec succès!');
print('📊 5 commandes créées avec différents statuts:');
print('   - CMD-2025-000001: NOUVELLE (urgente)');
print('   - CMD-2025-000002: CONFIRMEE');
print('   - CMD-2025-000003: PLANIFIEE (avec planification)');
print('   - CMD-2025-000004: EN_COURS (livraison en cours)');
print('   - CMD-2025-000005: LIVREE (terminée)');
print('👥 3 clients créés (2 physiques + 1 moral)');
print('📍 3 adresses de livraison créées');
print('🔍 Index créés pour optimiser les performances');