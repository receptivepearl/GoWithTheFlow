import React from 'react';

const Logo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Simple grid icon matching GirlsWhoGive gradient (pink to purple) */}
        <div className="w-full h-full rounded-lg flex items-center justify-center p-1">
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full"
            fill="none"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
            {/* Simple 2x2 grid with pink-to-purple gradient */}
            <rect x="2" y="2" width="9" height="9" fill="url(#logoGradient)" rx="1" />
            <rect x="13" y="2" width="9" height="9" fill="url(#logoGradient)" rx="1" />
            <rect x="2" y="13" width="9" height="9" fill="url(#logoGradient)" rx="1" />
            <rect x="13" y="13" width="9" height="9" fill="url(#logoGradient)" rx="1" />
            
            {/* Subtle grid lines */}
            <line x1="12" y1="2" x2="12" y2="22" stroke="#9333ea" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="#9333ea" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Logo;

