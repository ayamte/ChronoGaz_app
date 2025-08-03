import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  

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
import { LoginForm } from './pages/Login/login';
import { SignupForm } from './pages/Signup/signup';
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

import './App.css'; 
  
function App() {  
  return (  
    <Router>  
          <Routes>  
            {/* Routes main */}
            <Route path="/" element={<Home />} />    
            <Route path="/dashboard" element={<Dashboard />} />   
            <Route path="/gestioncamion" element={<GestionCamion />} /> 
            <Route path="/infoCamion" element={<InfoCamion />} />
            <Route path="/gestionclient" element={<GestionClient />} /> 
            <Route path="/gestion-chauffeur" element={<GestionChauffeur />} /> 
            <Route path="/gestionregion" element={<GestionRegion />} /> 
            <Route path="/gestionbon" element={<GestionBon />} /> 
            <Route path="/ajouter-produit" element={<AjouterProduit />} /> 
            <Route path="/suivicommande" element={<SuiviCommande />} /> 
            <Route path="/gerer-commande" element={<OrderManagement />} />
            <Route path="/login" element={<LoginForm />} /> 
            <Route path="/signup" element={<SignupForm />} /> 
            <Route path="/chauffeur/dailyroutepage" element={<DailyRoutePage />} />
            <Route path="/chauffeur/next-order" element={<NextOrderMap />} />
            <Route path="/chauffeur/chargement" element={<TruckLoading  />} /> 
            <Route path="/chauffeur/dechargement" element={<TruckUnloading  />} /> 
            <Route path="/chauffeur/historique" element={<RouteHistory  />} /> 
            <Route path="/chauffeur/end-route" element={<EndOfRoutePage />} />
            <Route path="/chauffeur/supplier-voucher" element={<SupplierVoucher />} />

            {/* Routes client */}
            <Route path="/Command" element={<Command />} /> 
            <Route path="/Trackorder" element={<TrackOrder />} /> 
            <Route path="/Orderhistory" element={<OrderHistory />} /> 
            <Route path="/Serviceevaluation" element={<ServiceEvaluation />} /> 
          </Routes>   
    </Router>  
  );  
}  
  
export default App;
