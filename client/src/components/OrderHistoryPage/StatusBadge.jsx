import { Package, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';


const StatusBadge = ({ status }) => {
    const getStatusInfo = (status) => {
      switch(status) {
        case 'livree':
          return { 
            text: 'Livrée', 
            icon: CheckCircle, 
            color: '#10B981', 
            bgColor: '#D1FAE5',
            textColor: '#065F46'
          };
        case 'en_cours':
          return { 
            text: 'En cours', 
            icon: Clock, 
            color: '#F59E0B', 
            bgColor: '#FEF3C7',
            textColor: '#92400E'
          };
        case 'en_route':
          return { 
            text: 'En route', 
            icon: Truck, 
            color: '#4DAEBD', 
            bgColor: '#E0F2FE',
            textColor: '#0C4A6E'
          };
        case 'annulee':
          return { 
            text: 'Annulée', 
            icon: XCircle, 
            color: '#EF4444', 
            bgColor: '#FEE2E2',
            textColor: '#991B1B'
          };
        default:
          return { 
            text: 'Inconnu', 
            icon: Package, 
            color: '#6B7280', 
            bgColor: '#F3F4F6',
            textColor: '#374151'
          };
      }
    };
  
    const statusInfo = getStatusInfo(status);
    const StatusIcon = statusInfo.icon;
  
    return (
      <div 
        className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: statusInfo.bgColor,
          color: statusInfo.textColor
        }}
      >
        <StatusIcon size={16} />
        <span>{statusInfo.text}</span>
      </div>
    );
  };
export default StatusBadge;  