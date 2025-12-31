import imageCompression from 'browser-image-compression';
import type { ConversionSettings } from '../types';

export async function convertToWebP(
  file: File,
  settings: ConversionSettings
): Promise<Blob> {
  try {
    const options: any = {
      maxSizeMB: 10,
      maxWidthOrHeight: settings.width || settings.height || undefined,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: settings.quality / 100,
    };

    // If width or height is specified, handle resizing
    if (settings.width || settings.height) {
      if (settings.maintainAspectRatio) {
        // Set the max dimension
        options.maxWidthOrHeight = Math.max(settings.width || 0, settings.height || 0);
      } else {
        // For non-aspect ratio, we'll need to handle this differently
        // browser-image-compression doesn't support independent width/height
        // We'll use the larger dimension
        options.maxWidthOrHeight = Math.max(settings.width || 0, settings.height || 0);
      }
    }

    // Convert the image
    const compressedBlob = await imageCompression(file, options);

    return compressedBlob;
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
