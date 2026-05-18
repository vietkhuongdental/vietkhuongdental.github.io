import { cn } from '@/shared/libs/utils';
import type { ReactNode } from 'react';

interface TagProps {
  color?: keyof typeof colorClasses;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  size?: 'lg' | 'md' | 'sm';
  variant?: 'filled' | 'outline';
}

const colorClasses = {
  green: {
    filled: 'bg-background-success-subtle text-text-success',
    outline: 'bg-background-success-subtle text-text-success '
  },
  white: {
    filled: 'bg-background-default text-text-default',
    outline: 'bg-transparent text-text-default border border-icon-subtle'
  },
  red: {
    filled: 'bg-background-error-subtle text-text-error',
    outline: 'bg-background-error-subtle text-text-error'
  },
  yellow: {
    filled: 'bg-background-warning-subtle text-text-warning',
    outline: 'bg-background-warning-subtle text-text-warning'
  },
  orange: {
    filled: 'bg-background-brand-primary-subtle text-border-brand-primary',
    outline: 'bg-background-brand-primary-subtle text-border-brand-primary'
  },
  gray: {
    filled: 'bg-background-default-hover text-text-default',
    outline: 'bg-background-default-hover text-text-default'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs rounded-md',
  md: 'px-2 py-1 text-sm rounded-lg',
  lg: 'px-3 py-2 text-base rounded-xl'
};

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'filled',
  size = 'sm',
  color = 'yellow',
  icon
}) => (
  <span
    className={cn(
      'flex h-fit w-fit flex-row gap-2 whitespace-nowrap font-normal text-text-warning',
      colorClasses[color][variant],
      sizeClasses[size]
    )}
    tabIndex={0}
  >
    {icon ? <>{icon}</> : null}
    {label}
  </span>
);
