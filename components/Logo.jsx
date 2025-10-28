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
        {/* Main logo circle with gradient */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          {/* Inner wave pattern */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-3/4 h-3/4 text-white"
            fill="currentColor"
          >
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            <path d="M3 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            <path d="M3 16c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
          </svg>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-20 blur-sm -z-10"></div>
      </div>
    </div>
  );
};

export default Logo;

