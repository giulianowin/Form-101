import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import CircularCheckbox from './CircularCheckbox';

interface MedicalBackgroundProps {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  errors: any;
  mobilityOptions: any;
  setMobilityOptions: (options: any) => void;
  handleMobilityOptionChange: (option: string, checked: boolean) => void;
  skinIntegrityOptions: any;
  setSkinIntegrityOptions: (options: any) => void;
  handleSkinIntegrityOptionChange: (option: string, checked: boolean) => void;
  yesNoOptions: string[];
  careVisitDurationOptions: string[];
  careVisitFrequencyOptions: string[];
}

const MedicalBackground: React.FC<MedicalBackgroundProps> = ({
  formData,
  handleInputChange,
  errors,
  mobilityOptions,
  setMobilityOptions,
  handleMobilityOptionChange,
  skinIntegrityOptions,
  setSkinIntegrityOptions,
  handleSkinIntegrityOptionChange,
  yesNoOptions,
  careVisitDurationOptions,
  careVisitFrequencyOptions,
}) => {
  const [medicalHistoryNA, setMedicalHistoryNA] = useState(false);
  const [currentDiagnosisNA, setCurrentDiagnosisNA] = useState(false);
  const [hospitalHistoryNA, setHospitalHistoryNA] = useState(false);
  const [mobilitySupportNA, setMobilitySupportNA] = useState(false);
  const [skinIntegrityNA, setSkinIntegrityNA] = useState(false);

  const handleNAChange = (field: string, naState: boolean, setNAState: (value: boolean) => void) => {
    setNAState(naState);
    if (naState) {
      handleInputChange(field, 'N/A');
      if (field === 'mobilitySupport') {
        // Clear all mobility options
        const clearedOptions = Object.keys(mobilityOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        setMobilityOptions(clearedOptions);
      }
      if (field === 'skinIntegrityNeeds') {
        // Clear all skin integrity options
        const clearedOptions = Object.keys(skinIntegrityOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        setSkinIntegrityOptions(clearedOptions);
      }
    } else {
      handleInputChange(field, '');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-green-400 mr-3" />
        <h2 className="text-2xl font-semibold text-white">Client Medical Background</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Medical History
          </label>
          <div className="mb-2">
            <CircularCheckbox
              id="medical-history-na"
              label="N/A"
              checked={medicalHistoryNA}
              onChange={(checked) => handleNAChange('medicalHistory', checked, setMedicalHistoryNA)}
              darkTheme={true}
            />
          </div>
          <textarea
            value={formData.medicalHistory}
            onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
            disabled={medicalHistoryNA}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Please provide details of medical history"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Current Diagnosis
          </label>
          <div className="mb-2">
            <CircularCheckbox
              id="current-diagnosis-na"
              label="N/A"
              checked={currentDiagnosisNA}
              onChange={(checked) => handleNAChange('currentDiagnosis', checked, setCurrentDiagnosisNA)}
              darkTheme={true}
            />
          </div>
          <textarea
            value={formData.currentDiagnosis}
            onChange={(e) => handleInputChange('currentDiagnosis', e.target.value)}
            disabled={currentDiagnosisNA}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Please provide current diagnosis details"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Hospital Admission History
          </label>
          <div className="mb-2">
            <CircularCheckbox
              id="hospital-history-na"
              label="N/A"
              checked={hospitalHistoryNA}
              onChange={(checked) => handleNAChange('hospitalAdmissionHistory', checked, setHospitalHistoryNA)}
              darkTheme={true}
            />
          </div>
          <textarea
            value={formData.hospitalAdmissionHistory}
            onChange={(e) => handleInputChange('hospitalAdmissionHistory', e.target.value)}
            disabled={hospitalHistoryNA}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Please provide hospital admission history"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Mobility Support
          </label>
          
          <div className="mb-2">
            <CircularCheckbox
              id="mobility-support-na"
              label="N/A"
              checked={mobilitySupportNA}
              onChange={(checked) => handleNAChange('mobilitySupport', checked, setMobilitySupportNA)}
              darkTheme={true}
            />
          </div>
          
          {/* Checkboxes for mobility options */}
          <div className="mb-3 space-y-2">
            {Object.entries(mobilityOptions).map(([option, checked]) => (
              <CircularCheckbox
                key={option}
                id={`mobility-${option.replace(/\s+/g, '-').toLowerCase()}`}
                label={option}
                checked={checked as boolean}
                onChange={(isChecked) => handleMobilityOptionChange(option, isChecked)}
                disabled={mobilitySupportNA}
                darkTheme={true}
              />
            ))}
          </div>
          
          {/* Multi-line text area */}
          <textarea
            value={formData.mobilitySupport}
            onChange={(e) => handleInputChange('mobilitySupport', e.target.value)}
            disabled={mobilitySupportNA}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Select from options above or provide additional details about mobility support needs..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Skin Integrity Needs
          </label>
          
          <div className="mb-2">
            <CircularCheckbox
              id="skin-integrity-na"
              label="N/A"
              checked={skinIntegrityNA}
              onChange={(checked) => handleNAChange('skinIntegrityNeeds', checked, setSkinIntegrityNA)}
              darkTheme={true}
            />
          </div>
          
          <div className="space-y-3 mb-3">
            {Object.entries(skinIntegrityOptions).map(([option, checked]) => (
              <CircularCheckbox
                key={option}
                id={`skin-${option.replace(/\s+/g, '-').toLowerCase()}`}
                label={option}
                checked={checked as boolean}
                onChange={(isChecked) => handleSkinIntegrityOptionChange(option, isChecked)}
                disabled={skinIntegrityNA}
                darkTheme={true}
              />
            ))}
          </div>
          
          <textarea
            value={formData.skinIntegrityNeeds}
            onChange={(e) => handleInputChange('skinIntegrityNeeds', e.target.value)}
            disabled={skinIntegrityNA}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200 resize-none disabled:opacity-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            placeholder="Select options above or add additional details..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            DNAR in Place <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.dnarInPlace}
            onChange={(e) => handleInputChange('dnarInPlace', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {yesNoOptions.map(option => (
              <option key={option} value={option} className="bg-slate-800">{option}</option>
            ))}
          </select>
          {errors.dnarInPlace && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.dnarInPlace}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Care Visit Frequency <span className="text-slate-400 text-xs">(Optional)</span>
          </label>
          <select
            value={formData.careVisitFrequency}
            onChange={(e) => handleInputChange('careVisitFrequency', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Optional</option>
            {careVisitFrequencyOptions.map(frequency => (
              <option key={frequency} value={frequency} className="bg-slate-800">{frequency}</option>
            ))}
          </select>
          {errors.careVisitFrequency && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.careVisitFrequency}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Care Visit Duration <span className="text-slate-400 text-xs">(Optional)</span>
          </label>
          <select
            value={formData.careVisitDuration}
            onChange={(e) => handleInputChange('careVisitDuration', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Optional</option>
            {careVisitDurationOptions.map(duration => (
              <option key={duration} value={duration} className="bg-slate-800">{duration}</option>
            ))}
          </select>
          {errors.careVisitDuration && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.careVisitDuration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Requires Help with Appointments <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.requiresHelpWithAppointments}
            onChange={(e) => handleInputChange('requiresHelpWithAppointments', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {yesNoOptions.map(option => (
              <option key={option} value={option} className="bg-slate-800">{option}</option>
            ))}
          </select>
          {errors.requiresHelpWithAppointments && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.requiresHelpWithAppointments}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Wants Company to Appointments <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.wantsCompanyToAppointments}
            onChange={(e) => handleInputChange('wantsCompanyToAppointments', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colours duration-200"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="" className="bg-slate-800">Please Select</option>
            {yesNoOptions.map(option => (
              <option key={option} value={option} className="bg-slate-800">{option}</option>
            ))}
          </select>
          {errors.wantsCompanyToAppointments && <p className="text-yellow-400 text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.wantsCompanyToAppointments}</p>}
        </div>
      </div>
    </div>
  );
};

export default MedicalBackground;