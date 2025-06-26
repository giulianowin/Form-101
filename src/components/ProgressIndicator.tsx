import React from 'react';
import { Heart } from 'lucide-react';

interface ProgressIndicatorProps {
  currentSectionName: string;
  completedFields: number;
  totalFields: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSectionName,
  completedFields,
  totalFields,
}) => {
  const percentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Heart 
              className="w-6 h-6 text-green-400 animate-pulse-heart" 
              fill="currentColor"
            />
            <div className="absolute inset-0 w-6 h-6 text-green-400 animate-ping-heart opacity-75">
              <Heart className="w-6 h-6" fill="currentColor" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Currently Completing</h3>
            <p className="text-sm" style={{ color: '#FFFFFF' }}>{currentSectionName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{percentage}%</div>
          <p className="text-sm" style={{ color: '#FFFFFF' }}>{completedFields} of {totalFields} fields</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-slate-700 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span style={{ color: '#FFFFFF' }}>Start</span>
          <span style={{ color: '#FFFFFF' }}>Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;