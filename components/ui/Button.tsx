'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-sans font-medium
      rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantStyles = {
      primary: `
        bg-[#0066FF] text-white
        hover:bg-[#0052CC]
        focus:ring-[#0066FF]
        active:bg-[#003D99]
      `,
      secondary: `
        bg-[#F0F2F5] text-[#121417]
        hover:bg-[#E5E8EB]
        focus:ring-[#E5E8EB]
        active:bg-[#D1D6DB]
      `,
      outline: `
        bg-transparent text-[#121417]
        border-2 border-[#E5E8EB]
        hover:bg-[#F0F2F5]
        focus:ring-[#E5E8EB]
        active:bg-[#E5E8EB]
      `,
      ghost: `
        bg-transparent text-[#121417]
        hover:bg-[#F0F2F5]
        focus:ring-[#F0F2F5]
        active:bg-[#E5E8EB]
      `,
      danger: `
        bg-[#FF3B30] text-white
        hover:bg-[#E6342A]
        focus:ring-[#FF3B30]
        active:bg-[#CC2C24]
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
