import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';
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
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
          {focusedField === 'nextOfKinFirstName' && getDescriptionForField('nextOfKinFirstName', formData.nextOfKinFirstName) && !shouldShowWarning('nextOfKinFirstName', formData.nextOfKinFirstName) && (
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
          {focusedField === 'nextOfKinLastName' && getDescriptionForField('nextOfKinLastName', formData.nextOfKinLastName) && !shouldShowWarning('nextOfKinLastName', formData.nextOfKinLastName) && (
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
          {focusedField === 'nextOfKinPhone' && getDescriptionForField('nextOfKinPhone', formData.nextOfKinPhone) && (
            <p className="text-yellow-400 text-sm mt-1">{getDescriptionForField('nextOfKinPhone', formData.nextOfKinPhone)}</p>
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
  );
};

export default NextOfKinDetails;