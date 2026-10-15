import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500',
      secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-600',
      outline: 'border border-slate-700 text-slate-200 hover:bg-slate-800/60 focus:ring-slate-500',
      ghost: 'text-slate-300 hover:bg-slate-800 focus:ring-slate-600',
      danger: 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
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
