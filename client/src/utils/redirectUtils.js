/**    
 * Redirige l'utilisateur vers la page appropriée selon son rôle    
 * @param {string} role - Le rôle de l'utilisateur (ADMIN, CLIENT, EMPLOYE, EMPLOYE_MAGASIN)    
 */    
export const redirectUserByRole = (role) => {    
  switch (role) {    
    case 'ADMIN':    
      window.location.href = '/dashboard';    
      break;    
    case 'CLIENT':    
      window.location.href = '/Command';    
      break;    
    case 'EMPLOYE':    
      window.location.href = '/chauffeur/dailyroutepage';    
      break;    
    case 'EMPLOYE_MAGASIN':    
      window.location.href = '/magasin/gestion-stock';    
      break;    
    default:    
      window.location.href = '/';    
  }    
};    
  
/**    
 * Redirige vers la page de connexion    
 */    
export const redirectToLogin = () => {    
  window.location.href = '/login';    
};    
  
/**    
 * Redirige vers la page d'inscription    
 */    
export const redirectToSignup = () => {    
  window.location.href = '/signup';    
};    
  
/**    
 * Redirige vers la page d'accueil    
 */    
export const redirectToHome = () => {    
  window.location.href = '/';    
};    
  
/**    
 * Redirige vers une page spécifique avec gestion d'erreur    
 * @param {string} path - Le chemin vers lequel rediriger    
 */    
export const redirectTo = (path) => {    
  try {    
    window.location.href = path;    
  } catch (error) {    
    console.error('Erreur lors de la redirection:', error);    
    // Fallback vers la page d'accueil    
    window.location.href = '/';    
  }    
};    
  
/**    
 * Obtient la page d'accueil par défaut selon le rôle    
 * @param {string} role - Le rôle de l'utilisateur    
 * @returns {string} - Le chemin de la page d'accueil    
 */    
export const getDefaultPageByRole = (role) => {    
  switch (role) {    
    case 'ADMIN':    
      return '/dashboard';    
    case 'CLIENT':    
      return '/Command';    
    case 'EMPLOYE':    
      return '/chauffeur/dailyroutepage';    
    case 'EMPLOYE_MAGASIN':    
      return '/magasin/gestion-stock';    
    default:    
      return '/';    
  }    
};    
  
/**    
 * Vérifie si l'utilisateur a accès à une route spécifique    
 * @param {string} role - Le rôle de l'utilisateur    
 * @param {string} path - Le chemin à vérifier    
 * @returns {boolean} - True si l'utilisateur a accès    
 */    
export const hasAccessToRoute = (role, path) => {    
  const adminRoutes = [    
    '/dashboard', '/gestioncamion', '/infoCamion', '/gestionclient',    
    '/gestion-chauffeur', '/gestionregion', '/gestionbon',     
    '/ajouter-produit', '/suivicommande', '/gerer-commande'    
  ];    
      
  const clientRoutes = [    
    '/Command', '/Trackorder', '/Orderhistory', '/Serviceevaluation'    
  ];    
      
  const employeRoutes = [    
    '/chauffeur/dailyroutepage', '/chauffeur/next-order',     
    '/chauffeur/historique', '/chauffeur/end-route',     
    '/chauffeur/supplier-voucher'    
  ];    
  
  const magasinRoutes = [    
    '/magasin/gestion-stock', '/magasin/chargement', '/magasin/dechargement'    
  ];    
  
  switch (role) {    
    case 'ADMIN':    
      return adminRoutes.some(route => path.startsWith(route));    
    case 'CLIENT':    
      return clientRoutes.some(route => path.startsWith(route));    
    case 'EMPLOYE':    
      return employeRoutes.some(route => path.startsWith(route));    
    case 'EMPLOYE_MAGASIN':    
      return magasinRoutes.some(route => path.startsWith(route));    
    default:    
      return false;    
  }    
};