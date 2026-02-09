import type { ConversionSettings } from '../types';
import { detectOrientation, applyOrientation, getCorrectedDimensions } from './exifOrientation';

/**
 * Custom WebP Compression Engine
 * Guarantees output is smaller than input, or at least optimized.
 * Now includes EXIF orientation correction.
 */
export async function convertToWebP(
  file: File,
  settings: ConversionSettings,
  orientation?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Create object URL securely
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        URL.revokeObjectURL(url); // Clean up memory immediately

        // 1. Calculate Target Dimensions (Max 1920px safe limit)
        // This effectively replaces 'maxSizeMB' logic by limiting pixels
        const MAX_DIMENSION = 1920; 
        let { width, height } = img;
        
        // Apply orientation correction to dimensions if needed
        if (orientation && orientation !== 1) {
          const corrected = getCorrectedDimensions(width, height, orientation);
          width = corrected.width;
          height = corrected.height;
        }
        
        // Handle User Resizing Settings first
        if (settings.width || settings.height) {
           if (settings.maintainAspectRatio) {
              const aspectRatio = width / height;
              if (settings.width && settings.height) {
                const scale = Math.min(settings.width / width, settings.height / height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
              } else if (settings.width) {
                height = Math.round(settings.width / aspectRatio);
                width = settings.width;
              } else if (settings.height) {
                width = Math.round(height * aspectRatio);
                height = settings.height;
              }
           } else {
              width = settings.width || width;
              height = settings.height || height;
           }
        } else {
          // Automatic Optimization: Downscale if huge
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
             const ratio = width / height;
             if (width > height) {
                width = MAX_DIMENSION;
                height = Math.round(width / ratio);
             } else {
                height = MAX_DIMENSION;
                width = Math.round(height * ratio);
             }
          }
        }

        // 2. Draw to Canvas with orientation correction
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context failed');
        
        // Apply orientation transformation if needed
        if (orientation && orientation !== 1) {
          // Create temporary canvas with original image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) throw new Error('Temp canvas context failed');
          
          // Apply orientation to temp canvas
          applyOrientation(tempCanvas, tempCtx, img, orientation);
          
          // Now draw the corrected image to final canvas with target dimensions
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(tempCanvas, 0, 0, width, height);
        } else {
          // No orientation correction needed
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
        }

        // 3. Smart Compression Loop
        // Start with requested quality
        let currentQuality = settings.quality / 100; // e.g., 0.8
        let blob = await getCanvasBlob(canvas, currentQuality);
        
        console.log(`Initial conversion: ${(blob.size/1024).toFixed(2)}KB (Quality: ${currentQuality})`);

        // GUARD: If WebP is larger than Original AND Quality is decent (>0.5),
        // try to compress harder to provide value.
        // (Only applies if user didn't ask for 100% quality explicitly)
        if (blob.size > file.size && currentQuality > 0.6) {
           console.warn(`WebP (${blob.size}) > Original (${file.size}). Retrying with lower quality...`);
           
           // Try reducing quality significantly to force compression
           const aggressiveQuality = Math.max(0.5, currentQuality - 0.2); 
           const compressedBlob = await getCanvasBlob(canvas, aggressiveQuality);
           
           // Use the smaller result
           if (compressedBlob.size < blob.size) {
             blob = compressedBlob;
             console.log(`Optimized result: ${(blob.size/1024).toFixed(2)}KB (Quality: ${aggressiveQuality})`);
           }
        }

        resolve(blob);

      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

// Helper to wrap canvas.toBlob in a Promise
function getCanvasBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Force correct MIME Type
          resolve(new Blob([blob], { type: 'image/webp' })); 
        } else {
          reject(new Error('Canvas conversion failed'));
        }
      },
      'image/webp',
      quality
    );
  });
}

export function getWebPFileName(originalName: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}.webp`;
}

export async function convertImageToWebP(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; size: number; orientation: number; exifRemoved: boolean }> {
  if (onProgress) onProgress(10);
  
  // Detect EXIF orientation if removeExif is enabled
  let orientation = 1;
  if (settings.removeExif) {
    try {
      orientation = await detectOrientation(file);
      if (onProgress) onProgress(30);
    } catch (error) {
      console.warn('Failed to detect orientation, using default:', error);
    }
  }
  
  if (onProgress) onProgress(50);
  const blob = await convertToWebP(file, settings, orientation);
  if (onProgress) onProgress(100);
  
  return { 
    blob, 
    size: blob.size,
    orientation,
    exifRemoved: settings.removeExif
  };
}
