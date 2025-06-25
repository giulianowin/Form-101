import React from 'react';
import { User, Phone, MapPin, Calendar } from 'lucide-react';
import CircularCheckbox from './CircularCheckbox';
import AddressDropdown from './AddressDropdown';
import {
  getDescriptionForField,
  getDateOfBirthWarning,
  getClientStartDateWarning,
  shouldShowDescription
} from '../utils/formValidationHelpers';

interface ServiceUserDetailsProps {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  handlePhoneChange: (field: string, value: string) => void;
  handleDateChange: (dateType: 'dateOfBirth' | 'clientStartDate', field: 'day' | 'month' | 'year', value: string) => void;
  handleAddressChange: (field: string, value: string, isNextOfKin?: boolean) => void;
  errors: any;
  dayOptions: string[];
  monthOptions: { value: string; label: string }[];
  yearOptions: string[];
  genderOptions: string[];
  serviceOptions: string[];
  allergyOptions: any;
  handleAllergyOptionChange: (option: string, checked: boolean) => void;
  searchAddresses: (query: string, isNextOfKin?: boolean) => void;
  selectAddress: (suggestion: any, isNextOfKin?: boolean) => void;
  addressSuggestions: any[];
  showAddressSuggestions: boolean;
  focusedField: string;
  setShowAddressSuggestions: (show: boolean) => void;
  setFocusedField: (field: string) => void;
  currentYear: number;
  noAllergies: boolean;
  setNoAllergies: (value: boolean) => void;
}

const ServiceUserDetails: React.FC<ServiceUserDetailsProps> = ({
  formData,
  handleInputChange,
  handlePhoneChange,
  handleDateChange,
  handleAddressChange,
  errors,
  dayOptions,
  monthOptions,
  yearOptions,
  genderOptions,
  serviceOptions,
  allergyOptions,
  handleAllergyOptionChange,
  searchAddresses,
  selectAddress,
  addressSuggestions,
  showAddressSuggestions,
  focusedField,
  setShowAddressSuggestions,
  setFocusedField,
  currentYear,
  noAllergies,
  setNoAllergies,
}) => {
  const handleNoAllergiesChange = (checked: boolean) => {
    setNoAllergies(checked);
    if (checked) {
      // Clear all other allergy options
      Object.keys(allergyOptions).forEach(option => {
        handleAllergyOptionChange(option, false);
      });
      handleInputChange('allergies', 'No allergies');
    } else {
      handleInputChange('allergies', '');
    }
  };

  // Create ref for address input
  const addressInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-blue-400 mr-3" />
        <h2 className="text-2xl font-semibold text-white">Client Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Enter first name"
          />
          {getDescriptionForField('firstName', formData.firstName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('firstName', formData.firstName)}</p>
          )}
          {errors.firstName && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Enter last name"
          />
          {getDescriptionForField('lastName', formData.lastName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('lastName', formData.lastName)}</p>
          )}
          {errors.lastName && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.lastName}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Date of Birth <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select
              value={formData.dateOfBirth.day}
              onChange={(e) => handleDateChange('dateOfBirth', 'day', e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
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
              style={{ fontFamily: 'Montserrat, sans-serif' }}
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
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <option value="" className="bg-slate-800">Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year} className="bg-slate-800">{year}</option>
              ))}
            </select>
          </div>
          {getDateOfBirthWarning(formData.dateOfBirth) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDateOfBirthWarning(formData.dateOfBirth)}</p>
          )}
          {errors.dateOfBirth && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="01234567890"
          />
          {focusedField === 'phoneNumber' && getDescriptionForField('phoneNumber', formData.phoneNumber) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('phoneNumber', formData.phoneNumber)}</p>
          )}
          {errors.phoneNumber && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.phoneNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Gender <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {genderOptions.map(gender => (
              <option key={gender} value={gender} className="bg-slate-800">{gender}</option>
            ))}
          </select>
          {errors.gender && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.gender}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <MapPin className="w-4 h-4 inline mr-1" />
            First Line of Address <span className="text-red-400">*</span>
          </label>
          <input
            ref={addressInputRef}
            type="text"
            value={formData.address}
            onChange={(e) => handleAddressChange('address', e.target.value, false)}
            onFocus={() => formData.address && setShowAddressSuggestions(true)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Start typing your address..."
          />
          {errors.address && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.address}</p>}
        </div>

        {/* Address Dropdown Portal */}
        <AddressDropdown
          isVisible={showAddressSuggestions}
          suggestions={addressSuggestions}
          onSelectAddress={(suggestion) => selectAddress(suggestion, false)}
          inputRef={addressInputRef}
          onClose={() => setShowAddressSuggestions(false)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Region <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.region}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.region && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.region}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            City <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.city}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.city && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Postcode <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.postcode}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.postcode && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.postcode}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Calendar className="w-4 h-4 inline mr-1" />
            Client Start Date <span className="text-slate-400 text-xs">(Optional)</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select
              value={formData.clientStartDate.day}
              onChange={(e) => handleDateChange('clientStartDate', 'day', e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
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
              style={{ fontFamily: 'Montserrat, sans-serif' }}
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
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <option value="" className="bg-slate-800">Year</option>
              {Array.from({ length: 10 }, (_, i) => String(currentYear + i)).map(year => (
                <option key={year} value={year} className="bg-slate-800">{year}</option>
              ))}
            </select>
          </div>
          {getClientStartDateWarning(formData.clientStartDate) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getClientStartDateWarning(formData.clientStartDate)}</p>
          )}
          {errors.clientStartDate && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.clientStartDate}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Allergies <span className="text-red-400">*</span>
          </label>
          
          {/* No Allergies Checkbox */}
          <div className="mb-4">
            <CircularCheckbox
              id="no-allergies"
              label="No allergies"
              checked={noAllergies}
              onChange={handleNoAllergiesChange}
              darkTheme={true}
            />
          </div>
          
          {/* Allergy Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.keys(allergyOptions).map((option) => (
              <CircularCheckbox
                key={option}
                id={`allergy-${option}`}
                label={option}
                checked={allergyOptions[option]}
                onChange={(checked) => handleAllergyOptionChange(option, checked)}
                disabled={noAllergies}
                darkTheme={true}
              />
            ))}
          </div>
          
          <textarea
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            disabled={noAllergies}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Select common allergies above or describe other allergies here. Write 'None' if no allergies"
          />
          {errors.allergies && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.allergies}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            What service would you require? <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.serviceRequired}
            onChange={(e) => handleInputChange('serviceRequired', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {serviceOptions.map(service => (
              <option key={service} value={service} className="bg-slate-800">{service}</option>
            ))}
          </select>
          {errors.serviceRequired && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.serviceRequired}</p>}
        </div>
      </div>
    </div>
  );
};

export default ServiceUserDetails;