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
      {/* Back button - fixed on left side, full screen height */}
      {currentSectionIndex > 0 && (
        <button
          type="button"
          onClick={onBackNavigation}
          disabled={isSubmitting}
          className="fixed left-0 top-0 h-screen w-20 z-[9999] flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronLeft className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium writing-mode-vertical transform rotate-180 text-center">
            Go back
          </span>
        </button>
      )}
      
      {/* Next Section button - fixed on right side, full screen height */}
      {hasNavigatedBack && currentSectionIndex < maxVisibleSection && (
        <button
          type="button"
          onClick={onNextSectionNavigation}
          disabled={isSubmitting}
          className="fixed right-0 top-0 h-screen w-20 z-[9999] flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronRight className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium writing-mode-vertical transform rotate-180 text-center">
            Next
          </span>
        </button>
      )}
      
      {/* Special case: Next Section button for the first section when user has navigated back */}
      {currentSectionIndex === 0 && hasNavigatedBack && maxVisibleSection > 0 && (
        <button
          type="button"
          onClick={onNextSectionNavigation}
          disabled={isSubmitting}
          className="fixed right-0 top-0 h-screen w-20 z-[9999] flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
        >
          <ChevronRight className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium writing-mode-vertical transform rotate-180 text-center">
            Next
          </span>
        </button>
      )}
    </>
  );
};

export default FixedFormNavigation;