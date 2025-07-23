import React from "react";
import ProgressStep from '../TrackOrderPage/ProgressStep';

const OrderProgress = ({ orderStatus, statusSteps }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-6" style={{color: '#245FA6'}}>
          Progression de votre commande
        </h3>
        
        <div className="space-y-4">
          {statusSteps.map((step, index) => (
            <ProgressStep
              key={step.id}
              step={step}
              isCompleted={orderStatus >= step.id}
              isCurrent={orderStatus === step.id}
              isLast={index === statusSteps.length - 1}
            />
          ))}
        </div>
      </div>
    );
  };
export default OrderProgress;