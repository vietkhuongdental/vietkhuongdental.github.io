import { cn } from '@/shared/libs/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import { forwardRef } from 'react';

const textareaVariants = cva(
  'group flex flex-row gap-2 items-center font-normal w-full rounded-lg border bg-background text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none',
  {
    variants: {
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
      isDisabled: false,
      isError: false,
      isWarning: false
    }
  }
);

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'>,
    VariantProps<typeof textareaVariants> {
  variant?: VariantProps<typeof textareaVariants>['variant'];
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      placeholder = 'Please input your data',
      isDisabled = false,
      isError,
      isWarning,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        textareaVariants({
          variant,
          isDisabled,
          isError,
          isWarning
        }),
        className
      )}
    >
      <textarea
        className={clsx(
          'w-full rounded-lg px-3 py-2.5 text-md',
          'placeholder:text-text-placeholder focus:outline-none',
          'min-h-24 overflow-auto',

          className
        )}
        disabled={isDisabled || false}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    </div>
  )
);
TextArea.displayName = 'TextArea';

export { TextArea };
