export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  convertedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  convertedBlob?: Blob;
  errorMessage?: string;
}

export interface ConversionSettings {
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  preserveExif: boolean;
}

export interface ConversionStats {
  totalOriginalSize: number;
  totalConvertedSize: number;
  totalSavingsMB: number;
  totalSavingsPercent: number;
  filesProcessed: number;
  averageProcessingTime: number;
}
