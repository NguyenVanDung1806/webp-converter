export const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_BATCH_SIZE = 50;

export interface ValidationError {
  type: 'file_type' | 'file_size' | 'batch_size';
  message: string;
  fileName?: string;
}

export function validateFileType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

export function validateFileSize(file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function validateBatchSize(files: File[], maxCount: number = MAX_BATCH_SIZE): boolean {
  return files.length <= maxCount;
}

export function validateFiles(files: File[]): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = [];
  const errors: ValidationError[] = [];

  // Check batch size
  if (!validateBatchSize(files)) {
    errors.push({
      type: 'batch_size',
      message: `Maximum ${MAX_BATCH_SIZE} files allowed. You selected ${files.length} files.`,
    });
    return { valid, errors };
  }

  // Check each file
  files.forEach((file) => {
    let isValid = true;

    if (!validateFileType(file)) {
      errors.push({
        type: 'file_type',
        message: `Invalid file type. Allowed: JPG, PNG, GIF, BMP`,
        fileName: file.name,
      });
      isValid = false;
    }

    if (!validateFileSize(file)) {
      errors.push({
        type: 'file_size',
        message: `File too large (max ${MAX_FILE_SIZE_MB}MB)`,
        fileName: file.name,
      });
      isValid = false;
    }

    if (isValid) {
      valid.push(file);
    }
  });

  return { valid, errors };
}
