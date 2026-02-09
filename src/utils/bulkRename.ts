import type { RenameSettings, ImageFile } from '../types';
import { RenamePattern } from '../types';
import { vietnameseSlug } from './vietnameseSlug';

/**
 * Bulk Rename Utility
 * Generates SEO-friendly filenames based on Vietnamese slug
 */

/**
 * Generate a single filename based on pattern and settings
 */
export function generateFileName(
  baseSlug: string,
  index: number,
  pattern: RenamePattern,
  options: {
    zeroPadding: boolean;
    totalCount: number;
    separator: string;
  }
): string {
  const slug = vietnameseSlug(baseSlug);
  
  // Calculate padding width based on total count
  const paddingWidth = options.zeroPadding 
    ? Math.max(2, options.totalCount.toString().length)
    : 0;
  
  // Format index with zero padding if needed
  const formattedIndex = options.zeroPadding
    ? index.toString().padStart(paddingWidth, '0')
    : index.toString();
  
  const sep = options.separator;
  
  // Generate filename based on pattern
  switch (pattern) {
    case RenamePattern.SLUG_NUMBER:
      return `${slug}${sep}${formattedIndex}.webp`;
      
    case RenamePattern.SLUG_PADDED:
      return `${slug}${sep}${formattedIndex}.webp`;
      
    case RenamePattern.NUMBER_SLUG:
      return `${formattedIndex}${sep}${slug}.webp`;
      
    case RenamePattern.SLUG_IMAGE_NUMBER:
      return `${slug}${sep}image${sep}${formattedIndex}.webp`;
      
    default:
      return `${slug}${sep}${formattedIndex}.webp`;
  }
}

/**
 * Apply bulk rename to all images
 */
export function applyBulkRename(
  images: ImageFile[],
  settings: RenameSettings
): ImageFile[] {
  const totalCount = images.length;
  
  return images.map((image, index) => ({
    ...image,
    nameIndex: settings.startIndex + index,
    finalName: generateFileName(
      settings.baseSlug,
      settings.startIndex + index,
      settings.pattern,
      {
        zeroPadding: settings.zeroPadding,
        totalCount,
        separator: settings.separator,
      }
    ),
  }));
}

/**
 * Get default rename settings
 */
export function getDefaultRenameSettings(): RenameSettings {
  return {
    baseSlug: '',
    pattern: RenamePattern.SLUG_NUMBER,
    startIndex: 1,
    zeroPadding: false,
    separator: '-',
  };
}

/**
 * Check if rename is enabled (has a valid slug)
 */
export function isRenameEnabled(settings: RenameSettings): boolean {
  return settings.baseSlug.trim().length > 0;
}
