import React, { useState } from 'react';
import { User, Heart, FileText, Send, Calendar, Phone, MapPin, Mail } from 'lucide-react';

// Validation helpers - moved outside component to be accessible by shouldShowWarning
const isValidName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
const isValidNameInput = (name: string) => /^[A-Za-z\s]*$/.test(name);
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (phone: string) => /^0\d{10}$/.test(phone.replace(/\s/g, ''));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Care Assessment Form</h1>
            <p className="text-slate-300 text-lg">Please complete the required fields to help us provide the best care service for you</p>
          </div>

          {submitSuccess && (
            <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-green-300 text-center font-medium">Form submitted successfully! We will be in touch soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service User Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Client Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter first name"
                  />
                  {getDescriptionForField('firstName', formData.firstName) && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('firstName', formData.firstName)}</p>
                  )}
                  {errors.firstName && <p className="text-yellow-400 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter last name"
                  />
                  {getDescriptionForField('lastName', formData.lastName) && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('lastName', formData.lastName)}</p>
                  )}
                  {errors.lastName && <p className="text-yellow-400 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      value={formData.dateOfBirth.day}
                      onChange={(e) => handleDateChange('dateOfBirth', 'day', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Day</option>
                      {dayOptions.map(day => (
                        <option key={day} value={day} className="bg-slate-800">{day}</option>
                      ))}
                    </select>
                    <select
                      value={formData.dateOfBirth.month}
                      onChange={(e) => handleDateChange('dateOfBirth', 'month', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Month</option>
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value} className="bg-slate-800">{month.label}</option>
                      ))}
                    </select>
                    <select
                      value={formData.dateOfBirth.year}
                      onChange={(e) => handleDateChange('dateOfBirth', 'year', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Year</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year} className="bg-slate-800">{year}</option>
                      ))}
                    </select>
                  </div>
                  {getDateOfBirthWarning() && (
                    <p className="text-yellow-400 text-sm mt-1">{getDateOfBirthWarning()}</p>
                  )}
                  {errors.dateOfBirth && <p className="text-yellow-400 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="01234567890"
                  />
                  {focusedField === 'phoneNumber' && getFieldDescription('phoneNumber') && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('phoneNumber', formData.phoneNumber)}</p>
                  )}
                  {errors.phoneNumber && <p className="text-yellow-400 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {genderOptions.map(gender => (
                      <option key={gender} value={gender} className="bg-slate-800">{gender}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-yellow-400 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    First Line of Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleAddressChange('address', e.target.value, false)}
                    onFocus={() => formData.address && setShowAddressSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Start typing your address..."
                  />
                  {errors.address && <p className="text-yellow-400 text-sm mt-1">{errors.address}</p>}
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl max-h-60 overflow-y-auto">
                      {addressSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          onClick={() => selectAddress(suggestion, false)}
                          className="px-4 py-3 hover:bg-blue-500/30 cursor-pointer text-white border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-medium text-white">{suggestion.text}</div>
                          <div className="text-sm text-slate-300">{suggestion.place_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Region <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="e.g., England, Scotland, Wales, Northern Ireland"
                  />
                  {errors.region && <p className="text-yellow-400 text-sm mt-1">{errors.region}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-yellow-400 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Postcode <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter postcode"
                  />
                  {errors.postcode && <p className="text-yellow-400 text-sm mt-1">{errors.postcode}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Client Start Date
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      value={formData.clientStartDate.day}
                      onChange={(e) => handleDateChange('clientStartDate', 'day', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Day</option>
                      {dayOptions.map(day => (
                        <option key={day} value={day} className="bg-slate-800">{day}</option>
                      ))}
                    </select>
                    <select
                      value={formData.clientStartDate.month}
                      onChange={(e) => handleDateChange('clientStartDate', 'month', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Month</option>
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value} className="bg-slate-800">{month.label}</option>
                      ))}
                    </select>
                    <select
                      value={formData.clientStartDate.year}
                      onChange={(e) => handleDateChange('clientStartDate', 'year', e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    >
                      <option value="" className="bg-slate-800">Year</option>
                      {Array.from({ length: 10 }, (_, i) => String(currentYear + i)).map(year => (
                        <option key={year} value={year} className="bg-slate-800">{year}</option>
                      ))}
                    </select>
                  </div>
                  {getClientStartDateWarning() && (
                    <p className="text-yellow-400 text-sm mt-1">{getClientStartDateWarning()}</p>
                  )}
                  {errors.clientStartDate && <p className="text-yellow-400 text-sm mt-1">{errors.clientStartDate}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Allergies <span className="text-red-400">*</span>
                  </label>
                  
                  {/* Allergy Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {Object.keys(allergyOptions).map((option) => (
                      <div key={option} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`allergy-${option}`}
                          checked={allergyOptions[option]}
                          onChange={(e) => handleAllergyOptionChange(option, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`allergy-${option}`} className="text-slate-200 text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none"
                    placeholder="Select common allergies above or describe other allergies here. Write 'None' if no allergies"
                  />
                  {errors.allergies && <p className="text-yellow-400 text-sm mt-1">{errors.allergies}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    What service would you require? <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.serviceRequired}
                    onChange={(e) => handleInputChange('serviceRequired', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {serviceOptions.map(service => (
                      <option key={service} value={service} className="bg-slate-800">{service}</option>
                    ))}
                  </select>
                  {errors.serviceRequired && <p className="text-yellow-400 text-sm mt-1">{errors.serviceRequired}</p>}
                </div>
              </div>
            </div>

            {/* Next of Kin Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-pink-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Next of Kin Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">  
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinFirstName}
                    onChange={(e) => handleInputChange('nextOfKinFirstName', e.target.value)}
                    onFocus={() => setFocusedField('nextOfKinFirstName')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter first name"
                  />
                  {shouldShowWarning('nextOfKinFirstName', formData.nextOfKinFirstName) && (
                    <p className="text-yellow-400 text-sm mt-1">Minimum 3 characters</p>
                  )}
                  {focusedField === 'nextOfKinFirstName' && getFieldDescription('nextOfKinFirstName') && !shouldShowWarning('nextOfKinFirstName', formData.nextOfKinFirstName) && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('nextOfKinFirstName', formData.nextOfKinFirstName)}</p>
                  )}
                  {errors.nextOfKinFirstName && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinFirstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinLastName}
                    onChange={(e) => handleInputChange('nextOfKinLastName', e.target.value)}
                    onFocus={() => setFocusedField('nextOfKinLastName')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter last name"
                  />
                  {shouldShowWarning('nextOfKinLastName', formData.nextOfKinLastName) && (
                    <p className="text-yellow-400 text-sm mt-1">Minimum 3 characters</p>
                  )}
                  {focusedField === 'nextOfKinLastName' && getFieldDescription('nextOfKinLastName') && !shouldShowWarning('nextOfKinLastName', formData.nextOfKinLastName) && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('nextOfKinLastName', formData.nextOfKinLastName)}</p>
                  )}
                  {errors.nextOfKinLastName && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinLastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Relationship to Client <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.relationshipToClient}
                    onChange={(e) => handleInputChange('relationshipToClient', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {relationshipOptions.map(relationship => (
                      <option key={relationship} value={relationship} className="bg-slate-800">{relationship}</option>
                    ))}
                  </select>
                  {errors.relationshipToClient && <p className="text-yellow-400 text-sm mt-1">{errors.relationshipToClient}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.nextOfKinPhone}
                    onChange={(e) => handlePhoneChange('nextOfKinPhone', e.target.value)}
                    onFocus={() => setFocusedField('nextOfKinPhone')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="01234567890"
                  />
                  {focusedField === 'nextOfKinPhone' && getFieldDescription('nextOfKinPhone') && (
                    <p className="text-yellow-400 text-sm mt-1">{getFieldDescription('nextOfKinPhone')}</p>
                  )}
                  {errors.nextOfKinPhone && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.nextOfKinEmail}
                    onChange={(e) => handleInputChange('nextOfKinEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter email address"
                  />
                  {getDescriptionForField('nextOfKinEmail', formData.nextOfKinEmail) && (
                    <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('nextOfKinEmail', formData.nextOfKinEmail)}</p>
                  )}
                  {errors.nextOfKinEmail && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinEmail}</p>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    First Line of Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinAddress}
                    onChange={(e) => handleAddressChange('nextOfKinAddress', e.target.value, true)}
                    onFocus={() => formData.nextOfKinAddress && setShowNextOfKinAddressSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowNextOfKinAddressSuggestions(false), 200)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Start typing your address..."
                  />
                  {showNextOfKinAddressSuggestions && nextOfKinAddressSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl max-h-60 overflow-y-auto">
                      {nextOfKinAddressSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          onClick={() => selectAddress(suggestion, true)}
                          className="px-4 py-3 hover:bg-blue-500/30 cursor-pointer text-white border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-medium text-white">{suggestion.text}</div>
                          <div className="text-sm text-slate-300">{suggestion.place_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.nextOfKinAddress && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Region <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinRegion}
                    onChange={(e) => handleInputChange('nextOfKinRegion', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="e.g., England, Scotland, Wales, Northern Ireland"
                  />
                  {errors.nextOfKinRegion && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinRegion}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinCity}
                    onChange={(e) => handleInputChange('nextOfKinCity', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter city"
                  />
                  {errors.nextOfKinCity && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Postcode <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextOfKinPostcode}
                    onChange={(e) => handleInputChange('nextOfKinPostcode', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                    placeholder="Enter postcode"
                  />
                  {errors.nextOfKinPostcode && <p className="text-yellow-400 text-sm mt-1">{errors.nextOfKinPostcode}</p>}
                </div>
              </div>
            </div>

            {/* Medical Background */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Client Medical Background</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none"
                    placeholder="Please provide details of medical history"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Current Diagnosis
                  </label>
                  <textarea
                    value={formData.currentDiagnosis}
                    onChange={(e) => handleInputChange('currentDiagnosis', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none"
                    placeholder="Please provide current diagnosis details"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Hospital Admission History
                  </label>
                  <textarea
                    value={formData.hospitalAdmissionHistory}
                    onChange={(e) => handleInputChange('hospitalAdmissionHistory', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none"
                    placeholder="Please provide hospital admission history"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Mobility Support
                  </label>
                  
                  {/* Checkboxes for mobility options */}
                  <div className="mb-3 space-y-2">
                    {Object.entries(mobilityOptions).map(([option, checked]) => (
                      <div key={option} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`mobility-${option.replace(/\s+/g, '-').toLowerCase()}`}
                          checked={checked}
                          onChange={(e) => handleMobilityOptionChange(option, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label 
                          htmlFor={`mobility-${option.replace(/\s+/g, '-').toLowerCase()}`}
                          className="text-slate-200 text-sm cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Multi-line text area */}
                  <textarea
                    value={formData.mobilitySupport}
                    onChange={(e) => handleInputChange('mobilitySupport', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none"
                    placeholder="Select from options above or provide additional details about mobility support needs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Skin Integrity Needs
                  </label>
                  <div className="space-y-3">
                    {Object.entries(skinIntegrityOptions).map(([option, checked]) => (
                      <label key={option} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleSkinIntegrityOptionChange(option, e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                        />
                        <span className="text-slate-200 text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={formData.skinIntegrityNeeds}
                    onChange={(e) => handleInputChange('skinIntegrityNeeds', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none mt-3"
                    placeholder="Select options above or add additional details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    DNAR in Place <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.dnarInPlace}
                    onChange={(e) => handleInputChange('dnarInPlace', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {yesNoOptions.map(option => (
                      <option key={option} value={option} className="bg-slate-800">{option}</option>
                    ))}
                  </select>
                  {errors.dnarInPlace && <p className="text-yellow-400 text-sm mt-1">{errors.dnarInPlace}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Care Visit Frequency
                  </label>
                  <select
                    value={formData.careVisitFrequency}
                    onChange={(e) => handleInputChange('careVisitFrequency', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {careVisitFrequencyOptions.map(frequency => (
                      <option key={frequency} value={frequency} className="bg-slate-800">{frequency}</option>
                    ))}
                  </select>
                  {errors.careVisitFrequency && <p className="text-yellow-400 text-sm mt-1">{errors.careVisitFrequency}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Care Visit Duration
                  </label>
                  <select
                    value={formData.careVisitDuration}
                    onChange={(e) => handleInputChange('careVisitDuration', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {careVisitDurationOptions.map(duration => (
                      <option key={duration} value={duration} className="bg-slate-800">{duration}</option>
                    ))}
                  </select>
                  {errors.careVisitDuration && <p className="text-yellow-400 text-sm mt-1">{errors.careVisitDuration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Requires Help with Appointments <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.requiresHelpWithAppointments}
                    onChange={(e) => handleInputChange('requiresHelpWithAppointments', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {yesNoOptions.map(option => (
                      <option key={option} value={option} className="bg-slate-800">{option}</option>
                    ))}
                  </select>
                  {errors.requiresHelpWithAppointments && <p className="text-yellow-400 text-sm mt-1">{errors.requiresHelpWithAppointments}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Wants Company to Appointments <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.wantsCompanyToAppointments}
                    onChange={(e) => handleInputChange('wantsCompanyToAppointments', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
                  >
                    <option value="" className="bg-slate-800">Please Select</option>
                    {yesNoOptions.map(option => (
                      <option key={option} value={option} className="bg-slate-800">{option}</option>
                    ))}
                  </select>
                  {errors.wantsCompanyToAppointments && <p className="text-yellow-400 text-sm mt-1">{errors.wantsCompanyToAppointments}</p>}
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => handleInputChange('consent', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="consent" className="text-slate-200 text-sm">
                  I consent to the processing of my personal data for the purpose of this care assessment and service provision. <span className="text-red-400">*</span>
                </label>
              </div>
              {errors.consent && <p className="text-yellow-400 text-sm mt-1">{errors.consent}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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
          </form>
        </div>
      </div>
    </div>
  );
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

export default CareAssessmentForm;