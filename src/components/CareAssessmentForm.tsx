import React, { useState } from 'react';
import { User, Users, FileText, CheckCircle, Heart, Calendar, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

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

interface NotApplicableStates {
  careVisitFrequency: boolean;
  careVisitDuration: boolean;
  mobilitySupport: boolean;
  skinIntegrityNeeds: boolean;
  hospitalAdmissionHistory: boolean;
  clientStartDate: boolean;
}

const CareAssessmentForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
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

  const [notApplicable, setNotApplicable] = useState<NotApplicableStates>({
    careVisitFrequency: false,
    careVisitDuration: false,
    mobilitySupport: false,
    skinIntegrityNeeds: false,
    hospitalAdmissionHistory: false,
    clientStartDate: false
  });

  const handleNotApplicableChange = (field: keyof NotApplicableStates) => {
    setNotApplicable(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // Clear field values when N/A is selected
    if (field === 'careVisitFrequency' || field === 'careVisitDuration') {
      setMedicalBackgroundInformation(prev => ({
        ...prev,
        [field]: !notApplicable[field] ? '' : prev[field]
      }));
    } else if (field === 'mobilitySupport' || field === 'skinIntegrityNeeds' || field === 'hospitalAdmissionHistory') {
      setMedicalBackgroundInformation(prev => ({
        ...prev,
        [field]: !notApplicable[field] ? '' : prev[field]
      }));
    } else if (field === 'clientStartDate') {
      setServiceUserDetails(prev => ({
        ...prev,
        clientStartDate: !notApplicable[field] ? '' : prev.clientStartDate
      }));
    }
  };

  const renderNotApplicableCheckbox = (field: keyof NotApplicableStates, label: string) => (
    <div className="flex items-center mt-2">
      <button
        type="button"
        onClick={() => handleNotApplicableChange(field)}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
          notApplicable[field] 
            ? 'bg-indigo-600 border-indigo-600' 
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {notApplicable[field] && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </button>
      <label className="ml-2 text-sm text-gray-600 cursor-pointer" onClick={() => handleNotApplicableChange(field)}>
        {label}
      </label>
    </div>
  );

  const getFieldValue = (section: string, field: string, naField?: keyof NotApplicableStates) => {
    let value = '';
    
    if (section === 'serviceUserDetails') {
      value = serviceUserDetails[field as keyof ServiceUserDetails];
    } else if (section === 'nextOfKinDetails') {
      value = nextOfKinDetails[field as keyof NextOfKinDetails];
    } else if (section === 'medicalBackgroundInformation') {
      value = medicalBackgroundInformation[field as keyof MedicalBackgroundInformation];
    }
    
    // Return "N/A" if field is empty or if "Not Applicable" is checked
    if (naField && (notApplicable[naField] || !value.trim())) {
      return 'N/A';
    }
    
    return value || (naField ? 'N/A' : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      alert('Please provide consent to submit the form.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submissionData = {
        serviceUserDetails: {
          firstName: serviceUserDetails.firstName,
          lastName: serviceUserDetails.lastName,
          dateOfBirth: serviceUserDetails.dateOfBirth,
          phoneNumber: serviceUserDetails.phoneNumber,
          gender: serviceUserDetails.gender,
          address: serviceUserDetails.address,
          postcode: serviceUserDetails.postcode,
          clientStartDate: getFieldValue('serviceUserDetails', 'clientStartDate', 'clientStartDate'),
          allergies: serviceUserDetails.allergies,
          serviceRequired: serviceUserDetails.serviceRequired
        },
        nextOfKinDetails: {
          fullName: nextOfKinDetails.fullName,
          relationshipToClient: nextOfKinDetails.relationshipToClient,
          phoneNumber: nextOfKinDetails.phoneNumber,
          email: nextOfKinDetails.email,
          address: nextOfKinDetails.address,
          postcode: nextOfKinDetails.postcode
        },
        medicalBackgroundInformation: {
          medicalHistory: medicalBackgroundInformation.medicalHistory,
          currentDiagnosis: medicalBackgroundInformation.currentDiagnosis,
          hospitalAdmissionHistory: getFieldValue('medicalBackgroundInformation', 'hospitalAdmissionHistory', 'hospitalAdmissionHistory'),
          mobilitySupport: getFieldValue('medicalBackgroundInformation', 'mobilitySupport', 'mobilitySupport'),
          skinIntegrityNeeds: getFieldValue('medicalBackgroundInformation', 'skinIntegrityNeeds', 'skinIntegrityNeeds'),
          dnarInPlace: medicalBackgroundInformation.dnarInPlace,
          careVisitFrequency: getFieldValue('medicalBackgroundInformation', 'careVisitFrequency', 'careVisitFrequency'),
          careVisitDuration: getFieldValue('medicalBackgroundInformation', 'careVisitDuration', 'careVisitDuration'),
          requiresHelpWithAppointments: medicalBackgroundInformation.requiresHelpWithAppointments,
          wantsCompanyToAppointments: medicalBackgroundInformation.wantsCompanyToAppointments
        },
        consent: consent,
        submittedAt: new Date().toISOString()
      };

      // Call the Supabase edge function
      const response = await fetch('/functions/v1/care-assessment-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Form submitted successfully!');
        // Reset form
        setServiceUserDetails({
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
        setNextOfKinDetails({
          fullName: '',
          relationshipToClient: '',
          phoneNumber: '',
          email: '',
          address: '',
          postcode: ''
        });
        setMedicalBackgroundInformation({
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
        setNotApplicable({
          careVisitFrequency: false,
          careVisitDuration: false,
          mobilitySupport: false,
          skinIntegrityNeeds: false,
          hospitalAdmissionHistory: false,
          clientStartDate: false
        });
        setConsent(false);
        setCurrentStep(1);
      } else {
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <User className="w-16 h-16 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Service User Details</h2>
        <p className="text-gray-600 mt-2">Please provide the basic information about the service user</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serviceUserDetails.firstName}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, firstName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serviceUserDetails.lastName}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, lastName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={serviceUserDetails.dateOfBirth}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, dateOfBirth: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={serviceUserDetails.phoneNumber}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, phoneNumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={serviceUserDetails.gender}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, gender: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Start Date
          </label>
          <input
            type="date"
            value={serviceUserDetails.clientStartDate}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, clientStartDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={notApplicable.clientStartDate}
          />
          {renderNotApplicableCheckbox('clientStartDate', 'Not applicable')}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serviceUserDetails.address}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, address: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serviceUserDetails.postcode}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, postcode: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Allergies <span className="text-red-500">*</span>
          </label>
          <textarea
            value={serviceUserDetails.allergies}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, allergies: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Please list any known allergies or write 'None' if no allergies"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Required <span className="text-red-500">*</span>
          </label>
          <select
            value={serviceUserDetails.serviceRequired}
            onChange={(e) => setServiceUserDetails({...serviceUserDetails, serviceRequired: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="personal-care">Personal Care</option>
            <option value="domestic-support">Domestic Support</option>
            <option value="companionship">Companionship</option>
            <option value="medication-support">Medication Support</option>
            <option value="complex-care">Complex Care</option>
            <option value="respite-care">Respite Care</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Users className="w-16 h-16 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Next of Kin Details</h2>
        <p className="text-gray-600 mt-2">Please provide emergency contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nextOfKinDetails.fullName}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, fullName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship to Client <span className="text-red-500">*</span>
          </label>
          <select
            value={nextOfKinDetails.relationshipToClient}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, relationshipToClient: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="spouse">Spouse</option>
            <option value="partner">Partner</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="other-family">Other Family Member</option>
            <option value="friend">Friend</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={nextOfKinDetails.phoneNumber}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, phoneNumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={nextOfKinDetails.email}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nextOfKinDetails.address}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, address: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nextOfKinDetails.postcode}
            onChange={(e) => setNextOfKinDetails({...nextOfKinDetails, postcode: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Heart className="w-16 h-16 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Medical Background Information</h2>
        <p className="text-gray-600 mt-2">Please provide relevant medical and care information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical History <span className="text-red-500">*</span>
          </label>
          <textarea
            value={medicalBackgroundInformation.medicalHistory}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, medicalHistory: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
            placeholder="Please provide details of medical conditions, treatments, and relevant medical history"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Diagnosis <span className="text-red-500">*</span>
          </label>
          <textarea
            value={medicalBackgroundInformation.currentDiagnosis}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, currentDiagnosis: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Please provide current medical diagnosis and any ongoing conditions"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Admission History
          </label>
          <textarea
            value={medicalBackgroundInformation.hospitalAdmissionHistory}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, hospitalAdmissionHistory: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Please provide details of recent hospital admissions, if any"
            disabled={notApplicable.hospitalAdmissionHistory}
          />
          {renderNotApplicableCheckbox('hospitalAdmissionHistory', 'Not applicable')}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobility Support Requirements
          </label>
          <textarea
            value={medicalBackgroundInformation.mobilitySupport}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, mobilitySupport: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Please describe any mobility aids, support requirements, or limitations"
            disabled={notApplicable.mobilitySupport}
          />
          {renderNotApplicableCheckbox('mobilitySupport', 'Not applicable')}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skin Integrity Assessment
          </label>
          <textarea
            value={medicalBackgroundInformation.skinIntegrityNeeds}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, skinIntegrityNeeds: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Please describe any skin conditions, wounds, or pressure area concerns"
            disabled={notApplicable.skinIntegrityNeeds}
          />
          {renderNotApplicableCheckbox('skinIntegrityNeeds', 'Not applicable')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNAR in Place <span className="text-red-500">*</span>
          </label>
          <select
            value={medicalBackgroundInformation.dnarInPlace}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, dnarInPlace: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Care Visit Frequency
          </label>
          <select
            value={medicalBackgroundInformation.careVisitFrequency}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, careVisitFrequency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={notApplicable.careVisitFrequency}
          >
            <option value="">Please Select</option>
            <option value="daily">Daily</option>
            <option value="twice-daily">Twice Daily</option>
            <option value="three-times-daily">Three Times Daily</option>
            <option value="four-times-daily">Four Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="as-needed">As Needed</option>
          </select>
          {renderNotApplicableCheckbox('careVisitFrequency', 'Not applicable')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Care Visit Duration
          </label>
          <select
            value={medicalBackgroundInformation.careVisitDuration}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, careVisitDuration: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={notApplicable.careVisitDuration}
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
          {renderNotApplicableCheckbox('careVisitDuration', 'Not applicable')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requires Help with Appointments <span className="text-red-500">*</span>
          </label>
          <select
            value={medicalBackgroundInformation.requiresHelpWithAppointments}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, requiresHelpWithAppointments: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wants Company to Appointments <span className="text-red-500">*</span>
          </label>
          <select
            value={medicalBackgroundInformation.wantsCompanyToAppointments}
            onChange={(e) => setMedicalBackgroundInformation({...medicalBackgroundInformation, wantsCompanyToAppointments: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Please Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Consent</h2>
        <p className="text-gray-600 mt-2">Please review your information and provide consent</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Summary of Information</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">Service User</h4>
            <p className="text-gray-600">
              {serviceUserDetails.firstName} {serviceUserDetails.lastName}, 
              {serviceUserDetails.gender}, {serviceUserDetails.dateOfBirth}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Next of Kin</h4>
            <p className="text-gray-600">
              {nextOfKinDetails.fullName} ({nextOfKinDetails.relationshipToClient})
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Service Required</h4>
            <p className="text-gray-600">{serviceUserDetails.serviceRequired}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
            I consent to the processing of my personal data for the purpose of this care assessment and service provision. 
            <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {submitMessage && (
        <div className={`p-4 rounded-lg ${submitMessage.includes('Error') || submitMessage.includes('Failed') 
          ? 'bg-red-50 text-red-700 border border-red-200' 
          : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {submitMessage}
        </div>
      )}
    </div>
  );

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-600'
              }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`h-1 w-24 mx-2 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Service User</span>
        <span>Next of Kin</span>
        <span>Medical Info</span>
        <span>Review</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Care Assessment Form
              </h1>
              <p className="text-gray-600">
                Please complete all sections to help us provide the best care possible
              </p>
            </div>

            {renderProgressBar()}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!consent || isSubmitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ml-auto"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareAssessmentForm;