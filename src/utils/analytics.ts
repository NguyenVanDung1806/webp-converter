import type { ImageFile, ConversionStats } from '../types';

export function calculateTotalOriginalSize(images: ImageFile[]): number {
  return images.reduce((total, img) => total + img.originalSize, 0);
}

export function calculateTotalConvertedSize(images: ImageFile[]): number {
  return images.reduce((total, img) => {
    if (img.status === 'completed' && img.convertedSize) {
      return total + img.convertedSize;
    }
    return total;
  }, 0);
}

export function calculateSavings(
  originalBytes: number,
  convertedBytes: number
): { mb: number; percent: number } {
  const savingsBytes = originalBytes - convertedBytes;
  const savingsMB = savingsBytes / (1024 * 1024);
  const savingsPercent = originalBytes > 0 ? (savingsBytes / originalBytes) * 100 : 0;

  return {
    mb: savingsMB,
    percent: savingsPercent,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function calculateStats(images: ImageFile[]): ConversionStats {
  const completedImages = images.filter((img) => img.status === 'completed');
  const totalOriginalSize = calculateTotalOriginalSize(completedImages);
  const totalConvertedSize = calculateTotalConvertedSize(completedImages);
  const savings = calculateSavings(totalOriginalSize, totalConvertedSize);

  // Calculate EXIF stats
  const imagesWithExif = completedImages.filter(
    (img) => img.exifRemoved && img.exifOrientation && img.exifOrientation !== 1
  ).length;
  
  // Estimate EXIF savings (typically 5-20KB per image with EXIF)
  const estimatedExifSavings = imagesWithExif * 10 * 1024; // Conservative estimate: 10KB per image

  return {
    totalOriginalSize,
    totalConvertedSize,
    totalSavingsMB: savings.mb,
    totalSavingsPercent: savings.percent,
    filesProcessed: completedImages.length,
    averageProcessingTime: 0, // Will be calculated in the hook
    exifSavingsBytes: estimatedExifSavings,
    imagesWithExif,
  };
}
