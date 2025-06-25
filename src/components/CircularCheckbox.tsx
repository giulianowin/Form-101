import React from 'react';
import { Check } from 'lucide-react';

interface CircularCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  darkTheme?: boolean;
}

const CircularCheckbox: React.FC<CircularCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  darkTheme = false,
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${disabled 
            ? `opacity-50 cursor-not-allowed ${darkTheme ? 'border-white/30' : 'border-gray-300'}` 
            : `cursor-pointer ${darkTheme ? 'hover:border-blue-400' : 'hover:border-blue-400'}`
          }
          ${checked 
            ? 'bg-blue-500 border-blue-500' 
            : `${darkTheme ? 'border-white/40 bg-white/10' : 'border-gray-400 bg-white'}`
          }
        `}
      >
        {checked && (
          <Check 
            size={12} 
            className="text-white stroke-[3]" 
          />
        )}
      </label>
      <label
        htmlFor={id}
        className={`
          text-sm font-bold select-none
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
          }
          ${darkTheme ? 'text-slate-200' : 'text-gray-700'}
        `}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '800' }}
      >
        {label}
      </label>
    </div>
  );
};

export default CircularCheckbox;