'use client';

import { ReactNode, useState } from 'react';
import Button from './Button';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'custom';
  options?: FilterOption[];
  min?: number;
  max?: number;
  customContent?: ReactNode;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset?: () => void;
  showResetButton?: boolean;
}

const FilterPanel = ({
  groups,
  values,
  onChange,
  onReset,
  showResetButton = true,
}: FilterPanelProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {})
  );

  const toggleGroup = (groupId: string) => {
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleCheckboxChange = (groupId: string, optionValue: any) => {
    const currentValues = values[groupId] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v: any) => v !== optionValue)
      : [...currentValues, optionValue];

    onChange({ ...values, [groupId]: newValues });
  };

  const handleRadioChange = (groupId: string, optionValue: any) => {
    onChange({ ...values, [groupId]: optionValue });
  };

  const handleRangeChange = (groupId: string, min: number, max: number) => {
    onChange({ ...values, [groupId]: { min, max } });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange({});
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-[#E5E8EB]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E8EB]">
        <h3 className="text-lg font-bold text-[#121417] font-sans">필터</h3>
        {showResetButton && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            초기화
          </Button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-3">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-sm text-[#121417] font-sans">
                {group.label}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${expanded[group.id] ? 'rotate-180' : ''}`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#121417"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Group Content */}
            {expanded[group.id] && (
              <div className="flex flex-col gap-2">
                {group.type === 'checkbox' && group.options && (
                  <div className="flex flex-col gap-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={(values[group.id] || []).includes(option.value)}
                          onChange={() => handleCheckboxChange(group.id, option.value)}
                          className="w-4 h-4 rounded border-2 border-[#E5E8EB] text-[#0066FF] focus:ring-2 focus:ring-[#0066FF] cursor-pointer"
                        />
                        <span className="text-sm text-[#121417] font-sans group-hover:text-[#0066FF] transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {group.type === 'radio' && group.options && (
                  <div className="flex flex-col gap-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name={group.id}
                          checked={values[group.id] === option.value}
                          onChange={() => handleRadioChange(group.id, option.value)}
                          className="w-4 h-4 border-2 border-[#E5E8EB] text-[#0066FF] focus:ring-2 focus:ring-[#0066FF] cursor-pointer"
                        />
                        <span className="text-sm text-[#121417] font-sans group-hover:text-[#0066FF] transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {group.type === 'range' && group.min !== undefined && group.max !== undefined && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="최소"
                        min={group.min}
                        max={group.max}
                        value={values[group.id]?.min || group.min}
                        onChange={(e) =>
                          handleRangeChange(
                            group.id,
                            Number(e.target.value),
                            values[group.id]?.max || group.max
                          )
                        }
                        className="flex-1 px-3 py-2 bg-[#F0F2F5] border border-transparent rounded-lg font-sans text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      />
                      <span className="text-sm text-[#61758A] font-sans">~</span>
                      <input
                        type="number"
                        placeholder="최대"
                        min={group.min}
                        max={group.max}
                        value={values[group.id]?.max || group.max}
                        onChange={(e) =>
                          handleRangeChange(
                            group.id,
                            values[group.id]?.min || group.min,
                            Number(e.target.value)
                          )
                        }
                        className="flex-1 px-3 py-2 bg-[#F0F2F5] border border-transparent rounded-lg font-sans text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>
                  </div>
                )}

                {group.type === 'custom' && group.customContent}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
