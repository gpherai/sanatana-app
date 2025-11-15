/**
 * Button Component
 * Reusable button with variants and sizes
 */

'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'

    const variants = {
      primary: 'bg-orange-600 text-white shadow-soft hover:shadow-elegant hover:bg-orange-700 focus:ring-orange-600/50',
      secondary: 'bg-purple-600 text-white shadow-soft hover:shadow-elegant hover:bg-purple-700 focus:ring-purple-600/50',
      outline: 'border-[3px] border-orange-600 text-orange-700 bg-white hover:bg-orange-50 hover:border-orange-700 focus:ring-orange-600/50 shadow-soft',
      ghost: 'text-foreground hover:bg-muted/70 focus:ring-muted',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-soft hover:shadow-elegant focus:ring-red-500/50'
    }

    const sizes = {
      sm: 'text-sm px-4 py-2 gap-2',
      md: 'text-base px-6 py-3 gap-2',
      lg: 'text-lg px-8 py-4 gap-3'
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
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
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
