import React from "react";

const ProgressStep = ({ step, isCompleted, isCurrent, isLast }) => {
    const getIcon = (iconType) => {
      const iconProps = { size: 24 };
      switch(iconType) {
        case 'check':
          return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
        case 'package':
          return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 3h4v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V5h4l3-3zm0 3L9.5 7.5h5L12 5zm-4 8.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S10.3 12 9.5 12s-1.5.7-1.5 1.5zm7 0c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5-1.5.7-1.5 1.5z"/></svg>;
        case 'truck':
          return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg>;
        case 'mappin':
          return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
        default:
          return <div></div>;
      }
    };
  
    return (
      <div className="relative">
        <div className="flex items-center space-x-4">
          {/* Step Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isCompleted 
              ? 'text-white' 
              : 'bg-gray-200 text-gray-400'
          }`}
          style={{
            backgroundColor: isCompleted ? (isCurrent ? '#4DAEBD' : '#1F55A3') : '#e5e7eb'
          }}>
            {getIcon(step.iconType)}
          </div>
          
          {/* Step Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
              </div>
              <div className={`text-sm font-medium ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.time}
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection Line */}
        {!isLast && (
          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
        )}
      </div>
    );
  };

export default ProgressStep;
  