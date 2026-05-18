import type React from 'react';

/**
 * Utility function to handle image loading errors
 * @param event The error event from the image
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>
) => {
  const target = event.target as HTMLImageElement;
  target.onerror = null; // Prevent infinite loop
  target.src = `/placeholder.svg?height=${target.height || 300}&width=${target.width || 300}`;
};

/**
 * Get a placeholder image URL with specified dimensions
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @returns URL for a placeholder image
 */
export const getPlaceholderImage = (width = 300, height = 300): string =>
  `/placeholder.svg?height=${height}&width=${width}`;
