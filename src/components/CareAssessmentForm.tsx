import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import ServiceUserDetails from './ServiceUserDetails';
import NextOfKinDetails from './NextOfKinDetails';
import MedicalBackground from './MedicalBackground';
import ConsentSection from './ConsentSection';
import ProgressIndicator from './ProgressIndicator';
import FixedFormNavigation from './FixedFormNavigation';
import { isValidName, isValidNameInput, isValidEmail, isValidPhone } from '../utils/validation';
import { getRequiredFieldsStatus } from '../utils/formValidationHelpers';

// Validation helpers - moved outside component to be accessible by shouldShowWarning
interface FormData {
  // Service User Details
  firstName: string;
  lastName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  phoneNumber: string;
  gender: string;
  address: string;
  region: string;
  city: string;
  postcode: string;
  clientStartDate: {
    day: string;
    month: string;
    year: string;
  };
  allergies: string;
  serviceRequired: string;

  // Next of Kin Details
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  relationshipToClient: string;
  nextOfKinPhone: string;
  nextOfKinEmail: string;
  nextOfKinAddress: string;
  nextOfKinRegion: string;
  nextOfKinCity: string;
  nextOfKinPostcode: string;

  // Medical Background
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

  // Consent
  consent: boolean;
}

interface MobilityOptions {
  [key: string]: boolean;
}

interface SkinIntegrityOptions {
  [key: string]: boolean;
}

