import type { ImageFile } from '../types';
import { calculateStats, formatFileSize } from '../utils/analytics';

interface AnalyticsProps {
  images: ImageFile[];
}

export function Analytics({ images }: AnalyticsProps) {
  const stats = calculateStats(images);

  if (stats.filesProcessed === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Conversion Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Files Processed */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-300">Files Processed</span>
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-white">{stats.filesProcessed}</div>
        </div>

        {/* Original Size */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-300">Original Size</span>
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatFileSize(stats.totalOriginalSize)}
          </div>
        </div>

        {/* Converted Size */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-300">WebP Size</span>
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l-3 3m0 0l-3-3m3 3V10" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatFileSize(stats.totalConvertedSize)}
          </div>
        </div>

        {/* Savings */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-300">Total Savings</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {Math.round(stats.totalSavingsPercent)}%
          </div>
          <div className="text-xs text-emerald-300 mt-1">
            {formatFileSize(stats.totalSavingsMB * 1024 * 1024)} saved
          </div>
        </div>
      </div>

      {/* EXIF Stats */}
      {stats.imagesWithExif > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-300">EXIF Removed</span>
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">{stats.imagesWithExif} images</div>
            <div className="text-xs text-orange-300 mt-1">
              ~{formatFileSize(stats.exifSavingsBytes)} metadata removed
            </div>
          </div>
        </div>
      )}

      {/* Visual Comparison Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Size Comparison</span>
          <span>{Math.round(stats.totalSavingsPercent)}% reduction</span>
        </div>
        <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
          <div
            className="bg-purple-600 flex items-center justify-center text-xs text-white font-semibold"
            style={{ width: '100%' }}
          >
            Original
          </div>
          <div
            className="bg-green-600 flex items-center justify-center text-xs text-white font-semibold"
            style={{ width: `${100 - stats.totalSavingsPercent}%` }}
          >
            WebP
          </div>
        </div>
      </div>
    </div>
  );
}
