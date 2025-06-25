import { isValidName, isValidNameInput, isValidEmail, isValidPhone } from './validation';

// NOTE: shouldShowWarning and shouldShowDescription currently have identical logic for name fields
// This duplication should be reviewed - they may need different behaviors

export const shouldShowWarning = (field: string, value: string): boolean => {
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

export const shouldShowDescription = (field: string, value: string): boolean => {
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

export const getFieldDescription = (field: string): string | undefined => {
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

export const getDescriptionForField = (field: string, value: string): string | null => {
  if (!shouldShowDescription(field, value)) return null;

  if (field === 'firstName' || field === 'lastName' || field === 'nextOfKinFirstName' || field === 'nextOfKinLastName') {
    return 'Minimum 3 characters';
  }
  return getFieldDescription(field) || null;
};

export const getDateOfBirthWarning = (dateOfBirth: { day: string; month: string; year: string }): string => {
  const { day, month, year } = dateOfBirth;
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

export const getClientStartDateWarning = (clientStartDate: { day: string; month: string; year: string }): string => {
  const { day, month, year } = clientStartDate;
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

// New function for progressive form system
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

interface FormErrors {
  [key: string]: string;
}

interface RequiredFieldsStatus {
  totalRequiredFields: number;
  completedRequiredFields: number;
  isClientDetailsComplete: boolean;
  isNextOfKinDetailsComplete: boolean;
  isMedicalBackgroundComplete: boolean;
  isConsentComplete: boolean;
}

export const getRequiredFieldsStatus = (formData: FormData, errors: FormErrors): RequiredFieldsStatus => {
  let completedRequiredFields = 0;
  const totalRequiredFields = 24; // 11 + 9 + 3 + 1

  // Client Details validation (11 required fields)
  const clientDetailsFields = [
    { field: 'firstName', isValid: () => formData.firstName.trim() && isValidName(formData.firstName) && !errors.firstName },
    { field: 'lastName', isValid: () => formData.lastName.trim() && isValidName(formData.lastName) && !errors.lastName },
    { field: 'dateOfBirth', isValid: () => formData.dateOfBirth.day && formData.dateOfBirth.month && formData.dateOfBirth.year && !errors.dateOfBirth },
    { field: 'phoneNumber', isValid: () => formData.phoneNumber && formData.phoneNumber !== '0' && isValidPhone(formData.phoneNumber) && !errors.phoneNumber },
    { field: 'gender', isValid: () => formData.gender.trim() && !errors.gender },
    { field: 'address', isValid: () => formData.address.trim() && !errors.address },
    { field: 'region', isValid: () => formData.region.trim() && !errors.region },
    { field: 'city', isValid: () => formData.city.trim() && !errors.city },
    { field: 'postcode', isValid: () => formData.postcode.trim() && !errors.postcode },
    { field: 'allergies', isValid: () => formData.allergies.trim() && !errors.allergies },
    { field: 'serviceRequired', isValid: () => formData.serviceRequired.trim() && !errors.serviceRequired }
  ];

  const completedClientFields = clientDetailsFields.filter(field => field.isValid()).length;
  const isClientDetailsComplete = completedClientFields === clientDetailsFields.length;
  completedRequiredFields += completedClientFields;

  // Next of Kin Details validation (9 required fields)
  const nextOfKinFields = [
    { field: 'nextOfKinFirstName', isValid: () => formData.nextOfKinFirstName.trim() && isValidName(formData.nextOfKinFirstName) && !errors.nextOfKinFirstName },
    { field: 'nextOfKinLastName', isValid: () => formData.nextOfKinLastName.trim() && isValidName(formData.nextOfKinLastName) && !errors.nextOfKinLastName },
    { field: 'relationshipToClient', isValid: () => formData.relationshipToClient.trim() && !errors.relationshipToClient },
    { field: 'nextOfKinPhone', isValid: () => formData.nextOfKinPhone && formData.nextOfKinPhone !== '0' && isValidPhone(formData.nextOfKinPhone) && !errors.nextOfKinPhone },
    { field: 'nextOfKinEmail', isValid: () => formData.nextOfKinEmail.trim() && isValidEmail(formData.nextOfKinEmail) && !errors.nextOfKinEmail },
    { field: 'nextOfKinAddress', isValid: () => formData.nextOfKinAddress.trim() && !errors.nextOfKinAddress },
    { field: 'nextOfKinRegion', isValid: () => formData.nextOfKinRegion.trim() && !errors.nextOfKinRegion },
    { field: 'nextOfKinCity', isValid: () => formData.nextOfKinCity.trim() && !errors.nextOfKinCity },
    { field: 'nextOfKinPostcode', isValid: () => formData.nextOfKinPostcode.trim() && !errors.nextOfKinPostcode }
  ];

  const completedNextOfKinFields = nextOfKinFields.filter(field => field.isValid()).length;
  const isNextOfKinDetailsComplete = completedNextOfKinFields === nextOfKinFields.length;
  completedRequiredFields += completedNextOfKinFields;

  // Medical Background validation (3 required fields)
  const medicalFields = [
    { field: 'dnarInPlace', isValid: () => formData.dnarInPlace.trim() && !errors.dnarInPlace },
    { field: 'requiresHelpWithAppointments', isValid: () => formData.requiresHelpWithAppointments.trim() && !errors.requiresHelpWithAppointments },
    { field: 'wantsCompanyToAppointments', isValid: () => formData.wantsCompanyToAppointments.trim() && !errors.wantsCompanyToAppointments }
  ];

  const completedMedicalFields = medicalFields.filter(field => field.isValid()).length;
  const isMedicalBackgroundComplete = completedMedicalFields === medicalFields.length;
  completedRequiredFields += completedMedicalFields;

  // Consent validation (1 required field)
  const isConsentComplete = formData.consent && !errors.consent;
  if (isConsentComplete) {
    completedRequiredFields += 1;
  }

  return {
    totalRequiredFields,
    completedRequiredFields,
    isClientDetailsComplete,
    isNextOfKinDetailsComplete,
    isMedicalBackgroundComplete,
    isConsentComplete
  };
};