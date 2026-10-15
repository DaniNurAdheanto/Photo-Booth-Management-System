import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  withDot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  withDot = true,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    brand: 'bg-[#C1E3D0]/45 text-[#133825] border-[#a8d7bc] font-semibold',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-error-50 text-error-700 border-error-200',
    outline: 'bg-white text-gray-700 border-gray-300 shadow-xs',
  };

  const dots = {
    default: 'bg-gray-500',
    brand: 'bg-[#2C6D4C]',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-error-500',
    outline: 'bg-gray-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dots[variant], {
            'animate-pulse': variant === 'success' || variant === 'warning' || variant === 'brand',
          })}
        />
      )}
      {children}
    </span>
  );
}
