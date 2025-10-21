'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    helperText,
    fullWidth = false,
    options,
    placeholder,
    className = '',
    ...props
  }, ref) => {
    const baseSelectStyles = `
      px-4 py-3
      bg-[#F0F2F5]
      border border-transparent
      rounded-lg
      font-sans text-base text-[#121417]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      appearance-none
      cursor-pointer
      ${error ? 'border-red-500 focus:ring-red-500' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="font-medium text-sm text-[#121417] font-sans">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`${baseSelectStyles} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#121417"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-sans">{error}</p>
        )}

        {helperText && !error && (
          <p className="text-sm text-[#61758A] font-sans">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
