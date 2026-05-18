import { handleImageError } from '@/shared/libs/image-utils';
import type React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  fallbackSrc,
  onError,
  ...props
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (onError) {
      onError(e);
    }

    handleImageError(e);
  };

  return (
    <img
      src={
        src ||
        fallbackSrc ||
        `/placeholder.svg?height=${props.height || 300}&width=${props.width || 300}`
      }
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};
