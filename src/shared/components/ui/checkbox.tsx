import { cn } from '@/shared/libs/utils';
import { Check, Minus } from 'lucide-react';
import React from 'react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate = false, ...props }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        checkboxRef.current = node;
      },
      [ref]
    );

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center">
          <input
            className={cn(
              'ring-offset-background peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-primary-500 focus-visible:border-primary-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={mergedRef}
            type="checkbox"
            {...props}
          />
          <div className="pointer-events-none absolute inset-0 h-4 w-4 self-end rounded-sm peer-checked:bg-primary-500" />
          <div className="pointer-events-none absolute inset-0 flex h-4 w-4 items-center justify-center self-end text-white opacity-0 peer-checked:opacity-100">
            {indeterminate ? (
              <Minus className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </div>
        </div>
        {label ? (
          <label className="text-sm font-medium leading-none">{label}</label>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
