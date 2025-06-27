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
      {/* Back button - fixed on left side, vertically centered */}
      {currentSectionIndex > 0 && (
        <div className="fixed left-[12%] top-1/2 transform -translate-y-1/2 z-50">
          <button
            type="button"
            onClick={onBackNavigation}
            disabled={isSubmitting}
            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to {sectionNames[currentSectionIndex - 1]}
          </button>
        </div>
      )}
      
      {/* Next Section button - fixed on right side, vertically centered */}
      {hasNavigatedBack && currentSectionIndex < maxVisibleSection && (
        <div className="fixed right-[12%] top-1/2 transform -translate-y-1/2 z-50">
          <button
            type="button"
            onClick={onNextSectionNavigation}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
          >
            Next Section
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
      
      {/* Special case: Next Section button for the first section when user has navigated back */}
      {currentSectionIndex === 0 && hasNavigatedBack && maxVisibleSection > 0 && (
        <div className="fixed right-[12%] top-1/2 transform -translate-y-1/2 z-50">
          <button
            type="button"
            onClick={onNextSectionNavigation}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
          >
            Next Section
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </>
  );
};

export default FixedFormNavigation;