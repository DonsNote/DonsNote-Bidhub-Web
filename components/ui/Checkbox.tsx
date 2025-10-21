'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  labelPosition?: 'left' | 'right';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    label,
    error,
    helperText,
    labelPosition = 'right',
    className = '',
    ...props
  }, ref) => {
    const checkboxContent = (
      <>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-5 h-5
              appearance-none
              bg-[#F0F2F5]
              border-2 border-transparent
              rounded
              cursor-pointer
              transition-all duration-200
              checked:bg-[#0066FF]
              checked:border-[#0066FF]
              focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Custom checkmark */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {label && (
          <label
            className={`
              font-sans text-base text-[#121417] cursor-pointer select-none
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </>
    );

    return (
      <div className="flex flex-col gap-2">
        <div className={`flex items-center gap-3 ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : ''}`}>
          {checkboxContent}
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
