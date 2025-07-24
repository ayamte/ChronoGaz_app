import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from './components/Home';  
import Command from './components/Pages/Command';
import TrackOrder from './components/Pages/TrackOrder';
import OrderHistory from './components/Pages/OrderHistory';
import ServiceEvaluation from './components/Pages/ServiceEvaluation';
import Sidebar from './components/SideBar';

import './App.css'; 
  
function App() {  
  return (  
    <Router>  
      <div className="App" style={{ display: 'flex' }}> 
      <Sidebar />
      <div style={{ flex: 1, padding: '80px' }}>
        <Routes>  
          <Route path="/Command" element={<Command />} /> 
          <Route path="/Trackorder" element={<TrackOrder />} /> 
          <Route path="/Orderhistory" element={<OrderHistory />} /> 
          <Route path="/Serviceevaluation" element={<ServiceEvaluation />} /> 

        </Routes>  
        </div>
      </div>  
    </Router>  
  );  
}  
  
export default App;