import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface AddressSuggestion {
  id: string;
  place_name: string;
  text: string;
  address?: string;
  context: Array<{
    id: string;
    text: string;
  }>;
}

interface AddressDropdownProps {
  isVisible: boolean;
  suggestions: AddressSuggestion[];
  onSelectAddress: (suggestion: AddressSuggestion) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({
  isVisible,
  suggestions,
  onSelectAddress,
  inputRef,
  onClose,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position based on input field
  useEffect(() => {
    if (isVisible && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      
      setPosition({
        top: inputRect.bottom + scrollY + 4, // 4px gap below input
        left: inputRect.left + scrollX,
        width: inputRect.width,
      });
    }
  }, [isVisible, inputRef]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose, inputRef]);

  // Handle window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (isVisible && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        
        setPosition({
          top: inputRect.bottom + scrollY + 4,
          left: inputRect.left + scrollX,
          width: inputRect.width,
        });
      }
    };

    if (isVisible) {
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isVisible, inputRef]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  // Create portal element
  const portalRoot = document.getElementById('root') || document.body;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999] bg-slate-800 border border-slate-600 rounded-lg max-h-60 overflow-y-auto shadow-2xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          onClick={() => {
            onSelectAddress(suggestion);
            onClose();
          }}
          className="px-4 py-3 hover:bg-blue-600 cursor-pointer text-white border-b border-slate-600 last:border-b-0 transition-colors duration-150"
        >
          <div className="font-medium text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {suggestion.text}
          </div>
          <div className="text-sm text-slate-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {suggestion.place_name}
          </div>
        </div>
      ))}
    </div>,
    portalRoot
  );
};

export default AddressDropdown;