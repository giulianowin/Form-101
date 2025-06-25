import React, { useState, useEffect } from 'react';
import { User, Users, Heart, Send, AlertCircle } from 'lucide-react';

interface ServiceUserDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  address: string;
  postcode: string;
  clientStartDate: string;
  allergies: string;
  serviceRequired: string;
}

interface NextOfKinDetails {
  fullName: string;
  relationshipToClient: string;
  phoneNumber: string;
  email: string;
  address: string;
  postcode: string;
}

interface MedicalBackgroundInformation {
  medicalHistory: string;
  currentDiagnosis: string;
  hospitalAdmissionHistory: string;
  mobilitySupport: string;
  skinIntegrityNeeds: string;
  dnarInPlace: string;
  careVisitFrequency: string;
  careVisitDuration: string;
  requiresHelpWithAppointments: string;
  wantsCompanyToAppointments: string;
}

// Define required fields for each section
const REQUIRED_FIELDS = {
  serviceUser: ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'gender', 'address', 'postcode', 'allergies', 'serviceRequired'] as (keyof ServiceUserDetails)[],
  nextOfKin: ['fullName', 'relationshipToClient', 'phoneNumber', 'address', 'postcode'] as (keyof NextOfKinDetails)[],
  medical: ['medicalHistory', 'currentDiagnosis', 'careVisitFrequency', 'careVisitDuration'] as (keyof MedicalBackgroundInformation)[]
};

const CareAssessmentForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [serviceUserDetails, setServiceUserDetails] = useState<ServiceUserDetails>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: '',
    address: '',
    postcode: '',
    clientStartDate: '',
    allergies: '',
    serviceRequired: ''
  });

  const [nextOfKinDetails, setNextOfKinDetails] = useState<NextOfKinDetails>({
    fullName: '',
    relationshipToClient: '',
    phoneNumber: '',
    email: '',
    address: '',
    postcode: ''
  });

  const [medicalBackgroundInformation, setMedicalBackgroundInformation] = useState<MedicalBackgroundInformation>({
    medicalHistory: '',
    currentDiagnosis: '',
    hospitalAdmissionHistory: '',
    mobilitySupport: '',
    skinIntegrityNeeds: '',
    dnarInPlace: '',
    careVisitFrequency: '',
    careVisitDuration: '',
    requiresHelpWithAppointments: '',
    wantsCompanyToAppointments: ''
  });

  // Check if a section is complete
  const isSectionComplete = (section: number): boolean => {
    switch (section) {
      case 1:
        return REQUIRED_FIELDS.serviceUser.every(field => 
          serviceUserDetails[field] && serviceUserDetails[field].trim() !== ''
        );
      case 2:
        return REQUIRED_FIELDS.nextOfKin.every(field => 
          nextOfKinDetails[field] && nextOfKinDetails[field].trim() !== ''
        );
      case 3:
        return REQUIRED_FIELDS.medical.every(field => 
          medicalBackgroundInformation[field] && medicalBackgroundInformation[field].trim() !== ''
        );
      default:
        return false;
    }
  };

  // Reactively update current section based on completion
  useEffect(() => {
    if (currentSection === 1 && isSectionComplete(1)) {
      setCurrentSection(2);
    } else if (currentSection === 2 && isSectionComplete(2)) {
      setCurrentSection(3);
    }
  }, [serviceUserDetails, nextOfKinDetails, medicalBackgroundInformation, currentSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSectionComplete(3) || !consent) {
      setSubmitMessage('Please complete all required fields and provide consent.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submissionData = {
        serviceUserDetails,
        nextOfKinDetails,
        medicalBackgroundInformation,
        consent,
        submittedAt: new Date().toISOString()
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/care-assessment-webhook`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmitMessage('Assessment submitted successfully!');
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldRequired = (section: number, fieldName: string): boolean => {
    switch (section) {
      case 1:
        return REQUIRED_FIELDS.serviceUser.includes(fieldName as keyof ServiceUserDetails);
      case 2:
        return REQUIRED_FIELDS.nextOfKin.includes(fieldName as keyof NextOfKinDetails);
      case 3:
        return REQUIRED_FIELDS.medical.includes(fieldName as keyof MedicalBackgroundInformation);
      default:
        return false;
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    type: string = 'text',
    section: number,
    fieldName: string
  ) => {
    const required = isFieldRequired(section, fieldName);
    const isEmpty = !value || value.trim() === '';
    const showWarning = required && isEmpty;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white ${
              showWarning 
                ? 'border-yellow-400 bg-yellow-900/20' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}
            required={required}
          />
          {showWarning && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
          )}
        </div>
        {showWarning && (
          <p className="text-sm text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            This field is required
          </p>
        )}
      </div>
    );
  };

  const renderTextarea = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    section: number,
    fieldName: string,
    rows: number = 3
  ) => {
    const required = isFieldRequired(section, fieldName);
    const isEmpty = !value || value.trim() === '';
    const showWarning = required && isEmpty;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-vertical text-white ${
              showWarning 
                ? 'border-yellow-400 bg-yellow-900/20' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}
            required={required}
          />
          {showWarning && (
            <div className="absolute top-3 right-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
          )}
        </div>
        {showWarning && (
          <p className="text-sm text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            This field is required
          </p>
        )}
      </div>
    );
  };

  const renderSelect = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[],
    section: number,
    fieldName: string
  ) => {
    const required = isFieldRequired(section, fieldName);
    const isEmpty = !value || value.trim() === '';
    const showWarning = required && isEmpty;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white ${
              showWarning 
                ? 'border-yellow-400 bg-yellow-900/20' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}
            required={required}
          >
            <option value="">Select...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {showWarning && (
            <div className="absolute inset-y-0 right-8 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
          )}
        </div>
        {showWarning && (
          <p className="text-sm text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            This field is required
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Care Assessment Form</h1>
          <p className="text-lg text-purple-300">Please complete the following sections</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step < currentSection ? 'bg-purple-600 text-white' :
                  step === currentSection ? 'bg-purple-700 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {step < currentSection ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-colors ${
                    step < currentSection ? 'bg-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-purple-300">
              {currentSection === 1 && 'Service User Details'}
              {currentSection === 2 && 'Next of Kin Details'}
              {currentSection === 3 && 'Medical Information'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Service User Details */}
          {currentSection >= 1 && (
            <div className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-500 ${
              currentSection === 1 ? 'ring-2 ring-purple-500' : ''
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Service User Details</h2>
                {isSectionComplete(1) && (
                  <div className="ml-auto bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Complete
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('First Name', serviceUserDetails.firstName, 
                  (value) => setServiceUserDetails({...serviceUserDetails, firstName: value}), 'text', 1, 'firstName')}
                
                {renderInput('Last Name', serviceUserDetails.lastName, 
                  (value) => setServiceUserDetails({...serviceUserDetails, lastName: value}), 'text', 1, 'lastName')}
                
                {renderInput('Date of Birth', serviceUserDetails.dateOfBirth, 
                  (value) => setServiceUserDetails({...serviceUserDetails, dateOfBirth: value}), 'date', 1, 'dateOfBirth')}
                
                {renderInput('Phone Number', serviceUserDetails.phoneNumber, 
                  (value) => setServiceUserDetails({...serviceUserDetails, phoneNumber: value}), 'tel', 1, 'phoneNumber')}
                
                {renderSelect('Gender', serviceUserDetails.gender,
                  (value) => setServiceUserDetails({...serviceUserDetails, gender: value}),
                  ['Male', 'Female', 'Other', 'Prefer not to say'], 1, 'gender')}
                
                {renderInput('Client Start Date', serviceUserDetails.clientStartDate, 
                  (value) => setServiceUserDetails({...serviceUserDetails, clientStartDate: value}), 'date', 1, 'clientStartDate')}
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                {renderInput('Address', serviceUserDetails.address, 
                  (value) => setServiceUserDetails({...serviceUserDetails, address: value}), 'text', 1, 'address')}
                
                {renderInput('Postcode', serviceUserDetails.postcode, 
                  (value) => setServiceUserDetails({...serviceUserDetails, postcode: value}), 'text', 1, 'postcode')}
                
                {renderSelect('Service Required', serviceUserDetails.serviceRequired,
                  (value) => setServiceUserDetails({...serviceUserDetails, serviceRequired: value}),
                  ['Personal Care', 'Domestic Support', 'Companionship', 'Respite Care', 'Other'], 1, 'serviceRequired')}
                
                {renderTextarea('Allergies', serviceUserDetails.allergies, 
                  (value) => setServiceUserDetails({...serviceUserDetails, allergies: value}), 1, 'allergies', 3)}
              </div>
            </div>
          )}

          {/* Section 2: Next of Kin Details */}
          {currentSection >= 2 && (
            <div className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-500 ${
              currentSection === 2 ? 'ring-2 ring-purple-500' : ''
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Next of Kin Details</h2>
                {isSectionComplete(2) && (
                  <div className="ml-auto bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Complete
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Full Name', nextOfKinDetails.fullName, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, fullName: value}), 'text', 2, 'fullName')}
                
                {renderInput('Relationship to Client', nextOfKinDetails.relationshipToClient, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, relationshipToClient: value}), 'text', 2, 'relationshipToClient')}
                
                {renderInput('Phone Number', nextOfKinDetails.phoneNumber, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, phoneNumber: value}), 'tel', 2, 'phoneNumber')}
                
                {renderInput('Email', nextOfKinDetails.email, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, email: value}), 'email', 2, 'email')}
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                {renderInput('Address', nextOfKinDetails.address, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, address: value}), 'text', 2, 'address')}
                
                {renderInput('Postcode', nextOfKinDetails.postcode, 
                  (value) => setNextOfKinDetails({...nextOfKinDetails, postcode: value}), 'text', 2, 'postcode')}
              </div>
            </div>
          )}

          {/* Section 3: Medical Background Information */}
          {currentSection >= 3 && (
            <div className={`bg-white rounded-lg shadow-lg p-8 transition-all duration-500 ${
              currentSection === 3 ? 'ring-2 ring-purple-500' : ''
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Medical Background Information</h2>
                {isSectionComplete(3) && (
                  <div className="ml-auto bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Complete
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {renderTextarea('Medical History', medicalBackgroundInformation.medicalHistory, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, medicalHistory: value}), 3, 'medicalHistory', 4)}
                
                {renderTextarea('Current Diagnosis', medicalBackgroundInformation.currentDiagnosis, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, currentDiagnosis: value}), 3, 'currentDiagnosis', 3)}
                
                {renderTextarea('Hospital Admission History', medicalBackgroundInformation.hospitalAdmissionHistory, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, hospitalAdmissionHistory: value}), 3, 'hospitalAdmissionHistory', 3)}
                
                {renderTextarea('Mobility Support', medicalBackgroundInformation.mobilitySupport, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, mobilitySupport: value}), 3, 'mobilitySupport', 3)}
                
                {renderTextarea('Skin Integrity Needs', medicalBackgroundInformation.skinIntegrityNeeds, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, skinIntegrityNeeds: value}), 3, 'skinIntegrityNeeds', 3)}
                
                {renderTextarea('DNAR in Place', medicalBackgroundInformation.dnarInPlace, 
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, dnarInPlace: value}), 3, 'dnarInPlace', 2)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {renderSelect('Care Visit Frequency', medicalBackgroundInformation.careVisitFrequency,
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, careVisitFrequency: value}),
                  ['Daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Weekly', 'Twice weekly', 'Other'], 3, 'careVisitFrequency')}
                
                {renderSelect('Care Visit Duration', medicalBackgroundInformation.careVisitDuration,
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, careVisitDuration: value}),
                  ['15 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours', 'Other'], 3, 'careVisitDuration')}
                
                {renderSelect('Requires Help with Appointments', medicalBackgroundInformation.requiresHelpWithAppointments,
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, requiresHelpWithAppointments: value}),
                  ['Yes', 'No', 'Sometimes'], 3, 'requiresHelpWithAppointments')}
                
                {renderSelect('Wants Company to Appointments', medicalBackgroundInformation.wantsCompanyToAppointments,
                  (value) => setMedicalBackgroundInformation({...medicalBackgroundInformation, wantsCompanyToAppointments: value}),
                  ['Yes', 'No', 'Sometimes'], 3, 'wantsCompanyToAppointments')}
              </div>
            </div>
          )}

          {/* Consent and Submit */}
          {currentSection >= 3 && isSectionComplete(3) && (
            <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    I consent to the processing of this personal information for the purpose of care assessment and service provision. 
                    I understand that this information will be used to determine appropriate care arrangements and may be shared with relevant healthcare professionals and care providers.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!consent || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Submitting Assessment...' : 'Submit Assessment'}
                </button>

                {submitMessage && (
                  <div className={`p-4 rounded-lg text-center font-medium ${
                    submitMessage.includes('successfully') 
                      ? 'bg-purple-900 text-purple-200' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CareAssessmentForm;