import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] select-none';
    
    const variants = {
      primary: 'bg-[#C1E3D0] hover:bg-[#aedbbe] text-[#133825] border border-[#a8d7bc] shadow-xs focus:ring-[#C1E3D0]/50 active:bg-[#9fd0b1]',
      secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-xs focus:ring-gray-100',
      outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-100',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-100',
      danger: 'bg-error-600 hover:bg-error-700 text-white border border-error-600 shadow-xs focus:ring-error-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-4.5 py-2.5 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
