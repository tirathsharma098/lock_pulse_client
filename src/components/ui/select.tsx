import React from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  error,
  className
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export { Select, type Option };
