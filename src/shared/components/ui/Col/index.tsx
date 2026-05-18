import { cn } from '@/shared/libs/utils';
import React from 'react';

interface ColProps {
  span?: number;
  spanMobile?: number;
  align?: string;
  classes?: string;
  children?: React.ReactNode;
}

const Col: React.FC<ColProps> = ({
  span,
  spanMobile = 4,
  align,
  classes,
  children
}) => {
  const hasContent = React.Children.count(children) > 0;

  return (
    <div
      className={cn(
        `col-span-${spanMobile}`,
        span && `lg:col-span-${span}`,
        align && `flex justify-${align} items-center`,
        classes
      )}
    >
      {!hasContent ? <div className="hidden" /> : children}
    </div>
  );
};

export default Col;
