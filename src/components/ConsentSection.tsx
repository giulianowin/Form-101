import React from 'react';
import CircularCheckbox from './CircularCheckbox';

interface ConsentSectionProps {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  errors: any;
}

const ConsentSection: React.FC<ConsentSectionProps> = ({
  formData,
  handleInputChange,
  errors,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center space-x-3">
        <CircularCheckbox
          id="consent"
          label="I consent to the processing of my personal data for the purpose of this care assessment and service provision. *"
          checked={formData.consent}
          onChange={(checked) => handleInputChange('consent', checked)}
          darkTheme={true}
        />
      </div>
      {errors.consent && <p className="text-yellow-400 text-sm mt-1">{errors.consent}</p>}
    </div>
  );
};

export default ConsentSection;