import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/analytics';
import { downloadSingleImage } from '../utils/download';

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: ImageFile) => {
    try {
      downloadSingleImage(image);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Images ({images.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all"
          >
            {/* Image Preview */}
            <div className="relative aspect-square bg-slate-800">
              <img
                src={image.preview}
                alt={image.file.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {image.status === 'pending' && (
                  <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded-full">
                    Pending
                  </span>
                )}
                {image.status === 'processing' && (
                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full animate-pulse">
                    Processing...
                  </span>
                )}
                {image.status === 'completed' && (
                  <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                    ✓ Done
                  </span>
                )}
                {image.status === 'error' && (
                  <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                    ✗ Error
                  </span>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(image.id)}
                className="absolute top-2 left-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image Info */}
            <div className="p-3">
              <p className="text-sm text-white font-medium truncate mb-2" title={image.file.name}>
                {image.file.name}
              </p>

              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Original:</span>
                  <span className="text-gray-300">{formatFileSize(image.originalSize)}</span>
                </div>

                {image.convertedSize && (
                  <>
                    <div className="flex justify-between">
                      <span>WebP:</span>
                      <span className="text-green-400">{formatFileSize(image.convertedSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saved:</span>
                      <span className="text-green-400 font-semibold">
                        {Math.round(((image.originalSize - image.convertedSize) / image.originalSize) * 100)}%
                      </span>
                    </div>
                  </>
                )}

                {image.errorMessage && (
                  <div className="text-red-400 text-xs mt-1">
                    {image.errorMessage}
                  </div>
                )}
              </div>

              {/* Download Button */}
              {image.status === 'completed' && (
                <button
                  onClick={() => handleDownload(image)}
                  className="mt-3 w-full btn-primary text-xs py-1.5"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
