// Other Imports
import { cn } from '@/shared/libs/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
// React Imports

// Utility Imports

const inputVariants = cva(
  'group px-3 flex flex-row gap-2 items-center font-normal w-full rounded-lg border bg-background text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none',
  {
    variants: {
      inputSize: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-md'
      },
      variant: {
        default: [
          'border-border-default',
          'hover:border-border-brand-primary-hover',
          '[&:has(:active)]:border-border-brand-primary-hover',
          '[&:has(:active)]:ring-2',
          '[&:has(:active)]:ring-button-primary-bg-hover/25',
          '[&:has(:focus)]:border-border-brand-primary-hover',
          '[&:has(:focus)]:ring-2',
          '[&:has(:focus)]:ring-button-primary-bg-hover/25'
        ],
        error: 'border-border-error',
        warning: 'border-border-warning'
      },
      isDisabled: {
        false: '',
        true: 'cursor-not-allowed opacity-50 bg-background-disabled'
      },
      isError: {
        false: '',
        true: 'border-border-error'
      },
      isWarning: {
        false: '',
        true: 'border-border-warning'
      }
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'lg',
      isDisabled: false,
      isError: false,
      isWarning: false
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: VariantProps<typeof inputVariants>['variant'];
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize = 'lg',
      leadingIcon,
      trailingIcon,
      placeholder = 'Please input your data',
      prefix,
      suffix,
      isDisabled = false,
      isError,
      isWarning,
      ...props
    },
    ref
  ) => {
    const inputType = type || 'text';

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div
        className={cn(
          inputVariants({
            inputSize,
            variant,
            isDisabled,
            isError,
            isWarning
          }),
          (prefix || suffix) && 'px-0',
          className
        )}
      >
        {prefix ? (
          <div className="flex h-full items-center rounded-l-lg border-r border-border-default bg-background-canvas px-3 text-text-default">
            {prefix}
          </div>
        ) : null}

        {leadingIcon ? (
          <div className="flex h-6 w-6 items-center justify-center">
            {leadingIcon}
          </div>
        ) : null}

        <input
          className={cn(
            'flex w-full items-center bg-transparent text-sm placeholder:text-text-placeholder focus:outline-none',
            inputSize === 'lg' && 'text-md'
          )}
          disabled={isDisabled || false}
          placeholder={placeholder}
          ref={ref}
          type={showPassword ? 'text' : inputType}
          {...props}
        />

        {type === 'password' && (
          <button
            className="flex h-4 w-4 items-center justify-center"
            onClick={toggleShowPassword}
            type="button"
          >
            {showPassword ? (
              <EyeOff color="#E56200" />
            ) : (
              <Eye color="#E56200" />
            )}
          </button>
        )}

        {trailingIcon ? (
          <div className="flex h-4 w-4 items-center justify-center">
            {trailingIcon}
          </div>
        ) : null}

        {suffix ? (
          <div className="flex h-full items-center rounded-r-lg border-l border-border-default bg-background-canvas px-3 text-text-default">
            {suffix}
          </div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