interface AllergyOptions {
  [key: string]: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface MapboxFeature {
  address?: string;
  text: string;
  place_name: string;
  context: Array<{
    id: string;
    text: string;
  }>;
}

interface MapboxSuggestion {
  id: string;
  place_name: string;
  text: string;
  address?: string;
  context: Array<{
    id: string;
    text: string;
  }>;
}

const CareAssessmentForm: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lastManualNavigation, setLastManualNavigation] = useState<number | null>(null);
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false);
  const sectionNames = ['Client Details', 'Next of Kin Details', 'Medical Background', 'Consent'];

  const [mobilityOptions, setMobilityOptions] = useState<MobilityOptions>({
    'Stairlift': false,
    'Walking Stick': false,
    'Assistance to stand': false,
    'Assistance with walking': false,
  });
  const [skinIntegrityOptions, setSkinIntegrityOptions] = useState<SkinIntegrityOptions>({
    'Requires regular moisturizing / cream application': false,
    'Requires wound dressing / care': false,
    'Prone to rashes or skin irritation': false,
  });
  const [allergyOptions, setAllergyOptions] = useState<AllergyOptions>({
    'Peanut Allergy': false,
    'Hay Fever allergy': false,
    'Bee Sting Allergy': false,
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: { day: '', month: '', year: '' },
    phoneNumber: '0',
    gender: '',
    address: '',
    region: '',
    city: '',
    postcode: '',
    clientStartDate: { day: '', month: '', year: '' },
    allergies: '',
    serviceRequired: '',
    nextOfKinFirstName: '',
    nextOfKinLastName: '',
    relationshipToClient: '',
    nextOfKinPhone: '0',
    nextOfKinEmail: '',
    nextOfKinAddress: '',
    nextOfKinRegion: '',
    nextOfKinCity: '',
    nextOfKinPostcode: '',
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
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<MapboxSuggestion[]>([]);
  const [nextOfKinAddressSuggestions, setNextOfKinAddressSuggestions] = useState<MapboxSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showNextOfKinAddressSuggestions, setShowNextOfKinAddressSuggestions] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const [noAllergies, setNoAllergies] = useState(false);

  // Options
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthOptions = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  const handleMobilityOptionChange = (option: string, checked: boolean) => {
    setMobilityOptions(prev => ({ ...prev, [option]: checked }));

    const currentText = formData.mobilitySupport;
    let updatedText = currentText;

    if (checked) {
      // Add the option to the text if it's not already there
      if (!currentText.includes(option)) {
        updatedText = currentText ? `${currentText}, ${option}` : option;
      }
    } else {
      // Remove the option from the text
      const optionPattern = new RegExp(`(^|, )${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(, |$)`, 'g');
      updatedText = currentText.replace(optionPattern, (match, before, after) => {
        if (before === ', ' && after === ', ') return ', ';
        if (before === ', ' && after === '') return '';
        if (before === '' && after === ', ') return '';
        return '';
      }).trim();
    }

    handleInputChange('mobilitySupport', updatedText);
  };

  const handleAllergyOptionChange = (option: string, checked: boolean) => {
    setAllergyOptions(prev => ({ ...prev, [option]: checked }));

    const currentText = formData.allergies;
    let newText = currentText;

    if (checked) {
      // Add the option if it's not already there
      if (!currentText.includes(option)) {
        newText = currentText ? `${currentText}, ${option}` : option;
      }
    } else {
      // Remove the option
      newText = currentText
        .split(', ')
        .filter(item => item.trim() !== option)
        .join(', ');
    }

    handleInputChange('allergies', newText);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 101 }, (_, i) => String(currentYear - i));
  const genderOptions = ['Male', 'Female'];
  const serviceOptions = [
    'Hospital to Home', 'Dementia & Cognitive Care', 'Complex & Palliative Support',
    'Childcare & Lifestyle Support', 'Private Nurses & Cultural Matching',
    'Clinical & Social Coordination', 'Respite Care',
  ];
  const relationshipOptions = [
    'Son', 'Daughter', 'Father', 'Mother', 'Grandmother', 'Grandfather',
    'Wife', 'Friend', 'Husband', 'Partner', 'Brother', 'Sister', 'Cousin'
  ];
  const yesNoOptions = ['Yes', 'No'];
  const careVisitDurationOptions = ['30 minutes', '1 hour', '2 hours'];
  const careVisitFrequencyOptions = ['Daily', 'Weekly', 'Monthly'];

  // Address search using proper Mapbox API structure
  const searchAddresses = async (query: string, isNextOfKin: boolean = false) => {
    if (query.length < 3) {
      if (isNextOfKin) {
        setNextOfKinAddressSuggestions([]);
        setShowNextOfKinAddressSuggestions(false);
      } else {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
      return;
    }

    try {
      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) {
        console.error('Mapbox access token not found in environment variables');
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=GB&types=address&access_token=${mapboxToken}&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions: MapboxSuggestion[] = data.features.map((feature: MapboxFeature) => ({
          id: feature.place_name,
          place_name: feature.place_name,
          text: feature.text,
          address: feature.address,
          context: feature.context
        }));
        
        if (isNextOfKin) {
          setNextOfKinAddressSuggestions(suggestions);
          setShowNextOfKinAddressSuggestions(true);
        } else {
          setAddressSuggestions(suggestions);
          setShowAddressSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const selectAddress = (suggestion: MapboxSuggestion, isNextOfKin: boolean = false) => {
    // Extract address components using proper Mapbox structure
    const firstLineAddress = suggestion.address && suggestion.text
      ? `${suggestion.address} ${suggestion.text}`
      : suggestion.text;

    // Extract components from context array
    let region = '';
    let city = '';
    let postcode = '';

    suggestion.context.forEach(item => {
      if (item.id.startsWith('region.')) {
        region = item.text;
      } else if (item.id.startsWith('place.') || item.id.startsWith('locality.')) {
        city = item.text;
      } else if (item.id.startsWith('postcode.')) {
        postcode = item.text;
      }
    });

    if (isNextOfKin) {
      setFormData(prev => ({
        ...prev,
        nextOfKinAddress: firstLineAddress,
        nextOfKinRegion: region,
        nextOfKinCity: city,
        nextOfKinPostcode: postcode
      }));
      setShowNextOfKinAddressSuggestions(false);
      setNextOfKinAddressSuggestions([]);
    } else {
      setFormData(prev => ({
        ...prev,
        address: firstLineAddress,
        region: region,
        city: city,
        postcode: postcode
      }));
      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleSkinIntegrityOptionChange = (option: string, checked: boolean) => {
    setSkinIntegrityOptions(prev => ({ ...prev, [option]: checked }));

    const currentText = formData.skinIntegrityNeeds;
    let newText = currentText;

    if (checked) {
      // Add the option if not already present
      if (!currentText.includes(option)) {
        newText = currentText ? `${currentText}\n${option}` : option;
      }
    } else {
      // Remove the option
      const lines = currentText.split('\n').filter(line => line.trim() !== option);
      newText = lines.join('\n');
    }

    handleInputChange('skinIntegrityNeeds', newText);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!isValidName(formData.firstName)) newErrors.firstName = 'Enter letters only (A-Z), minimum 3 characters';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!isValidName(formData.lastName)) newErrors.lastName = 'Enter letters only (A-Z), minimum 3 characters';

    if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';

    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 11-digit UK phone number';
    } else if (!formData.phoneNumber.trim() || formData.phoneNumber === '0') {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.allergies.trim()) newErrors.allergies = 'Allergies information is required';
    if (!formData.serviceRequired.trim()) newErrors.serviceRequired = 'Service type is required';

    if (!formData.nextOfKinFirstName.trim()) newErrors.nextOfKinFirstName = 'Next of kin first name is required';
    else if (!isValidName(formData.nextOfKinFirstName)) newErrors.nextOfKinFirstName = 'Enter letters only (A-Z), minimum 3 characters';

    if (!formData.nextOfKinLastName.trim()) newErrors.nextOfKinLastName = 'Next of kin last name is required';
    else if (!isValidName(formData.nextOfKinLastName)) newErrors.nextOfKinLastName = 'Enter letters only (A-Z), minimum 3 characters';

    if (!formData.relationshipToClient.trim()) newErrors.relationshipToClient = 'Relationship to client is required';

    if (formData.nextOfKinPhone && !isValidPhone(formData.nextOfKinPhone)) {
      newErrors.nextOfKinPhone = 'Enter a valid 11-digit UK phone number';
    } else if (!formData.nextOfKinPhone.trim() || formData.nextOfKinPhone === '0') {
      newErrors.nextOfKinPhone = 'Next of kin phone number is required';
    }

    if (formData.nextOfKinEmail && !isValidEmail(formData.nextOfKinEmail)) {
      newErrors.nextOfKinEmail = 'Enter a valid email address';
    } else if (!formData.nextOfKinEmail.trim()) {
      newErrors.nextOfKinEmail = 'Next of kin email is required';
    }

    if (!formData.nextOfKinAddress.trim()) newErrors.nextOfKinAddress = 'Next of kin address is required';
    if (!formData.nextOfKinRegion.trim()) newErrors.nextOfKinRegion = 'Next of kin region is required';
    if (!formData.nextOfKinCity.trim()) newErrors.nextOfKinCity = 'Next of kin city is required';
    if (!formData.nextOfKinPostcode.trim()) newErrors.nextOfKinPostcode = 'Next of kin postcode is required';

    // Medical background required fields
    if (!formData.dnarInPlace.trim()) newErrors.dnarInPlace = 'DNAR in Place selection is required';
    if (!formData.requiresHelpWithAppointments.trim()) newErrors.requiresHelpWithAppointments = 'Requires Help with Appointments selection is required';
    if (!formData.wantsCompanyToAppointments.trim()) newErrors.wantsCompanyToAppointments = 'Wants Company to Appointments selection is required';

    // Consent required
    if (!formData.consent) newErrors.consent = 'Consent is required to submit the form';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Filter out numbers and special characters for name fields
    if (field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') {
      if (typeof value === 'string') {
        value = value.replace(/[^A-Za-z\s]/g, '');
      }
    }

    // For name fields, only allow A-Z letters and spaces
    if ((field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') && typeof value === 'string') {
      if (!isValidNameInput(value)) {
        return; // Don't update if invalid characters
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (field: string, value: string) => {
    if (value === '' || !value.startsWith('0')) {
      value = '0' + value.replace(/^0*/, '');
    }
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 11) {
      handleInputChange(field, digitsOnly);
    }
  };

  const handleAddressChange = (field: string, value: string, isNextOfKin: boolean = false) => {
    handleInputChange(field, value);
    if ((field === 'address' || field === 'nextOfKinAddress') && value) {
      const timeoutId = setTimeout(() => {
        searchAddresses(value, isNextOfKin);
      }, 300);
      return () => clearTimeout(timeoutId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const assessmentData = {
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

      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/care-assessment-webhook`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(responseData.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`There was an error submitting the form: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowDescription = (field: string, value: string) => {
    if (typeof value !== 'string') return false;

    // Show description when user is typing but hasn't reached 3 valid characters yet
    if (field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') {
      return value.length > 0 && value.length < 3;
    }
    if (field === 'phoneNumber' || field === 'nextOfKinPhone') {
      return value.length > 0 && !isValidPhone(value);
    }
    if (field === 'nextOfKinEmail') {
      return value.length > 0 && !isValidEmail(value);
    }
    return false;
  };

  const getDateOfBirthWarning = () => {
    const { day, month, year } = formData.dateOfBirth;
    const hasDay = !!day;
    const hasMonth = !!month;
    const hasYear = !!year;

    if (!hasDay && !hasMonth && !hasYear) {
      return '';
    }

    const missing = [];
    if (!hasDay) missing.push('day');
    if (!hasMonth) missing.push('month');
    if (!hasYear) missing.push('year');

    if (missing.length === 0) {
      return '';
    }

    if (missing.length === 1) {
      return `Please choose a ${missing[0]}`;
    } else if (missing.length === 2) {
      return `Please choose a ${missing[0]} & a ${missing[1]}`;
    } else {
      return 'Please choose a day, month & year';
    }
  };

  const getClientStartDateWarning = () => {
    const { day, month, year } = formData.clientStartDate;
    const hasDay = !!day;
    const hasMonth = !!month;
    const hasYear = !!year;

    if (!hasDay && !hasMonth && !hasYear) {
      return '';
    }

    const missing = [];
    if (!hasDay) missing.push('day');
    if (!hasMonth) missing.push('month');
    if (!hasYear) missing.push('year');

    if (missing.length === 0) {
      return '';
    }

    if (missing.length === 1) {
      return `Please choose a ${missing[0]}`;
    } else if (missing.length === 2) {
      return `Please choose a ${missing[0]} & a ${missing[1]}`;
    } else {
      return 'Please choose a day, month & year';
    }
  };

  const getFieldDescription = (field: string) => {
    const descriptions = {
      firstName: 'Enter letters only (A-Z), minimum 3 characters',
      lastName: 'Enter letters only (A-Z), minimum 3 characters',
      nextOfKinFirstName: 'Enter letters only (A-Z), minimum 3 characters',
      nextOfKinLastName: 'Enter letters only (A-Z), minimum 3 characters',
      phoneNumber: 'Enter a valid 11-digit UK phone number',
      nextOfKinPhone: 'Enter a valid 11-digit UK phone number',
      nextOfKinEmail: 'Enter a valid email address'
    };
    return descriptions[field as keyof typeof descriptions];
  };

  const getDescriptionForField = (field: string, value: string) => {
    if (!shouldShowDescription(field, value)) return null;

    if (field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') {
      return 'Minimum 3 characters';
    }
    return getFieldDescription(field);
  };

  const shouldShowWarning = (field: string, value: string) => {
    if (typeof value !== 'string') return false;

    // Show warning when there are validation issues
    if (field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') {
      return value.length > 0 && value.length < 3;
    }
    if (field === 'phoneNumber' || field === 'nextOfKinPhone') {
      return value.length > 0 && !isValidPhone(value);
    }
    if (field === 'nextOfKinEmail') {
      return value.length > 0 && !isValidEmail(value);
    }
    return false;
  };

  // Navigation functions
  const handleNext = () => {
    if (currentSectionIndex < sectionNames.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Get progress data and validation status
  const fieldsStatus = getRequiredFieldsStatus(formData, errors);
  
  // Determine which sections should be visible based on completion
  const getVisibleSections = () => {
    const sections = [0]; // Always show first section
    
    if (fieldsStatus.isClientDetailsComplete) {
      sections.push(1);
    }
    if (fieldsStatus.isNextOfKinDetailsComplete && fieldsStatus.isClientDetailsComplete) {
      sections.push(2);
    }
    if (fieldsStatus.isMedicalBackgroundComplete && fieldsStatus.isNextOfKinDetailsComplete && fieldsStatus.isClientDetailsComplete) {
      sections.push(3);
    }
    
    return sections;
  };

  const visibleSections = getVisibleSections();
  const maxVisibleSection = Math.max(...visibleSections);
  
  // Scroll to top whenever section changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [currentSectionIndex]);

  // Auto-advance to next section when requirements are met, but respect manual navigation
  React.useEffect(() => {
    // Only auto-advance if user hasn't manually navigated recently
    const shouldAutoAdvance = lastManualNavigation === null || 
      (Date.now() - (lastManualNavigation || 0)) > 1000; // 1 second delay
    
    if (shouldAutoAdvance && maxVisibleSection > currentSectionIndex) {
      setCurrentSectionIndex(maxVisibleSection);
    }
  }, [maxVisibleSection, currentSectionIndex, lastManualNavigation]);

  // Handle manual back navigation
  const handleBackNavigation = () => {
    setLastManualNavigation(Date.now());
    setHasNavigatedBack(true);
    setCurrentSectionIndex(currentSectionIndex - 1);
  };

  // Handle fast-forward navigation
  const handleNextSectionNavigation = () => {
    setCurrentSectionIndex(currentSectionIndex + 1);
    setHasNavigatedBack(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}>Care Assessment Form</h1>
          <p className="text-lg" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}>Please complete the required fields to help us provide the best care service for you</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentSectionName={sectionNames[currentSectionIndex]}
          completedFields={fieldsStatus.completedRequiredFields}
          totalFields={fieldsStatus.totalRequiredFields}
        />

        {submitSuccess && (
          <div className="mb-8 p-4 bg-green-500/20 rounded-lg backdrop-blur-sm">
            <p className="text-center font-medium" style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}>Form submitted successfully! We will be in touch soon.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Render sections based on visibility and current selection */}
          {currentSectionIndex === 0 && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {currentSectionIndex === 1 && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {currentSectionIndex === 2 && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {currentSectionIndex === 3 && (
            <div className="animate-fade-in">
              <ConsentSection
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            </div>
          )}

          {/* Submit Button - only visible on final section */}
          {currentSectionIndex === 3 && (
            <div className="text-center animate-fade-in">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-800 to-purple-500 hover:from-purple-900 hover:to-purple-600 font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                style={{ fontFamily: 'Montserrat, sans-serif', color: '#FFFFFF' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3" style={{ borderColor: '#FFFFFF' }}></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Assessment
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Fixed Navigation Buttons - Rendered outside the main form container */}
      <FixedFormNavigation
        currentSectionIndex={currentSectionIndex}
        maxVisibleSection={maxVisibleSection}
        hasNavigatedBack={hasNavigatedBack}
        isSubmitting={isSubmitting}
        sectionNames={sectionNames}
        onBackNavigation={handleBackNavigation}
        onNextSectionNavigation={handleNextSectionNavigation}
      />
    </div>
  );
};

export default CareAssessmentForm;