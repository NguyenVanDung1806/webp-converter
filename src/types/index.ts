export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  convertedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  convertedBlob?: Blob;
  errorMessage?: string;
  // Rename fields
  customName?: string; // User-provided base name
  finalName: string;   // Generated: base-name-1.webp
  nameIndex: number;   // 1, 2, 3, ...
  // EXIF tracking
  exifOrientation?: number; // EXIF orientation value (1-8)
  exifRemoved: boolean;     // Whether EXIF was removed
}

export interface ConversionSettings {
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  removeExif: boolean; // Changed from preserveExif to removeExif (enabled by default)
}

export interface RenameSettings {
  baseSlug: string;           // "du-hoc-va-hoc-bong"
  pattern: RenamePattern;     // How to format names
  startIndex: number;         // Start counting from 1
  zeroPadding: boolean;       // 001 vs 1
  separator: string;          // "-" vs "_"
}

export const RenamePattern = {
  SLUG_NUMBER: 'slug-1',           // du-hoc-uc-1.webp
  SLUG_PADDED: 'slug-001',         // du-hoc-uc-001.webp
  NUMBER_SLUG: '1-slug',           // 1-du-hoc-uc.webp
  SLUG_IMAGE_NUMBER: 'slug-image-1' // du-hoc-uc-image-1.webp
} as const;

export type RenamePattern = typeof RenamePattern[keyof typeof RenamePattern];

export interface ConversionStats {
  totalOriginalSize: number;
  totalConvertedSize: number;
  totalSavingsMB: number;
  totalSavingsPercent: number;
  filesProcessed: number;
  averageProcessingTime: number;
  // EXIF stats
  exifSavingsBytes: number;
  imagesWithExif: number;
}
