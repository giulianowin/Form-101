import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import AddressDropdown from './AddressDropdown';
import {
  getDescriptionForField,
  shouldShowWarning,
  shouldShowDescription
} from '../utils/formValidationHelpers';

interface NextOfKinDetailsProps {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  handlePhoneChange: (field: string, value: string) => void;
  handleAddressChange: (field: string, value: string, isNextOfKin?: boolean) => void;
  errors: any;
  relationshipOptions: string[];
  searchAddresses: (query: string, isNextOfKin?: boolean) => void;
  selectAddress: (suggestion: any, isNextOfKin?: boolean) => void;
  nextOfKinAddressSuggestions: any[];
  showNextOfKinAddressSuggestions: boolean;
  focusedField: string;
  setShowNextOfKinAddressSuggestions: (show: boolean) => void;
  setFocusedField: (field: string) => void;
}

const NextOfKinDetails: React.FC<NextOfKinDetailsProps> = ({
  formData,
  handleInputChange,
  handlePhoneChange,
  handleAddressChange,
  errors,
  relationshipOptions,
  searchAddresses,
  selectAddress,
  nextOfKinAddressSuggestions,
  showNextOfKinAddressSuggestions,
  focusedField,
  setShowNextOfKinAddressSuggestions,
  setFocusedField,
}) => {
  // Create ref for next of kin address input
  const nextOfKinAddressInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-pink-400 mr-3" />
        <h2 className="text-2xl font-semibold text-white">Next of Kin Details</h2>
      </div>
      
      {/* Name Fields Box */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>  
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinFirstName}
            onChange={(e) => handleInputChange('nextOfKinFirstName', e.target.value)}
            onFocus={() => setFocusedField('nextOfKinFirstName')}
            onBlur={() => setFocusedField('')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Enter first name"
          />
          {shouldShowWarning('nextOfKinFirstName', formData.nextOfKinFirstName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Minimum 3 characters</p>
          )}
          {focusedField === 'nextOfKinFirstName' && getDescriptionForField('nextOfKinFirstName', formData.nextOfKinFirstName) && !shouldShowWarning('nextOfKinFirstName', formData.nextOfKinFirstName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('nextOfKinFirstName', formData.nextOfKinFirstName)}</p>
          )}
          {errors.nextOfKinFirstName && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinFirstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinLastName}
            onChange={(e) => handleInputChange('nextOfKinLastName', e.target.value)}
            onFocus={() => setFocusedField('nextOfKinLastName')}
            onBlur={() => setFocusedField('')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Enter last name"
          />
          {shouldShowWarning('nextOfKinLastName', formData.nextOfKinLastName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Minimum 3 characters</p>
          )}
          {focusedField === 'nextOfKinLastName' && getDescriptionForField('nextOfKinLastName', formData.nextOfKinLastName) && !shouldShowWarning('nextOfKinLastName', formData.nextOfKinLastName) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('nextOfKinLastName', formData.nextOfKinLastName)}</p>
          )}
          {errors.nextOfKinLastName && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinLastName}</p>}
        </div>
        </div>
      </div>

      {/* Relationship Box */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Relationship to Client <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.relationshipToClient}
            onChange={(e) => handleInputChange('relationshipToClient', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {relationshipOptions.map(relationship => (
              <option key={relationship} value={relationship} className="bg-slate-800">{relationship}</option>
            ))}
          </select>
          {errors.relationshipToClient && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.relationshipToClient}</p>}
        </div>
      </div>

      {/* Contact Information Box */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="01234567890"
          />
          {focusedField === 'nextOfKinPhone' && getDescriptionForField('nextOfKinPhone', formData.nextOfKinPhone) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('nextOfKinPhone', formData.nextOfKinPhone)}</p>
          )}
          {errors.nextOfKinPhone && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinPhone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.nextOfKinEmail}
            onChange={(e) => handleInputChange('nextOfKinEmail', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Enter email address"
          />
          {getDescriptionForField('nextOfKinEmail', formData.nextOfKinEmail) && (
            <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{getDescriptionForField('nextOfKinEmail', formData.nextOfKinEmail)}</p>
          )}
          {errors.nextOfKinEmail && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinEmail}</p>}
        </div>
        </div>
      </div>

      {/* Address Box */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-500 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <MapPin className="w-4 h-4 inline mr-1" />
            First Line of Address <span className="text-red-400">*</span>
          </label>
          <input
            ref={nextOfKinAddressInputRef}
            type="text"
            value={formData.nextOfKinAddress}
            onChange={(e) => handleAddressChange('nextOfKinAddress', e.target.value, true)}
            onFocus={() => formData.nextOfKinAddress && setShowNextOfKinAddressSuggestions(true)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Start typing your address..."
          />
          {errors.nextOfKinAddress && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinAddress}</p>}
        </div>

        {/* Next of Kin Address Dropdown Portal */}
        <AddressDropdown
          isVisible={showNextOfKinAddressSuggestions}
          suggestions={nextOfKinAddressSuggestions}
          onSelectAddress={(suggestion) => selectAddress(suggestion, true)}
          inputRef={nextOfKinAddressInputRef}
          onClose={() => setShowNextOfKinAddressSuggestions(false)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Region <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinRegion}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.nextOfKinRegion && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinRegion}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            City <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinCity}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.nextOfKinCity && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinCity}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Postcode <span className="text-red-400">*</span> <span className="text-slate-400 text-xs">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKinPostcode}
            readOnly
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-slate-300 placeholder-slate-400 cursor-not-allowed opacity-75"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {errors.nextOfKinPostcode && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.nextOfKinPostcode}</p>}
        </div>
        </div>
      </div>
    </div>
  );
};

export default NextOfKinDetails;