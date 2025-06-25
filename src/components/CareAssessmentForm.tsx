import React, { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import ServiceUserDetails from './ServiceUserDetails';
import NextOfKinDetails from './NextOfKinDetails';
import MedicalBackground from './MedicalBackground';
import ConsentSection from './ConsentSection';
import { isValidName, isValidNameInput, isValidEmail, isValidPhone } from '../utils/validation';

const CareAssessmentForm: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Main form state
  const [formData, setFormData] = useState({
    // Service User Details
    firstName: '',
    lastName: '',
    dateOfBirth: { day: '', month: '', year: '' },
    phoneNumber: '',
    gender: '',
    address: '',
    region: '',
    city: '',
    postcode: '',
    clientStartDate: { day: '', month: '', year: '' },
    allergies: '',
    serviceRequired: '',
    
    // Next of Kin Details
    nextOfKinFirstName: '',
    nextOfKinLastName: '',
    relationshipToClient: '',
    nextOfKinPhone: '',
    nextOfKinEmail: '',
    nextOfKinAddress: '',
    nextOfKinRegion: '',
    nextOfKinCity: '',
    nextOfKinPostcode: '',
    
    // Medical Background
    medicalHistory: '',
    currentDiagnosis: '',
    hospitalAdmissionHistory: '',
    mobilitySupport: '',
    skinIntegrityNeeds: '',
    dnarInPlace: '',
    careVisitFrequency: '',
    careVisitDuration: '',
    requiresHelpWithAppointments: '',
    wantsCompanyToAppointments: '',
    
    // Consent
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Address handling states
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [nextOfKinAddressSuggestions, setNextOfKinAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showNextOfKinAddressSuggestions, setShowNextOfKinAddressSuggestions] = useState(false);

  // Allergy options state
  const [allergyOptions, setAllergyOptions] = useState({
    'Nuts': false,
    'Dairy': false,
    'Gluten': false,
    'Shellfish': false,
    'Eggs': false,
    'Soy': false,
    'Fish': false,
    'Latex': false,
    'Penicillin': false,
    'Other medications': false,
  });
  const [noAllergies, setNoAllergies] = useState(false);

  // Mobility options state
  const [mobilityOptions, setMobilityOptions] = useState({
    'Walking aid': false,
    'Wheelchair': false,
    'Transfer assistance': false,
    'Mobility equipment': false,
    'Physiotherapy support': false,
  });

  // Skin integrity options state
  const [skinIntegrityOptions, setSkinIntegrityOptions] = useState({
    'Pressure sore prevention': false,
    'Wound care': false,
    'Skin condition management': false,
    'Hygiene assistance': false,
    'Moisturizing support': false,
  });

  // Options arrays
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const yearOptions = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const relationshipOptions = [
    'Spouse/Partner', 'Child', 'Parent', 'Sibling', 'Other Relative', 'Friend', 'Guardian'
  ];
  const serviceOptions = [
    'Personal Care', 'Domestic Support', 'Companionship', 'Medication Support', 
    'Meal Preparation', 'Shopping Assistance', 'Transportation', 'Other'
  ];
  const yesNoOptions = ['Yes', 'No'];
  const careVisitFrequencyOptions = [
    'Daily', 'Twice daily', 'Three times daily', 'Weekly', 'Twice weekly', 
    'Three times weekly', 'Fortnightly', 'Monthly', 'As needed'
  ];
  const careVisitDurationOptions = [
    '15 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours', 
    '2 hours', '3 hours', '4 hours', 'Half day', 'Full day'
  ];

  // Event handlers
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleDateChange = (dateType: 'dateOfBirth' | 'clientStartDate', field: 'day' | 'month' | 'year', value: string) => {
    setFormData(prev => ({
      ...prev,
      [dateType]: { ...prev[dateType], [field]: value }
    }));
    if (errors[dateType]) {
      setErrors(prev => ({ ...prev, [dateType]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string, isNextOfKin = false) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value.length > 2) {
      searchAddresses(value, isNextOfKin);
    } else {
      if (isNextOfKin) {
        setShowNextOfKinAddressSuggestions(false);
      } else {
        setShowAddressSuggestions(false);
      }
    }
  };

  const handleAllergyOptionChange = (option: string, checked: boolean) => {
    setAllergyOptions(prev => ({ ...prev, [option]: checked }));
    if (checked) {
      setNoAllergies(false);
      const selectedAllergies = Object.entries({ ...allergyOptions, [option]: checked })
        .filter(([_, selected]) => selected)
        .map(([allergy, _]) => allergy);
      
      if (selectedAllergies.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          allergies: selectedAllergies.join(', ') 
        }));
      }
    } else {
      const selectedAllergies = Object.entries({ ...allergyOptions, [option]: checked })
        .filter(([_, selected]) => selected)
        .map(([allergy, _]) => allergy);
      
      if (selectedAllergies.length === 0) {
        setFormData(prev => ({ ...prev, allergies: '' }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          allergies: selectedAllergies.join(', ') 
        }));
      }
    }
  };

  const handleMobilityOptionChange = (option: string, checked: boolean) => {
    setMobilityOptions(prev => ({ ...prev, [option]: checked }));
    if (checked) {
      const selectedOptions = Object.entries({ ...mobilityOptions, [option]: checked })
        .filter(([_, selected]) => selected)
        .map(([mobility, _]) => mobility);
      
      const currentText = formData.mobilitySupport === 'N/A' ? '' : formData.mobilitySupport;
      const existingText = currentText.split('\n').filter(line => 
        !Object.keys(mobilityOptions).some(opt => line.includes(opt))
      ).join('\n');
      
      const newText = [existingText, ...selectedOptions].filter(Boolean).join('\n');
      setFormData(prev => ({ ...prev, mobilitySupport: newText }));
    }
  };

  const handleSkinIntegrityOptionChange = (option: string, checked: boolean) => {
    setSkinIntegrityOptions(prev => ({ ...prev, [option]: checked }));
    if (checked) {
      const selectedOptions = Object.entries({ ...skinIntegrityOptions, [option]: checked })
        .filter(([_, selected]) => selected)
        .map(([skin, _]) => skin);
      
      const currentText = formData.skinIntegrityNeeds === 'N/A' ? '' : formData.skinIntegrityNeeds;
      const existingText = currentText.split('\n').filter(line => 
        !Object.keys(skinIntegrityOptions).some(opt => line.includes(opt))
      ).join('\n');
      
      const newText = [existingText, ...selectedOptions].filter(Boolean).join('\n');
      setFormData(prev => ({ ...prev, skinIntegrityNeeds: newText }));
    }
  };

  // Address search functionality
  const searchAddresses = async (query: string, isNextOfKin = false) => {
    // Mock address search - replace with actual implementation
    const mockSuggestions = [
      {
        id: '1',
        text: `${query} Street`,
        place_name: 'Sample Area, Sample City, Sample County'
      }
    ];
    
    if (isNextOfKin) {
      setNextOfKinAddressSuggestions(mockSuggestions);
      setShowNextOfKinAddressSuggestions(true);
    } else {
      setAddressSuggestions(mockSuggestions);
      setShowAddressSuggestions(true);
    }
  };

  const selectAddress = (suggestion: any, isNextOfKin = false) => {
    if (isNextOfKin) {
      setFormData(prev => ({ ...prev, nextOfKinAddress: suggestion.text }));
      setShowNextOfKinAddressSuggestions(false);
    } else {
      setFormData(prev => ({ ...prev, address: suggestion.text }));
      setShowAddressSuggestions(false);
    }
  };

  // Validation functions
  const getDescriptionForField = (field: string, value: string): string | null => {
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'nextOfKinFirstName':
      case 'nextOfKinLastName':
        if (value.length >= 3 && isValidName(value)) return 'Valid name format';
        return null;
      case 'phoneNumber':
      case 'nextOfKinPhone':
        if (isValidPhone(value)) return 'Valid UK phone number';
        return null;
      case 'nextOfKinEmail':
        if (isValidEmail(value)) return 'Valid email format';
        return null;
      default:
        return null;
    }
  };

  const shouldShowWarning = (field: string, value: string): boolean => {
    if (['firstName', 'lastName', 'nextOfKinFirstName', 'nextOfKinLastName'].includes(field)) {
      return value.length > 0 && value.length < 3;
    }
    return false;
  };

  const shouldShowDescription = (field: string, value: string): boolean => {
    return getDescriptionForField(field, value) !== null;
  };

  const getDateOfBirthWarning = (): string => {
    const { day, month, year } = formData.dateOfBirth;
    if (day && month && year) {
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) return 'Client appears to be under 18 years old';
      if (age > 120) return 'Please verify the date of birth';
    }
    return '';
  };

  const getClientStartDateWarning = (): string => {
    const { day, month, year } = formData.clientStartDate;
    if (day && month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      if (startDate < today) return 'Start date is in the past';
    }
    return '';
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Service User Details validation
    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = 'First name must be at least 3 characters';
    }
    if (!formData.lastName || formData.lastName.length < 3) {
      newErrors.lastName = 'Last name must be at least 3 characters';
    }
    if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.phoneNumber || !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Valid UK phone number is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender selection is required';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    if (!formData.region) {
      newErrors.region = 'Region is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.postcode) {
      newErrors.postcode = 'Postcode is required';
    }
    if (!formData.allergies) {
      newErrors.allergies = 'Allergy information is required';
    }
    if (!formData.serviceRequired) {
      newErrors.serviceRequired = 'Service selection is required';
    }

    // Next of Kin Details validation
    if (!formData.nextOfKinFirstName || formData.nextOfKinFirstName.length < 3) {
      newErrors.nextOfKinFirstName = 'Next of kin first name must be at least 3 characters';
    }
    if (!formData.nextOfKinLastName || formData.nextOfKinLastName.length < 3) {
      newErrors.nextOfKinLastName = 'Next of kin last name must be at least 3 characters';
    }
    if (!formData.relationshipToClient) {
      newErrors.relationshipToClient = 'Relationship is required';
    }
    if (!formData.nextOfKinPhone || !isValidPhone(formData.nextOfKinPhone)) {
      newErrors.nextOfKinPhone = 'Valid UK phone number is required';
    }
    if (!formData.nextOfKinEmail || !isValidEmail(formData.nextOfKinEmail)) {
      newErrors.nextOfKinEmail = 'Valid email address is required';
    }
    if (!formData.nextOfKinAddress) {
      newErrors.nextOfKinAddress = 'Next of kin address is required';
    }
    if (!formData.nextOfKinRegion) {
      newErrors.nextOfKinRegion = 'Next of kin region is required';
    }
    if (!formData.nextOfKinCity) {
      newErrors.nextOfKinCity = 'Next of kin city is required';
    }
    if (!formData.nextOfKinPostcode) {
      newErrors.nextOfKinPostcode = 'Next of kin postcode is required';
    }

    // Medical Background validation
    if (!formData.dnarInPlace) {
      newErrors.dnarInPlace = 'DNAR status is required';
    }
    if (!formData.requiresHelpWithAppointments) {
      newErrors.requiresHelpWithAppointments = 'Appointment help requirement is required';
    }
    if (!formData.wantsCompanyToAppointments) {
      newErrors.wantsCompanyToAppointments = 'Company to appointments preference is required';
    }

    // Consent validation
    if (!formData.consent) {
      newErrors.consent = 'Consent is required to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        serviceUserDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: `${formData.dateOfBirth.day}/${formData.dateOfBirth.month}/${formData.dateOfBirth.year}`,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          address: formData.address,
          region: formData.region,
          city: formData.city,
          postcode: formData.postcode,
          clientStartDate: formData.clientStartDate.day && formData.clientStartDate.month && formData.clientStartDate.year 
            ? `${formData.clientStartDate.day}/${formData.clientStartDate.month}/${formData.clientStartDate.year}` 
            : '',
          allergies: formData.allergies,
          serviceRequired: formData.serviceRequired,
        },
        nextOfKinDetails: {
          fullName: `${formData.nextOfKinFirstName} ${formData.nextOfKinLastName}`,
          relationshipToClient: formData.relationshipToClient,
          phoneNumber: formData.nextOfKinPhone,
          email: formData.nextOfKinEmail,
          address: formData.nextOfKinAddress,
          region: formData.nextOfKinRegion,
          city: formData.nextOfKinCity,
          postcode: formData.nextOfKinPostcode,
        },
        medicalBackgroundInformation: {
          medicalHistory: formData.medicalHistory,
          currentDiagnosis: formData.currentDiagnosis,
          hospitalAdmissionHistory: formData.hospitalAdmissionHistory,
          mobilitySupport: formData.mobilitySupport,
          skinIntegrityNeeds: formData.skinIntegrityNeeds,
          dnarInPlace: formData.dnarInPlace,
          careVisitFrequency: formData.careVisitFrequency,
          careVisitDuration: formData.careVisitDuration,
          requiresHelpWithAppointments: formData.requiresHelpWithAppointments,
          wantsCompanyToAppointments: formData.wantsCompanyToAppointments,
        },
        consent: formData.consent,
        submittedAt: new Date().toISOString(),
      };

      // Mock submission - replace with actual API call
      console.log('Submitting care assessment:', submissionData);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSubmissionSuccess(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Assessment Submitted Successfully
          </h2>
          <p className="text-slate-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Thank you for completing the care assessment. We will review your information and contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Interactive Care Assessment Form
          </h1>
          <p className="text-slate-200 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Please complete all sections to help us provide the best care possible
          </p>
        </div>

        <ServiceUserDetails
          formData={formData}
          handleInputChange={handleInputChange}
          handlePhoneChange={handlePhoneChange}
          handleDateChange={handleDateChange}
          handleAddressChange={handleAddressChange}
          errors={errors}
          dayOptions={dayOptions}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          genderOptions={genderOptions}
          serviceOptions={serviceOptions}
          allergyOptions={allergyOptions}
          handleAllergyOptionChange={handleAllergyOptionChange}
          getDescriptionForField={getDescriptionForField}
          getDateOfBirthWarning={getDateOfBirthWarning}
          getClientStartDateWarning={getClientStartDateWarning}
          searchAddresses={searchAddresses}
          selectAddress={selectAddress}
          addressSuggestions={addressSuggestions}
          showAddressSuggestions={showAddressSuggestions}
          focusedField={focusedField}
          setShowAddressSuggestions={setShowAddressSuggestions}
          setFocusedField={setFocusedField}
          shouldShowDescription={shouldShowDescription}
          currentYear={currentYear}
          noAllergies={noAllergies}
          setNoAllergies={setNoAllergies}
        />

        <NextOfKinDetails
          formData={formData}
          handleInputChange={handleInputChange}
          handlePhoneChange={handlePhoneChange}
          handleAddressChange={handleAddressChange}
          errors={errors}
          relationshipOptions={relationshipOptions}
          getDescriptionForField={getDescriptionForField}
          searchAddresses={searchAddresses}
          selectAddress={selectAddress}
          nextOfKinAddressSuggestions={nextOfKinAddressSuggestions}
          showNextOfKinAddressSuggestions={showNextOfKinAddressSuggestions}
          focusedField={focusedField}
          setShowNextOfKinAddressSuggestions={setShowNextOfKinAddressSuggestions}
          setFocusedField={setFocusedField}
          shouldShowWarning={shouldShowWarning}
          shouldShowDescription={shouldShowDescription}
        />

        <MedicalBackground
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          mobilityOptions={mobilityOptions}
          setMobilityOptions={setMobilityOptions}
          handleMobilityOptionChange={handleMobilityOptionChange}
          skinIntegrityOptions={skinIntegrityOptions}
          setSkinIntegrityOptions={setSkinIntegrityOptions}
          handleSkinIntegrityOptionChange={handleSkinIntegrityOptionChange}
          yesNoOptions={yesNoOptions}
          careVisitDurationOptions={careVisitDurationOptions}
          careVisitFrequencyOptions={careVisitFrequencyOptions}
        />

        <ConsentSection
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg disabled:cursor-not-allowed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Assessment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareAssessmentForm;