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