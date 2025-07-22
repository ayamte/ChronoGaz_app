import React from 'react';    
import { Link } from 'react-router-dom';    
import Sidebar from './admin/Sidebar/Sidebar'; 
import './Home.css';
    
const Home = () => {    
  return (    
    <div className="home-container">  
      <Sidebar />
    </div>  
  );    
};

export default Home;