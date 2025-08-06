import React, { useEffect, useState } from 'react';        
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';        
import { authService } from './services/authService';        
import { hasAccessToRoute } from './utils/redirectUtils'; // AJOUTÉ: Import de hasAccessToRoute  
        
// Import depuis main        
import Home from './components/Home';        
import Dashboard from './pages/admin/Dashboard/Dashboard';        
import GestionCamion from './pages/admin/gestionCamion/gestionCamion';        
import InfoCamion from './pages/admin/infoCamion/infoCamion';        
import GestionClient from './pages/admin/gestionClient/gestionClient';        
import GestionChauffeur from './pages/admin/GestionChauffeur/GestionChauffeur';        
import GestionRegion from './pages/admin/gestionRegion/gestionRegion';        
import GestionBon from './pages/admin/gestionBon/gestionBon';        
import AjouterProduit from './pages/admin/AjouterProduit/AjouterProduit';        
import SuiviCommande from './pages/admin/suiviCommande/suiviCommande';        
import OrderManagement from './pages/admin/OrderManagement/OrderManagement';        
import LoginPage from './pages/Login/login';        
import SignupPage from './pages/Signup/signup';        
import DailyRoutePage from './pages/chauffeur/DailyRoutePage/DailyRoutePage';        
import NextOrderMap from './pages/chauffeur/NextOrderMap/NextOrderMap';        
import TruckUnloading from './pages/magasinier/TruckUnloading/TruckUnloading';        
import TruckLoading from './pages/magasinier/TruckLoading/TruckLoading';        
import RouteHistory from './pages/chauffeur/RouteHistory/RouteHistory';        
import EndOfRoutePage from './pages/chauffeur/EndOfRoute/EndOfRoute';        
import SupplierVoucher from './pages/chauffeur/SupplierVoucher/SupplierVoucher';        
import StockManagement from './pages/magasinier/StockManagement/StockManagement';        
        
// Import depuis ghani-dev        
import Command from './pages/PagesClient/Command';        
import TrackOrder from './pages/PagesClient/TrackOrder';        
import OrderHistory from './pages/PagesClient/OrderHistory';        
import ServiceEvaluation from './pages/PagesClient/ServiceEvaluation';        
    
// AJOUTÉ: Import des pages entreprise    
import EntrepriseGestionClient from './pages/entreprise/gestionClient/gestionClient';    
import EntrepriseSuiviCommande from './pages/entreprise/suiviCommande/suiviCommande';    
    
import SidebarWrapper from './components/SidebarWrapper';         
        
import './App.css';        
        
