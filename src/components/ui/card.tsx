import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn(
    'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
    className
  )}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('p-6 pb-4', className)}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>
    {children}
  </h3>
);

export { Card, CardHeader, CardContent, CardTitle };
