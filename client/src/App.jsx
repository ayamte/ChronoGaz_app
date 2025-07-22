import React from 'react';      
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';      
import Home from './components/Home';    
import Dashboard from './pages/admin/Dashboard/Dashboard';   
import GestionCamion from './pages/admin/gestionCamion/gestionCamion';
import InfoCamion from './pages/admin/infoCamion/infoCamion';  
import GestionClient from './pages/admin/gestionClient/gestionClient';
import GestionRegion from './pages/admin/gestionRegion/gestionRegion';
import GestionBon from './pages/admin/gestionBon/gestionBon';
import SuiviCommande from './pages/admin/suiviCommande/suiviCommande';
import { LoginForm } from './pages/Login/login'
import { SignupForm } from './pages/Signup/signup'
import './App.css';      
      
function App() {      
  return (      
    <Router>      
      <div className="App">    
        <Routes>    
          <Route path="/" element={<Home />} />    
          <Route path="/dashboard" element={<Dashboard />} />   
          <Route path="/gestioncamion" element={<GestionCamion />} /> 
          <Route path="/infoCamion" element={<InfoCamion />} />
          <Route path="/gestionclient" element={<GestionClient />} /> 
          <Route path="/gestionregion" element={<GestionRegion />} /> 
          <Route path="/gestionbon" element={<GestionBon />} /> 
          <Route path="/suivicommande" element={<SuiviCommande />} /> 
          <Route path="/login" element={<LoginForm />} /> 
          <Route path="/signup" element={<SignupForm />} /> 
          {/*<Route path="/info-Camion/:id" element={<InfoCamion />} />*/}
        </Routes>      
      </div>      
    </Router>      
  );      
}      
      
export default App;