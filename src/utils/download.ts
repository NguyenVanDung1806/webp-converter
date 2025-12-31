import JSZip from 'jszip';
import type { ImageFile } from '../types';
import { getWebPFileName } from './converter';

/**
 * Download a file using native browser API (more compatible with Vercel)
 * Creates a temporary anchor element and triggers download
 */
export function downloadFile(blob: Blob, filename: string): void {
  try {
    console.log(`Downloading: ${filename}`);
    console.log(`Blob size: ${blob.size} bytes`);
    console.log(`Blob type: ${blob.type}`);
    
    // Verify blob is valid
    if (!blob || blob.size === 0) {
      console.error('Invalid blob encountered');
      throw new Error('Blob is empty or invalid - conversion may have failed');
    }
    
    // Create blob URL
    const url = window.URL.createObjectURL(blob);
    console.log(`Created blob URL: ${url}`);
    
    // Create temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Append to body
    document.body.appendChild(link);
    
    // Use a slight delay to ensure the link is in the DOM
    setTimeout(() => {
      console.log(`Starting download for: ${filename}`);
      link.click();
      
      // CRITICAL: Wait for browser to handle the download before revoking
      // Revoking too early causes intermittent corrupt files
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Cleanup completed: URL revoked');
      }, 2000); // Wait 2 seconds
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error(`Failed to download ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createZip(images: ImageFile[]): Promise<Blob> {
  try {
    const zip = new JSZip();

    // Filter only completed images
    const completedImages = images.filter(
      (img) => img.status === 'completed' && img.convertedBlob
    );

    if (completedImages.length === 0) {
      throw new Error('No converted images to download');
    }

    console.log(`Creating ZIP with ${completedImages.length} images...`);

    // Add each image to the zip
    for (const img of completedImages) {
      if (img.convertedBlob) {
        const fileName = getWebPFileName(img.file.name);
        console.log(`Adding to ZIP: ${fileName} (${img.convertedBlob.size} bytes)`);
        
        // Ensure blob has correct type
        const webpBlob = new Blob([img.convertedBlob], { type: 'image/webp' });
        zip.file(fileName, webpBlob);
      }
    }

    console.log('Generating ZIP file...');
    
    // Generate the zip file with proper compression
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });
    
    console.log(`ZIP created successfully: ${zipBlob.size} bytes`);
    
    // Ensure proper MIME type for ZIP
    return new Blob([zipBlob], { type: 'application/zip' });
  } catch (error) {
    console.error('Error in createZip:', error);
    throw error;
  }
}

export async function downloadAllAsZip(images: ImageFile[]): Promise<void> {
  try {
    const zipBlob = await createZip(images);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(zipBlob, `webp-images-${timestamp}.zip`);
  } catch (error) {
    console.error('Error creating zip:', error);
    throw error;
  }
}

export function downloadSingleImage(image: ImageFile): void {
  if (image.status !== 'completed' || !image.convertedBlob) {
    throw new Error('Image not ready for download');
  }

  const fileName = getWebPFileName(image.file.name);
  downloadFile(image.convertedBlob, fileName);
}
