import React, { useEffect, useState } from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { authService } from './services/authService';  
  
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
import TruckUnloading from './pages/chauffeur/TruckUnloading/TruckUnloading';  
import TruckLoading from './pages/chauffeur/TruckLoading/TruckLoading';  
import RouteHistory from './pages/chauffeur/RouteHistory/RouteHistory';  
import EndOfRoutePage from './pages/chauffeur/EndOfRoute/EndOfRoute';  
import SupplierVoucher from './pages/chauffeur/SupplierVoucher/SupplierVoucher';  
  
// Import depuis ghani-dev  
import Command from './pages/PagesClient/Command';  
import TrackOrder from './pages/PagesClient/TrackOrder';  
import OrderHistory from './pages/PagesClient/OrderHistory';  
import ServiceEvaluation from './pages/PagesClient/ServiceEvaluation';  
import Sidebar from './components/SideBar';  
  
import './App.css';  
  
function App() {  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    // Vérifier l'authentification au démarrage  
    const checkAuth = () => {  
      const authenticated = authService.isAuthenticated();  
      const userData = authService.getUser();  
        
      setIsAuthenticated(authenticated);  
      setUser(userData);  
      setLoading(false);  
    };  
  
    checkAuth();  
  }, []);  
  
  // Composant pour protéger les routes  
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {  
    if (!isAuthenticated) {  
      window.location.href = '/login';  
      return null;  
    }  
  
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {  
      return <div>Accès non autorisé pour votre rôle</div>;  
    }  
  
    return children;  
  };  
  
  if (loading) {  
    return <div>Chargement de l'application...</div>;  
  }  
  
  return (  
    <Router>  
      <div className="App" style={{ display: 'flex' }}>  
        {/* Afficher la sidebar seulement si connecté */}  
        {isAuthenticated && <Sidebar />}  
          
        <div style={{ flex: 1, padding: isAuthenticated ? '80px' : '0' }}>  
          <Routes>  
            {/* Routes publiques */}  
            <Route path="/login" element={<LoginPage />} />  
            <Route path="/signup" element={<SignupPage />} />  
              
            {/* Routes protégées pour admin */}  
            <Route   
              path="/dashboard"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <Dashboard />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gestioncamion"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <GestionCamion />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/infoCamion"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <InfoCamion />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gestionclient"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <GestionClient />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gestion-chauffeur"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <GestionChauffeur />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gestionregion"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <GestionRegion />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gestionbon"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <GestionBon />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/ajouter-produit"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <AjouterProduit />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/suivicommande"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <SuiviCommande />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/gerer-commande"   
              element={  
                <ProtectedRoute allowedRoles={['ADMIN']}>  
                  <OrderManagement />  
                </ProtectedRoute>  
              }   
            />  
  
            {/* Routes protégées pour employés/chauffeurs */}  
            <Route   
              path="/chauffeur/dailyroutepage"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <DailyRoutePage />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/next-order"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <NextOrderMap />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/chargement"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <TruckLoading />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/dechargement"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <TruckUnloading />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/historique"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <RouteHistory />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/end-route"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <EndOfRoutePage />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/chauffeur/supplier-voucher"   
              element={  
                <ProtectedRoute allowedRoles={['EMPLOYE']}>  
                  <SupplierVoucher />  
                </ProtectedRoute>  
              }   
            />  
  
            {/* Routes protégées pour clients */}  
            <Route   
              path="/Command"   
              element={  
                <ProtectedRoute allowedRoles={['CLIENT']}>  
                  <Command />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/Trackorder"   
              element={  
                <ProtectedRoute allowedRoles={['CLIENT']}>  
                  <TrackOrder />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/Orderhistory"   
              element={  
                <ProtectedRoute allowedRoles={['CLIENT']}>  
                  <OrderHistory />  
                </ProtectedRoute>  
              }   
            />  
            <Route   
              path="/Serviceevaluation"   
              element={  
                <ProtectedRoute allowedRoles={['CLIENT']}>  
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