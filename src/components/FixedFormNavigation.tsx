import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FixedFormNavigationProps {
  currentSectionIndex: number;
  maxVisibleSection: number;
  hasNavigatedBack: boolean;
  isSubmitting: boolean;
  sectionNames: string[];
  onBackNavigation: () => void;
  onNextSectionNavigation: () => void;
}

const FixedFormNavigation: React.FC<FixedFormNavigationProps> = ({
  currentSectionIndex,
  maxVisibleSection,
  hasNavigatedBack,
  isSubmitting,
  sectionNames,
  onBackNavigation,
  onNextSectionNavigation,
}) => {
  return (
    <>
      {/* Back button - fixed at left edge of screen, full screen height */}
      {currentSectionIndex > 0 && (
        <button
          type="button"
          onClick={onBackNavigation}
          disabled={isSubmitting}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 h-96 w-20 z-[9999] flex flex-col justify-center items-center bg-purple-950 hover:bg-purple-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-2xl"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronLeft className="w-6 h-6 mb-4" />
          <div className="flex flex-col items-center space-y-1 text-2xl font-bold">
            <span>G</span>
            <span>O</span>
            <span className="h-2"></span>
            <span>B</span>
            <span>A</span>
            <span>C</span>
            <span>K</span>
          </div>
        </button>
      )}
      
      {/* Next Section button - fixed at right edge of screen, full screen height */}
      {hasNavigatedBack && currentSectionIndex < maxVisibleSection && (
        <button
          type="button"
          onClick={onNextSectionNavigation}
          disabled={isSubmitting}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 h-96 w-20 z-[9999] flex flex-col justify-center items-center bg-purple-950 hover:bg-purple-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-2xl"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronRight className="w-6 h-6 mb-4" />
          <div className="flex flex-col items-center text-xl font-bold">
            <span>N</span>
            <span>E</span>
            <span>X</span>
            <span>T</span>
          </div>
        </button>
      )}
      
      {/* Special case: Next Section button for the first section when user has navigated back */}
      {currentSectionIndex === 0 && hasNavigatedBack && maxVisibleSection > 0 && (
        <button
          type="button"
          onClick={onNextSectionNavigation}
          disabled={isSubmitting}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 h-96 w-20 z-[9999] flex flex-col justify-center items-center bg-purple-950 hover:bg-purple-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-2xl"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronRight className="w-6 h-6 mb-4" />
          <div className="flex flex-col items-center text-xl font-bold">
            <span>N</span>
            <span>E</span>
            <span>X</span>
            <span>T</span>
          </div>
        </button>
      )}
    </>
  );
};

export default FixedFormNavigation;