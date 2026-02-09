import EXIF from 'exif-js';

/**
 * EXIF Orientation Handler
 * Detects and corrects image orientation based on EXIF data
 */

/**
 * Detect EXIF orientation from an image file
 * Returns orientation value (1-8) or 1 (normal) if not found
 */
export async function detectOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // @ts-ignore - exif-js types are not perfect
          EXIF.getData(img, function() {
            // @ts-ignore
            const orientation = EXIF.getTag(this, 'Orientation') || 1;
            console.log(`EXIF Orientation detected: ${orientation}`);
            resolve(orientation);
          });
        } catch (error) {
          console.warn('Failed to read EXIF orientation, using default (1):', error);
          resolve(1);
        }
      };
      img.onerror = () => {
        console.warn('Failed to load image for EXIF reading');
        resolve(1);
      };
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      console.warn('Failed to read file for EXIF');
      resolve(1);
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Apply orientation transformation to canvas context
 * Handles all 8 EXIF orientation values
 */
export function applyOrientation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  orientation: number
): void {
  const { width, height } = img;
  
  // Reset canvas transform
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  switch (orientation) {
    case 1:
      // Normal - no transformation needed
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    case 2:
      // Flip horizontal
      canvas.width = width;
      canvas.height = height;
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    case 3:
      // Rotate 180°
      canvas.width = width;
      canvas.height = height;
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    case 4:
      // Flip vertical
      canvas.width = width;
      canvas.height = height;
      ctx.translate(0, height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    case 5:
      // Rotate 90° CW + flip horizontal
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, -height, width, height);
      break;
      
    case 6:
      // Rotate 90° CW
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    case 7:
      // Rotate 90° CCW + flip horizontal
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(-0.5 * Math.PI);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -width, 0, width, height);
      break;
      
    case 8:
      // Rotate 90° CCW
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      ctx.drawImage(img, 0, 0, width, height);
      break;
      
    default:
      // Unknown orientation, treat as normal
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
  }
}

/**
 * Get corrected dimensions after orientation transformation
 * Orientations 5-8 swap width and height
 */
export function getCorrectedDimensions(
  width: number,
  height: number,
  orientation: number
): { width: number; height: number } {
  if (orientation >= 5 && orientation <= 8) {
    // Orientations that rotate 90° or 270° swap dimensions
    return { width: height, height: width };
  }
  return { width, height };
}
