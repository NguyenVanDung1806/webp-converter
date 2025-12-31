import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile } from '../types';
import { getWebPFileName } from './converter';

export function downloadFile(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

export async function createZip(images: ImageFile[]): Promise<Blob> {
  const zip = new JSZip();

  // Filter only completed images
  const completedImages = images.filter(
    (img) => img.status === 'completed' && img.convertedBlob
  );

  if (completedImages.length === 0) {
    throw new Error('No converted images to download');
  }

  // Add each image to the zip
  completedImages.forEach((img) => {
    if (img.convertedBlob) {
      const fileName = getWebPFileName(img.file.name);
      zip.file(fileName, img.convertedBlob);
    }
  });

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
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
