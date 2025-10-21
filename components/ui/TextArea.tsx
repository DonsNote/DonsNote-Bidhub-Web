'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    error,
    helperText,
    fullWidth = false,
    resize = 'vertical',
    className = '',
    rows = 4,
    ...props
  }, ref) => {
    const baseTextAreaStyles = `
      px-4 py-3
      bg-[#F0F2F5]
      border border-transparent
      rounded-lg
      font-sans text-base text-[#121417]
      placeholder:text-[#61758A]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500' : ''}
      ${fullWidth ? 'w-full' : ''}
      resize-${resize}
    `;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="font-medium text-sm text-[#121417] font-sans">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={`${baseTextAreaStyles} ${className}`}
          {...props}
        />

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

TextArea.displayName = 'TextArea';

export default TextArea;
