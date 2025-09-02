'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, className }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden',
        className
      )}>
        {children}
      </div>
    </div>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 overflow-y-auto max-h-[60vh]', className)}>
    {children}
  </div>
);

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => (
  <h2 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>
    {children}
  </h2>
);

const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2', className)}>
    {children}
  </div>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter };
