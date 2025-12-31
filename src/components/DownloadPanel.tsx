import { useState } from 'react';
import type { ImageFile } from '../types';
import { downloadAllAsZip } from '../utils/download';

interface DownloadPanelProps {
  images: ImageFile[];
  onClearAll: () => void;
}

export function DownloadPanel({ images, onClearAll }: DownloadPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const completedImages = images.filter((img) => img.status === 'completed');
  const hasCompletedImages = completedImages.length > 0;

  const handleDownloadAll = async () => {
    if (!hasCompletedImages) return;

    setIsDownloading(true);
    try {
      await downloadAllAsZip(completedImages);
      // Show success message
      console.log('ZIP download started successfully');
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create ZIP file: ${errorMessage}\n\nPlease try:\n1. Downloading images individually\n2. Refreshing the page\n3. Using a different browser`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Download</h3>
          <p className="text-sm text-gray-400">
            {completedImages.length} {completedImages.length === 1 ? 'file' : 'files'} ready to download
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            className="btn-secondary flex-1 sm:flex-none"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>

          {/* Download All Button */}
          <button
            onClick={handleDownloadAll}
            disabled={!hasCompletedImages || isDownloading}
            className="btn-primary flex-1 sm:flex-none"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating ZIP...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All as ZIP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Message */}
      {!hasCompletedImages && images.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-300">
            ℹ️ Convert images first to enable download
          </p>
        </div>
      )}
    </div>
  );
}
