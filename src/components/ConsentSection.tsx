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
      <div className="space-y-4">
        <div className="text-slate-200 text-sm leading-relaxed">
          <p className="font-semibold mb-3">I understand and agree that my information will be:</p>
          
          <div className="space-y-3 mb-4">
            <div>
              <span className="font-semibold text-blue-300">Collected and Stored:</span>
              <span className="ml-2">Your data will be stored securely on our servers to assess your needs and for future follow-up communications.</span>
            </div>
            
            <div>
              <span className="font-semibold text-green-300">Processed by AI:</span>
              <span className="ml-2">Upon submission, your data will be processed by our AI system to generate a personalized action plan.</span>
            </div>
            
            <div>
              <span className="font-semibold text-purple-300">Delivered to You:</span>
              <span className="ml-2">You will see this action plan on the next screen within 60 seconds after submission, and an email copy of the action plan will also be sent to you.</span>
            </div>
            
            <div>
              <span className="font-semibold text-yellow-300">Protected:</span>
              <span className="ml-2">Your data will be protected according to applicable data privacy standards.</span>
            </div>
          </div>
          
          <p className="font-medium">I explicitly consent to these data processing activities and understand that I can request access to or deletion of my information at any time.</p>
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
      {errors.consent && <p className="text-yellow-400 text-sm mt-1">{errors.consent}</p>}
    </div>
  );
};

export default ConsentSection;