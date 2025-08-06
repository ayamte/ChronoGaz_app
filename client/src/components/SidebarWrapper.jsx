import React from 'react';    
import { authService } from '../services/authService';    
    
// Import des différentes sidebars    
import ClientSidebar from './client/SideBar'; // Sidebar client particulier  
import DriverSidebar from './chauffeur/DriverSidebar/DriverSidebar'; // Sidebar chauffeur    
import AdminSidebar from './admin/Sidebar/Sidebar'; // Sidebar admin  
import EntrepriseSidebar from './entreprise/Sidebar/EntrepriseSidebar'; // AJOUTÉ: Sidebar entreprise  
    
const SidebarWrapper = () => {    
  const user = authService.getUser();    
      
  if (!user) return null;    
  
  switch (user.role) {    
    case 'CLIENT':  
      // MODIFIÉ: Différencier entre entreprise (MORAL) et particulier (PHYSIQUE)  
      if (user.type === 'MORAL') {  
        return <EntrepriseSidebar userName={user.raison_sociale || 'Entreprise'} />;  
      }  
      // Client particulier  
      return <ClientSidebar userName={user.first_name || user.raison_sociale || 'Client'} />;  
    case 'EMPLOYE':    
      return <DriverSidebar userName={user.first_name || 'Chauffeur'} />;  
    case 'ADMIN':    
      return <AdminSidebar userName={user.first_name || 'Admin'} />;    
    default:    
      return null;    
  }    
};    
    
export default SidebarWrapper;