function App() {        
  const [isAuthenticated, setIsAuthenticated] = useState(false);        
  const [user, setUser] = useState(null);        
  const [loading, setLoading] = useState(true);        
        
  useEffect(() => {        
    // Vérifier l'authentification au démarrage avec gestion d'erreur      
    const checkAuth = () => {        
      try {      
        const authenticated = authService.isAuthenticated();        
        const userData = authService.getUser();        
                
        setIsAuthenticated(authenticated);        
        setUser(userData);        
      } catch (error) {      
        console.error('Erreur lors de la vérification auth:', error);      
        setIsAuthenticated(false);      
        setUser(null);      
      } finally {      
        setLoading(false);        
      }      
    };        
        
    checkAuth();        
  }, []);        
      
  // Vérification périodique du token expiré      
  useEffect(() => {      
    if (isAuthenticated) {      
      const interval = setInterval(() => {      
        if (authService.isTokenExpired && authService.isTokenExpired()) {      
          authService.logout();      
          setIsAuthenticated(false);      
          setUser(null);      
        }      
      }, 60000); // Vérifier chaque minute      
            
      return () => clearInterval(interval);      
    }      
  }, [isAuthenticated]);      
        
  // CORRIGÉ: Composant pour protéger les routes avec hasAccessToRoute  
  const ProtectedRoute = ({ children }) => {        
    if (!isAuthenticated) {        
      window.location.href = '/login';        
      return null;        
    }        
        
    // CORRIGÉ: Utiliser hasAccessToRoute au lieu de la vérification simple des rôles  
    const currentPath = window.location.pathname;  
    if (!hasAccessToRoute(user?.role, currentPath, user?.type)) {  
      return (      
        <div style={{ padding: '20px', textAlign: 'center' }}>      
          <h2>Accès non autorisé</h2>      
          <p>Votre rôle ({user?.role}) et type ({user?.type}) ne permettent pas d'accéder à cette page.</p>      
          <button onClick={() => window.location.href = '/'}>      
            Retour à l'accueil      
          </button>      
        </div>      
      );      
    }        
        
    return children;        
  };        
        
  if (loading) {        
    return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement de l'application...</div>;        
  }        
        
  return (        
    <Router>        
      <div className="App" style={{ display: 'flex' }}>        
        {/* Afficher la sidebar seulement si connecté */}        
        {isAuthenticated && <SidebarWrapper />}        
                
        <div style={{ flex: 1, padding: isAuthenticated ? '0px' : '0' }}>        
          <Routes>        
            {/* Routes publiques */}        
            <Route path="/login" element={<LoginPage />} />        
            <Route path="/signup" element={<SignupPage />} />        
                    
            {/* Routes protégées pour admin */}        
            <Route         
              path="/dashboard"         
              element={        
                <ProtectedRoute>        
                  <Dashboard />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gestioncamion"         
              element={        
                <ProtectedRoute>        
                  <GestionCamion />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/infoCamion"         
              element={        
                <ProtectedRoute>        
                  <InfoCamion />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gestionclient"         
              element={        
                <ProtectedRoute>        
                  <GestionClient />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gestion-chauffeur"         
              element={        
                <ProtectedRoute>        
                  <GestionChauffeur />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gestionregion"         
              element={        
                <ProtectedRoute>        
                  <GestionRegion />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gestionbon"         
              element={        
                <ProtectedRoute>        
                  <GestionBon />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/ajouter-produit"         
              element={        
                <ProtectedRoute>        
                  <AjouterProduit />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/suivicommande"         
              element={        
                <ProtectedRoute>        
                  <SuiviCommande />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/gerer-commande"         
              element={        
                <ProtectedRoute>        
                  <OrderManagement />        
                </ProtectedRoute>        
              }         
            />        
        
            {/* Routes protégées pour employés/chauffeurs */}        
            <Route         
              path="/chauffeur/dailyroutepage"         
              element={        
                <ProtectedRoute>        
                  <DailyRoutePage />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/chauffeur/next-order"         
              element={        
                <ProtectedRoute>        
                  <NextOrderMap />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/chauffeur/historique"         
              element={        
                <ProtectedRoute>        
                  <RouteHistory />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/chauffeur/end-route"         
              element={        
                <ProtectedRoute>        
                  <EndOfRoutePage />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/chauffeur/supplier-voucher"         
              element={        
                <ProtectedRoute>        
                  <SupplierVoucher />        
                </ProtectedRoute>        
              }         
            />        
      
            {/* Routes protégées pour employés magasin */}        
            <Route         
              path="/magasin/gestion-stock"         
              element={        
                <ProtectedRoute>        
                  <StockManagement />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/magasin/chargement"         
              element={        
                <ProtectedRoute>        
                  <TruckLoading />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/magasin/dechargement"         
              element={        
                <ProtectedRoute>        
                  <TruckUnloading />        
                </ProtectedRoute>        
              }         
            />        
        
            {/* Routes protégées pour entreprises */}    
            <Route         
              path="/entreprise/gestion-clients"         
              element={        
                <ProtectedRoute>        
                  <EntrepriseGestionClient />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/entreprise/suivi-commandes"         
              element={        
                <ProtectedRoute>        
                  <EntrepriseSuiviCommande />        
                </ProtectedRoute>        
              }         
            />        
    
            {/* Routes protégées pour clients particuliers */}        
            <Route         
              path="/Command"         
              element={        
                <ProtectedRoute>        
                  <Command />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/Trackorder"         
              element={        
                <ProtectedRoute>        
                  <TrackOrder />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/Orderhistory"         
              element={        
                <ProtectedRoute>        
                  <OrderHistory />        
                </ProtectedRoute>        
              }         
            />        
            <Route         
              path="/Serviceevaluation"         
              element={        
                <ProtectedRoute>        
                  <ServiceEvaluation />        
                </ProtectedRoute>        
              }         
            />        
                    
            {/* Redirection par défaut */}        
            <Route         
              path="/"         
              element={isAuthenticated ? <Home /> : <LoginPage />}         
            />        
          </Routes>        
        </div>        
      </div>        
    </Router>        
  );        
}        
        
export default App;