import { cn } from '@/shared/libs/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva('flex flex-row justify-center items-center', {
  variants: {
    variant: {
      primary: `bg-background-primary border border-none text-text-inverse  
        hover:bg-button-primary-bg-hover hover:border-none hover:text-text-inverse   
        active:bg-background-primary active:border-none active:text-text-inverse active:ring-2 active:ring-background-primary/25`,
      secondary: `bg-button-secondary-bg-default border border-none text-text-inverse  
        hover:bg-button-secondary-bg-hover hover:border-none hover:text-text-inverse   
        active:bg-button-secondary-bg-default active:border-none active:text-text-inverse active:ring-2 active:ring-button-secondary-hover/25`,
      outline: `bg-transparent border border-button-outline-bd-default text-button-outline-fg-default`,
      outlineInverse: `bg-base-white border border-border-default text-button-outlineInverse-fg-default`,
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
      dashed:
        'border border-dashed border-border-default text-button-outline-fg-default',
      link: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
      danger:
        'bg-transparent text-button-danger-fg-default bg-button-danger-bg-default hover:opacity-80'
    },
    size: {
      sm: 'h-8 px-3 py-1 text-sm',
      md: 'h-11 px-3 py-2 text-md',
      lg: 'h-12 px-4 py-3 text-md'
    },
    isDisabled: {
      true: 'pointer-events-none opacity-50 border-opacity-50',
      false: ''
    }
  },
  compoundVariants: [
    {
      variant: 'primary',
      isDisabled: true,
      className: 'bg-background-disabled text-text-disable'
    },
    {
      variant: 'secondary',
      isDisabled: true,
      className: 'bg-background-disabled text-text-disable'
    },
    {
      isDisabled: true,
      className: 'opacity-50'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    isDisabled: false
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leadingIcon,
      trailingIcon,
      children,
      isDisabled = false,
      ...props
    },
    ref
  ) => (
    <button
      className={cn(buttonVariants({ variant, size, isDisabled }), className)}
      ref={ref}
      {...props}
    >
      {leadingIcon ? (
        <span className="flex items-center">{leadingIcon}</span>
      ) : null}
      {children ? (
        <span className="flex w-full items-center justify-center whitespace-nowrap font-semibold">
          {children}
        </span>
      ) : null}
      {trailingIcon ? (
        <span className="flex items-center">{trailingIcon}</span>
      ) : null}
    </button>
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
