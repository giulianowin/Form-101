import React from 'react';

interface AppBackgroundProps {
  children: React.ReactNode;
}

const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-purple-950 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AppBackground;