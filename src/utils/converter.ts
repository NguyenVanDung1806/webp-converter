import imageCompression from 'browser-image-compression';
import type { ConversionSettings } from '../types';

/**
 * Convert image to WebP with proper compression
 * Uses browser-image-compression for actual file size reduction
 */
export async function convertToWebP(
  file: File,
  settings: ConversionSettings
): Promise<Blob> {
  try {
    console.log(`Converting ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
    console.log(`Settings: quality=${settings.quality}%, width=${settings.width || 'auto'}, height=${settings.height || 'auto'}`);
    
    // Step 1: Configure compression options
    const options = {
      maxSizeMB: 1, // Maximum file size in MB
      maxWidthOrHeight: 1920, // Maximum dimension (maintains aspect ratio)
      useWebWorker: true, // Use web worker for better performance
      fileType: 'image/webp', // Target format
      initialQuality: settings.quality / 100, // Quality from UI (0-1 range)
    };
    
    // Apply custom dimensions if specified
    if (settings.width || settings.height) {
      if (settings.maintainAspectRatio) {
        // Use the larger dimension to ensure image fits
        options.maxWidthOrHeight = Math.max(settings.width || 0, settings.height || 0) || 1920;
      } else {
        // For non-aspect ratio, use the larger dimension
        options.maxWidthOrHeight = Math.max(settings.width || 0, settings.height || 0) || 1920;
      }
    }
    
    console.log('Compression options:', options);
    
    // Step 2: Compress the image
    const compressedBlob = await imageCompression(file, options);
    
    console.log(`Compressed size: ${(compressedBlob.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compression ratio: ${((1 - compressedBlob.size / file.size) * 100).toFixed(1)}% saved`);
    
    // Step 3: Ensure correct MIME type (browser-image-compression might not set it correctly)
    const webpBlob = new Blob([compressedBlob], { type: 'image/webp' });
    
    console.log(`Final blob type: ${webpBlob.type}, size: ${webpBlob.size} bytes`);
    
    return webpBlob;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getWebPFileName(originalName: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}.webp`;
}

export async function convertImageToWebP(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; size: number }> {
  if (onProgress) onProgress(0);

  const blob = await convertToWebP(file, settings);

  if (onProgress) onProgress(100);

  return {
    blob,
    size: blob.size,
  };
}
