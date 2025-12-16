import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'destructive';
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'default',
            'hover:bg-gray-100 text-gray-600': variant === 'ghost',
            'text-red-600 hover:bg-red-50': variant === 'destructive',
          },
          {
            'h-8 w-8': size === 'sm',
            'h-10 w-10': size === 'md',
            'h-12 w-12': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
