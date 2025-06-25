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
    <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="space-y-4">
        <div className="text-slate-200 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <p className="font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>I understand and Consent that my information will be:</p>
          
          <div className="space-y-3 mb-4">
            <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
              1. Collected and Stored: Your data will be stored securely on our servers to assess your needs and for future follow-up communications.
            </p>
            
            <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
              2. Processed by AI: Upon submission, your data will be processed by our AI system to generate a personalized action plan.
            </p>
            
            <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
              3. Delivered to You: You will see this action plan on the next screen within 60 seconds after submission, and an email copy of the action plan will also be sent to you.
            </p>
          </div>
          
          <p className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>I understand I can request access to or deletion of my information at any time.</p>
        </div>
        
        <div className="flex items-center space-x-3">
        <CircularCheckbox
          id="consent"
          label="I agree to the above terms and conditions *"
          checked={formData.consent}
          onChange={(checked) => handleInputChange('consent', checked)}
          darkTheme={true}
        />
        </div>
      </div>
      {errors.consent && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.consent}</p>}
    </div>
  );
};

export default ConsentSection;