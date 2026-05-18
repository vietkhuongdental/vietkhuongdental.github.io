/* eslint-disable @typescript-eslint/naming-convention */

// React Imports
import { cn } from '@/shared/libs/utils';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        'text-card-foreground bg-card overflow-hidden rounded-lg border shadow-sm',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn('flex flex-col gap-2 p-3', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, level = 3, ...props }, ref) => {
    const headingLevel = `h${level}`;

    return React.createElement(
      headingLevel,
      {
        className: cn('font-semibold', className),
        ref,
        ...props
      },
      children
    );
  }
);
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <span
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
  >
    {children}
  </span>
));
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div className={cn('p-6 pt-0', className)} ref={ref} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, ...props }, ref) => (
    <div className="relative aspect-video w-full bg-background-subtle">
      <img
        alt={alt}
        className={cn('h-full w-full object-scale-down', className)}
        ref={ref}
        src={src || '/placeholder.svg'}
        {...props}
      />
    </div>
  )
);
CardImage.displayName = 'CardImage';

const CardMain = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('bg-background overflow-hidden rounded-2xl', className)}
    {...props}
  >
    {children}
  </div>
);

CardMain.displayName = 'Card';

CardMain.Header = CardHeader;
CardMain.Title = CardTitle;
CardMain.Description = CardDescription;
CardMain.Content = CardContent;
CardMain.Footer = CardFooter;
CardMain.Image = CardImage;

export { CardMain as Card };
