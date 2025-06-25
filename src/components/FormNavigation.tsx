import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormNavigationProps {
  currentSectionIndex: number;
  totalSections: number;
  sectionNames: string[];
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isSubmitting?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentSectionIndex,
  totalSections,
  sectionNames,
  onNext,
  onBack,
  canProceed,
  isSubmitting = false,
}) => {
  const canGoBack = currentSectionIndex > 0;
  const canGoForward = currentSectionIndex < totalSections - 1;
  const isLastSection = currentSectionIndex === totalSections - 1;

  return (
    <div className="flex items-center justify-between mt-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Back Button */}
      <div className="flex-1">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to {sectionNames[currentSectionIndex - 1]}
          </button>
        )}
      </div>

      {/* Section Indicator */}
      <div className="flex-1 text-center">
        <div className="text-slate-300 text-sm">
          Section {currentSectionIndex + 1} of {totalSections}
        </div>
        <div className="text-white font-medium">
          {sectionNames[currentSectionIndex]}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex-1 text-right">
        {canGoForward && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Continue to {sectionNames[currentSectionIndex + 1]}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        )}
        {!canProceed && canGoForward && (
          <div className="text-yellow-400 text-sm mt-1">
            Complete required fields to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;