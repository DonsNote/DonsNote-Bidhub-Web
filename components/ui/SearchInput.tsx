'use client';

import { useState, useEffect, InputHTMLAttributes, forwardRef } from 'react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onSearch: (query: string) => void;
  debounce?: number;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showClearButton?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    onSearch,
    debounce = 300,
    label,
    error,
    helperText,
    fullWidth = false,
    showClearButton = true,
    className = '',
    ...props
  }, ref) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
      setIsSearching(true);
      const timer = setTimeout(() => {
        onSearch(query);
        setIsSearching(false);
      }, debounce);

      return () => {
        clearTimeout(timer);
      };
    }, [query, debounce, onSearch]);

    const handleClear = () => {
      setQuery('');
      onSearch('');
    };

    const baseInputStyles = `
      pl-12 pr-4 py-3
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
    `;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="font-medium text-sm text-[#121417] font-sans">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="#61758A"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            ref={ref}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${baseInputStyles} ${className}`}
            {...props}
          />

          {/* Clear Button or Loading Spinner */}
          {query && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <svg
                  className="animate-spin h-5 w-5 text-[#61758A]"
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
              ) : (
                showClearButton && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 rounded-full hover:bg-[#E5E8EB] transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#61758A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )
              )}
            </div>
          )}
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

SearchInput.displayName = 'SearchInput';

export default SearchInput;
