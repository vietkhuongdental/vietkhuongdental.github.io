import { ErrorIcon } from '@/assets/icons/error-icon';
import ToolTip from '@/shared/components/ui/ToolTip';
import { cn } from '@/shared/libs/utils';
import type { ReactElement } from 'react';
// import { type FieldError } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label?: string;
  direction?: string;
  required?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  children: ReactElement;
  toolTip?: string;
}

export const FormField = ({
  id,
  label,
  direction,
  required,
  children,
  isError,
  isWarning,
  toolTip
}: FormFieldProps): ReactElement => (
  <div className="flex flex-col gap-1">
    {label ? (
      <label
        className="block flex flex-row items-center gap-1 text-sm font-medium"
        htmlFor={id}
      >
        {label}
        {required ? <span className="text-text-error">*</span> : null}
        {toolTip ? <ToolTip content={toolTip} /> : null}
      </label>
    ) : null}
    {children}
    {!!direction && (
      <p
        className={cn(
          'flex flex-row items-start gap-2',
          'mt-1 text-sm font-normal text-text-description',
          isError && 'text-text-error',
          isWarning && 'text-text-warning'
        )}
      >
        {isError ? <ErrorIcon /> : null}
        {direction}
      </p>
    )}
  </div>
);
