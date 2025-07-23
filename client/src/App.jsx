import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from './components/Home';  
import Command from './components/Pages/Command';
import TrackOrder from './components/Pages/TrackOrder';
import OrderHistory from './components/Pages/OrderHistory';

import './App.css'; 
  
function App() {  
  return (  
    <Router>  
      <div className="App">  
        <Routes>  
          <Route path="/Command" element={<Command />} /> 
          <Route path="/TrackOrder" element={<TrackOrder />} /> 
          <Route path="/OrderHistory" element={<OrderHistory />} /> 
        </Routes>  
      </div>  
    </Router>  
  );  
}  
  
export default App;