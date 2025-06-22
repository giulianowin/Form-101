import React, { useState } from 'react';
import { User, Heart, FileText, Shield, MapPin, Phone, Mail, Calendar, Users } from 'lucide-react';

interface FormData {
  serviceUserDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    gender: string;
    email: string;
    firstLineOfAddress: string;
    cityRegion: string;
    postcode: string;
    clientStartDate: string;
    allergies: string;
    serviceRequired: string;
  };
  nextOfKinDetails: {
    fullName: string;
    relationshipToClient: string;
    phoneNumber: string;
    email: string;
    firstLineOfAddress: string;
    cityRegion: string;
    postcode: string;
  };
  medicalBackgroundInformation: {
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
  };
  consent: boolean;
}

interface NotApplicableStates {
  [key: string]: boolean;
}

const CareAssessmentForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    serviceUserDetails: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      gender: '',
      email: '',
      firstLineOfAddress: '',
      cityRegion: '',
      postcode: '',
      clientStartDate: '',
      allergies: '',
      serviceRequired: '',
    },
    nextOfKinDetails: {
      fullName: '',
      relationshipToClient: '',
      phoneNumber: '',
      email: '',
      firstLineOfAddress: '',
      cityRegion: '',
      postcode: '',
    },
    medicalBackgroundInformation: {
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
    },
    consent: false,
  });

  const [notApplicable, setNotApplicable] = useState<NotApplicableStates>({
    // Service User Details - non-required fields
    email: false,
    allergies: false,
    serviceRequired: false,
    
    // Next of Kin Details - non-required fields
    nextOfKinEmail: false,
    
    // Medical Background - non-required fields
    medicalHistory: false,
    currentDiagnosis: false,
    hospitalAdmissionHistory: false,
    mobilitySupport: false,
    skinIntegrityNeeds: false,
    dnarInPlace: false,
    requiresHelpWithAppointments: false,
    wantsCompanyToAppointments: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const handleNotApplicableChange = (field: string, checked: boolean) => {
    setNotApplicable(prev => ({
      ...prev,
      [field]: checked
    }));

    // Clear the corresponding form field when N/A is checked
    if (checked) {
      if (field === 'nextOfKinEmail') {
        handleInputChange('nextOfKinDetails', 'email', '');
      } else if (field in formData.serviceUserDetails) {
        handleInputChange('serviceUserDetails', field, '');
      } else if (field in formData.medicalBackgroundInformation) {
        handleInputChange('medicalBackgroundInformation', field, '');
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      // Required fields for Service User Details
      if (!formData.serviceUserDetails.firstName.trim()) {
        newErrors['serviceUserDetails.firstName'] = 'First name is required';
      } else if (!/^[A-Za-z\s'-]+$/.test(formData.serviceUserDetails.firstName)) {
        newErrors['serviceUserDetails.firstName'] = 'Enter letters only (A-Z), minimum 3 characters';
      } else if (formData.serviceUserDetails.firstName.length < 3) {
        newErrors['serviceUserDetails.firstName'] = 'Enter letters only (A-Z), minimum 3 characters';
      }

      if (!formData.serviceUserDetails.lastName.trim()) {
        newErrors['serviceUserDetails.lastName'] = 'Last name is required';
      }

      if (!formData.serviceUserDetails.dateOfBirth) {
        newErrors['serviceUserDetails.dateOfBirth'] = 'Date of birth is required';
      }

      if (!formData.serviceUserDetails.phoneNumber.trim()) {
        newErrors['serviceUserDetails.phoneNumber'] = 'Phone number is required';
      } else if (!/^(\+44|0)[1-9]\d{8,9}$/.test(formData.serviceUserDetails.phoneNumber.replace(/\s/g, ''))) {
        newErrors['serviceUserDetails.phoneNumber'] = 'Enter a valid 11-digit UK phone number';
      }

      if (!formData.serviceUserDetails.gender) {
        newErrors['serviceUserDetails.gender'] = 'Gender is required';
      }

      if (!formData.serviceUserDetails.firstLineOfAddress.trim()) {
        newErrors['serviceUserDetails.firstLineOfAddress'] = 'First line of address is required';
      }

      if (!formData.serviceUserDetails.cityRegion.trim()) {
        newErrors['serviceUserDetails.cityRegion'] = 'City/Region is required';
      }

      if (!formData.serviceUserDetails.postcode.trim()) {
        newErrors['serviceUserDetails.postcode'] = 'Postcode is required';
      }

      if (!formData.serviceUserDetails.clientStartDate) {
        newErrors['serviceUserDetails.clientStartDate'] = 'Client start date is required';
      }
    }

    if (step === 2) {
      // Required fields for Next of Kin Details
      if (!formData.nextOfKinDetails.fullName.trim()) {
        newErrors['nextOfKinDetails.fullName'] = 'Full name is required';
      }

      if (!formData.nextOfKinDetails.relationshipToClient.trim()) {
        newErrors['nextOfKinDetails.relationshipToClient'] = 'Relationship to client is required';
      }

      if (!formData.nextOfKinDetails.phoneNumber.trim()) {
        newErrors['nextOfKinDetails.phoneNumber'] = 'Phone number is required';
      } else if (!/^(\+44|0)[1-9]\d{8,9}$/.test(formData.nextOfKinDetails.phoneNumber.replace(/\s/g, ''))) {
        newErrors['nextOfKinDetails.phoneNumber'] = 'Enter a valid 11-digit UK phone number';
      }

      if (!formData.nextOfKinDetails.firstLineOfAddress.trim()) {
        newErrors['nextOfKinDetails.firstLineOfAddress'] = 'First line of address is required';
      }

      if (!formData.nextOfKinDetails.cityRegion.trim()) {
        newErrors['nextOfKinDetails.cityRegion'] = 'City/Region is required';
      }

      if (!formData.nextOfKinDetails.postcode.trim()) {
        newErrors['nextOfKinDetails.postcode'] = 'Postcode is required';
      }
    }

    if (step === 4) {
      // Consent is required
      if (!formData.consent) {
        newErrors['consent'] = 'You must provide consent to proceed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldValue = (section: keyof FormData, field: string, naField?: string): string => {
    const isNA = naField && notApplicable[naField];
    if (isNA) return 'N/A';
    
    const value = (formData[section] as any)[field];
    
    // Handle empty dropdowns for Care Visit fields
    if ((field === 'careVisitFrequency' || field === 'careVisitDuration') && (!value || value === '')) {
      return 'N/A';
    }
    
    return value || '';
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare the data with N/A values where applicable
      const submissionData = {
        serviceUserDetails: {
          firstName: formData.serviceUserDetails.firstName,
          lastName: formData.serviceUserDetails.lastName,
          dateOfBirth: formData.serviceUserDetails.dateOfBirth,
          phoneNumber: formData.serviceUserDetails.phoneNumber,
          gender: formData.serviceUserDetails.gender,
          address: formData.serviceUserDetails.firstLineOfAddress,
          postcode: formData.serviceUserDetails.postcode,
          clientStartDate: formData.serviceUserDetails.clientStartDate,
          allergies: getFieldValue('serviceUserDetails', 'allergies', 'allergies'),
          serviceRequired: getFieldValue('serviceUserDetails', 'serviceRequired', 'serviceRequired'),
        },
        nextOfKinDetails: {
          fullName: formData.nextOfKinDetails.fullName,
          relationshipToClient: formData.nextOfKinDetails.relationshipToClient,
          phoneNumber: formData.nextOfKinDetails.phoneNumber,
          email: getFieldValue('nextOfKinDetails', 'email', 'nextOfKinEmail'),
          address: formData.nextOfKinDetails.firstLineOfAddress,
          postcode: formData.nextOfKinDetails.postcode,
        },
        medicalBackgroundInformation: {
          medicalHistory: getFieldValue('medicalBackgroundInformation', 'medicalHistory', 'medicalHistory'),
          currentDiagnosis: getFieldValue('medicalBackgroundInformation', 'currentDiagnosis', 'currentDiagnosis'),
          hospitalAdmissionHistory: getFieldValue('medicalBackgroundInformation', 'hospitalAdmissionHistory', 'hospitalAdmissionHistory'),
          mobilitySupport: getFieldValue('medicalBackgroundInformation', 'mobilitySupport', 'mobilitySupport'),
          skinIntegrityNeeds: getFieldValue('medicalBackgroundInformation', 'skinIntegrityNeeds', 'skinIntegrityNeeds'),
          dnarInPlace: getFieldValue('medicalBackgroundInformation', 'dnarInPlace', 'dnarInPlace'),
          careVisitFrequency: getFieldValue('medicalBackgroundInformation', 'careVisitFrequency'),
          careVisitDuration: getFieldValue('medicalBackgroundInformation', 'careVisitDuration'),
          requiresHelpWithAppointments: getFieldValue('medicalBackgroundInformation', 'requiresHelpWithAppointments', 'requiresHelpWithAppointments'),
          wantsCompanyToAppointments: getFieldValue('medicalBackgroundInformation', 'wantsCompanyToAppointments', 'wantsCompanyToAppointments'),
        },
        consent: formData.consent,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch('/functions/v1/care-assessment-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Care assessment submitted successfully!');
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Failed to submit care assessment. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderNotApplicableCheckbox = (field: string, label: string) => (
    <div className="flex items-center space-x-2 mt-2">
      <div className="relative">
        <input
          type="checkbox"
          id={`na-${field}`}
          checked={notApplicable[field] || false}
          onChange={(e) => handleNotApplicableChange(field, e.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor={`na-${field}`}
          className={`flex items-center justify-center w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 ${
            notApplicable[field]
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-400 hover:border-blue-400'
          }`}
        >
          {notApplicable[field] && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </label>
      </div>
      <label htmlFor={`na-${field}`} className="text-sm text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <User className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Client Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceUserDetails.firstName}
            onChange={(e) => handleInputChange('serviceUserDetails', 'firstName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter first name"
          />
          {errors['serviceUserDetails.firstName'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.firstName']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceUserDetails.lastName}
            onChange={(e) => handleInputChange('serviceUserDetails', 'lastName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter last name"
          />
          {errors['serviceUserDetails.lastName'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.lastName']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date of Birth <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={formData.serviceUserDetails.dateOfBirth}
          onChange={(e) => handleInputChange('serviceUserDetails', 'dateOfBirth', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {errors['serviceUserDetails.dateOfBirth'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.dateOfBirth']}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={formData.serviceUserDetails.phoneNumber}
            onChange={(e) => handleInputChange('serviceUserDetails', 'phoneNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="044 1234 567890"
          />
          {errors['serviceUserDetails.phoneNumber'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.phoneNumber']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.serviceUserDetails.gender}
            onChange={(e) => handleInputChange('serviceUserDetails', 'gender', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Please Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors['serviceUserDetails.gender'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.gender']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          Email Address
        </label>
        <input
          type="email"
          value={notApplicable.email ? '' : formData.serviceUserDetails.email}
          onChange={(e) => handleInputChange('serviceUserDetails', 'email', e.target.value)}
          disabled={notApplicable.email}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter email address"
        />
        {renderNotApplicableCheckbox('email', 'Not applicable')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            First Line of Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceUserDetails.firstLineOfAddress}
            onChange={(e) => handleInputChange('serviceUserDetails', 'firstLineOfAddress', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="45 Anderson Close"
          />
          {errors['serviceUserDetails.firstLineOfAddress'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.firstLineOfAddress']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Postcode <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceUserDetails.postcode}
            onChange={(e) => handleInputChange('serviceUserDetails', 'postcode', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="IP6 8UB"
          />
          {errors['serviceUserDetails.postcode'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.postcode']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          City/Region <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.serviceUserDetails.cityRegion}
          onChange={(e) => handleInputChange('serviceUserDetails', 'cityRegion', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Ipswich"
        />
        {errors['serviceUserDetails.cityRegion'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.cityRegion']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Client Start Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={formData.serviceUserDetails.clientStartDate}
          onChange={(e) => handleInputChange('serviceUserDetails', 'clientStartDate', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {errors['serviceUserDetails.clientStartDate'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['serviceUserDetails.clientStartDate']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Allergies
        </label>
        <textarea
          value={notApplicable.allergies ? '' : formData.serviceUserDetails.allergies}
          onChange={(e) => handleInputChange('serviceUserDetails', 'allergies', e.target.value)}
          disabled={notApplicable.allergies}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="List any known allergies..."
        />
        {renderNotApplicableCheckbox('allergies', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Service Required
        </label>
        <textarea
          value={notApplicable.serviceRequired ? '' : formData.serviceUserDetails.serviceRequired}
          onChange={(e) => handleInputChange('serviceUserDetails', 'serviceRequired', e.target.value)}
          disabled={notApplicable.serviceRequired}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Describe the service required..."
        />
        {renderNotApplicableCheckbox('serviceRequired', 'Not applicable')}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Users className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Next of Kin Details</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.nextOfKinDetails.fullName}
          onChange={(e) => handleInputChange('nextOfKinDetails', 'fullName', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter full name"
        />
        {errors['nextOfKinDetails.fullName'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.fullName']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Relationship to Client <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.nextOfKinDetails.relationshipToClient}
          onChange={(e) => handleInputChange('nextOfKinDetails', 'relationshipToClient', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="e.g., Son, Daughter, Spouse"
        />
        {errors['nextOfKinDetails.relationshipToClient'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.relationshipToClient']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          Phone Number <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          value={formData.nextOfKinDetails.phoneNumber}
          onChange={(e) => handleInputChange('nextOfKinDetails', 'phoneNumber', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="044 1234 567890"
        />
        {errors['nextOfKinDetails.phoneNumber'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.phoneNumber']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          Email Address
        </label>
        <input
          type="email"
          value={notApplicable.nextOfKinEmail ? '' : formData.nextOfKinDetails.email}
          onChange={(e) => handleInputChange('nextOfKinDetails', 'email', e.target.value)}
          disabled={notApplicable.nextOfKinEmail}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter email address"
        />
        {renderNotApplicableCheckbox('nextOfKinEmail', 'Not applicable')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            First Line of Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinDetails.firstLineOfAddress}
            onChange={(e) => handleInputChange('nextOfKinDetails', 'firstLineOfAddress', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="45 Anderson Close"
          />
          {errors['nextOfKinDetails.firstLineOfAddress'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.firstLineOfAddress']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Postcode <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinDetails.postcode}
            onChange={(e) => handleInputChange('nextOfKinDetails', 'postcode', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="IP6 8UB"
          />
          {errors['nextOfKinDetails.postcode'] && (
            <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.postcode']}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          City/Region <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.nextOfKinDetails.cityRegion}
          onChange={(e) => handleInputChange('nextOfKinDetails', 'cityRegion', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Ipswich"
        />
        {errors['nextOfKinDetails.cityRegion'] && (
          <p className="mt-1 text-sm text-yellow-400">{errors['nextOfKinDetails.cityRegion']}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Heart className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Medical Background Information</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Medical History
        </label>
        <textarea
          value={notApplicable.medicalHistory ? '' : formData.medicalBackgroundInformation.medicalHistory}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'medicalHistory', e.target.value)}
          disabled={notApplicable.medicalHistory}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Describe medical history..."
        />
        {renderNotApplicableCheckbox('medicalHistory', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Current Diagnosis
        </label>
        <textarea
          value={notApplicable.currentDiagnosis ? '' : formData.medicalBackgroundInformation.currentDiagnosis}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'currentDiagnosis', e.target.value)}
          disabled={notApplicable.currentDiagnosis}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Current medical diagnosis..."
        />
        {renderNotApplicableCheckbox('currentDiagnosis', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Hospital Admission History
        </label>
        <textarea
          value={notApplicable.hospitalAdmissionHistory ? '' : formData.medicalBackgroundInformation.hospitalAdmissionHistory}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'hospitalAdmissionHistory', e.target.value)}
          disabled={notApplicable.hospitalAdmissionHistory}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Recent hospital admissions..."
        />
        {renderNotApplicableCheckbox('hospitalAdmissionHistory', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mobility Support
        </label>
        <textarea
          value={notApplicable.mobilitySupport ? '' : formData.medicalBackgroundInformation.mobilitySupport}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'mobilitySupport', e.target.value)}
          disabled={notApplicable.mobilitySupport}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Mobility assistance required..."
        />
        {renderNotApplicableCheckbox('mobilitySupport', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Skin Integrity Needs
        </label>
        <textarea
          value={notApplicable.skinIntegrityNeeds ? '' : formData.medicalBackgroundInformation.skinIntegrityNeeds}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'skinIntegrityNeeds', e.target.value)}
          disabled={notApplicable.skinIntegrityNeeds}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Skin care requirements..."
        />
        {renderNotApplicableCheckbox('skinIntegrityNeeds', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          DNAR in Place
        </label>
        <textarea
          value={notApplicable.dnarInPlace ? '' : formData.medicalBackgroundInformation.dnarInPlace}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'dnarInPlace', e.target.value)}
          disabled={notApplicable.dnarInPlace}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="DNAR status..."
        />
        {renderNotApplicableCheckbox('dnarInPlace', 'Not applicable')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Care Visit Frequency
          </label>
          <select
            value={formData.medicalBackgroundInformation.careVisitFrequency}
            onChange={(e) => handleInputChange('medicalBackgroundInformation', 'careVisitFrequency', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Please Select</option>
            <option value="daily">Daily</option>
            <option value="twice-daily">Twice Daily</option>
            <option value="three-times-daily">Three Times Daily</option>
            <option value="four-times-daily">Four Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Care Visit Duration
          </label>
          <select
            value={formData.medicalBackgroundInformation.careVisitDuration}
            onChange={(e) => handleInputChange('medicalBackgroundInformation', 'careVisitDuration', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Please Select</option>
            <option value="15-minutes">15 minutes</option>
            <option value="30-minutes">30 minutes</option>
            <option value="45-minutes">45 minutes</option>
            <option value="1-hour">1 hour</option>
            <option value="1.5-hours">1.5 hours</option>
            <option value="2-hours">2 hours</option>
            <option value="3-hours">3 hours</option>
            <option value="4-hours">4 hours</option>
            <option value="overnight">Overnight</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Requires Help with Appointments
        </label>
        <textarea
          value={notApplicable.requiresHelpWithAppointments ? '' : formData.medicalBackgroundInformation.requiresHelpWithAppointments}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'requiresHelpWithAppointments', e.target.value)}
          disabled={notApplicable.requiresHelpWithAppointments}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Assistance needed with appointments..."
        />
        {renderNotApplicableCheckbox('requiresHelpWithAppointments', 'Not applicable')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Wants Company to Appointments
        </label>
        <textarea
          value={notApplicable.wantsCompanyToAppointments ? '' : formData.medicalBackgroundInformation.wantsCompanyToAppointments}
          onChange={(e) => handleInputChange('medicalBackgroundInformation', 'wantsCompanyToAppointments', e.target.value)}
          disabled={notApplicable.wantsCompanyToAppointments}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Companionship preferences for appointments..."
        />
        {renderNotApplicableCheckbox('wantsCompanyToAppointments', 'Not applicable')}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Shield className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Consent & Submit</h2>
      </div>

      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
            className="mt-1 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="consent" className="text-sm text-gray-300 leading-relaxed">
            I consent to the processing of my personal data for the purpose of this care assessment and service provision. <span className="text-red-400">*</span>
          </label>
        </div>
        {errors['consent'] && (
          <p className="mt-2 text-sm text-yellow-400">{errors['consent']}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-400 font-medium">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 font-medium">{submitMessage}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !formData.consent}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit Care Assessment'
        )}
      </button>
    </div>
  );

  const steps = [
    { number: 1, title: 'Client Details', icon: User },
    { number: 2, title: 'Next of Kin', icon: Users },
    { number: 3, title: 'Medical Background', icon: Heart },
    { number: 4, title: 'Consent & Submit', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Care Assessment Form</h1>
          <p className="text-gray-300">Please complete all sections to submit your care assessment</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : isCompleted 
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-600 text-gray-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 ${isCompleted ? 'bg-green-600' : 'bg-gray-600'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Next Step
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex justify-start mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareAssessmentForm;