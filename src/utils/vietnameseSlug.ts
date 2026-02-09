import slugify from 'slugify';

/**
 * Vietnamese Slug Generator
 * Converts Vietnamese text to SEO-friendly slugs
 */

/**
 * Custom Vietnamese character mapping
 * Ensures proper conversion of Vietnamese diacritics
 */
const vietnameseMap: Record<string, string> = {
  // Lowercase vowels
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
  'đ': 'd',
  
  // Uppercase vowels
  'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
  'Đ': 'D',
};

/**
 * Convert Vietnamese text to URL-friendly slug
 * Example: "Học bổng du học Úc" → "hoc-bong-du-hoc-uc"
 */
export function vietnameseSlug(text: string): string {
  if (!text) return '';
  
  // First, replace Vietnamese characters manually
  let result = text;
  Object.keys(vietnameseMap).forEach((char) => {
    result = result.replace(new RegExp(char, 'g'), vietnameseMap[char]);
  });
  
  // Then use slugify for the rest (lowercase, remove special chars, etc.)
  return slugify(result, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Validate slug for SEO best practices
 */
export interface SlugValidation {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateSlug(slug: string): SlugValidation {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Check if empty
  if (!slug || slug.trim().length === 0) {
    errors.push('Slug cannot be empty');
    return { isValid: false, warnings, errors };
  }
  
  // Check length
  if (slug.length < 3) {
    warnings.push('Slug is very short (recommended: 10-50 characters)');
  }
  
  if (slug.length > 60) {
    warnings.push('Slug is very long (recommended: 10-50 characters)');
  }
  
  // Check if only numbers
  if (/^\d+$/.test(slug)) {
    warnings.push('Slug contains only numbers - consider adding descriptive text');
  }
  
  // Check for special characters (should be cleaned by slugify)
  if (/[^a-z0-9-]/.test(slug)) {
    warnings.push('Slug contains special characters that will be removed');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Generate preview filenames based on slug
 */
export function generatePreviewNames(
  baseSlug: string,
  count: number = 3
): string[] {
  const slug = vietnameseSlug(baseSlug);
  return Array.from({ length: count }, (_, i) => `${slug}-${i + 1}.webp`);
}
