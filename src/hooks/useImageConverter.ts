import { useState, useCallback } from 'react';
import type { ImageFile, ConversionSettings } from '../types';
import { validateFiles } from '../utils/validator';
import { convertImageToWebP } from '../utils/converter';

export function useImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 80,
    maintainAspectRatio: true,
    preserveExif: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const addImages = useCallback((files: File[]) => {
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      // Show errors to user (you can handle this with a toast/notification system)
      errors.forEach((error) => {
        console.error(error.message, error.fileName);
      });
    }

    if (valid.length > 0) {
      const newImages: ImageFile[] = valid.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        originalSize: file.size,
        status: 'pending' as const,
      }));

      setImages((prev) => [...prev, ...newImages]);
    }

    return { addedCount: valid.length, errors };
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
  }, [images]);

  const convertSingle = useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id);
      if (!image) return;

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: 'processing' as const } : img
        )
      );

      try {
        const startTime = Date.now();
        const { blob, size } = await convertImageToWebP(image.file, settings);
        const processingTime = Date.now() - startTime;

        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'completed' as const,
                  convertedBlob: blob,
                  convertedSize: size,
                }
              : img
          )
        );

        return processingTime;
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'error' as const,
                  errorMessage:
                    error instanceof Error ? error.message : 'Conversion failed',
                }
              : img
          )
        );
        throw error;
      }
    },
    [images, settings]
  );

  const convertAll = useCallback(async () => {
    setIsProcessing(true);
    const pendingImages = images.filter((img) => img.status === 'pending');
    const times: number[] = [];

    try {
      // Process sequentially to avoid memory issues
      for (const image of pendingImages) {
        const time = await convertSingle(image.id);
        if (time) times.push(time);
      }
    } finally {
      setIsProcessing(false);
    }

    return times;
  }, [images, convertSingle]);

  const updateSettings = useCallback((newSettings: Partial<ConversionSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    images,
    settings,
    isProcessing,
    addImages,
    removeImage,
    clearAll,
    convertSingle,
    convertAll,
    updateSettings,
  };
}
