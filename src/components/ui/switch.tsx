import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  label, 
  disabled, 
  className 
}) => {
  return (
    <label className={cn('flex items-center space-x-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={cn(
          'w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out',
          checked && 'bg-blue-600',
          disabled && 'cursor-not-allowed'
        )}>
          <div className={cn(
            'w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
            'absolute top-0.5 left-0.5'
          )} />
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

export { Switch };
