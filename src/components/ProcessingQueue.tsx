import type { ImageFile } from '../types';

interface ProcessingQueueProps {
  images: ImageFile[];
  isProcessing: boolean;
  onConvertAll: () => void;
}

export function ProcessingQueue({ images, isProcessing, onConvertAll }: ProcessingQueueProps) {
  const pendingCount = images.filter((img) => img.status === 'pending').length;
  const processingCount = images.filter((img) => img.status === 'processing').length;
  const completedCount = images.filter((img) => img.status === 'completed').length;
  const errorCount = images.filter((img) => img.status === 'error').length;
  const totalCount = images.length;

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Processing Queue</h3>
          <p className="text-sm text-gray-400">
            {completedCount} of {totalCount} images converted
          </p>
        </div>

        <button
          onClick={onConvertAll}
          disabled={isProcessing || pendingCount === 0}
          className="btn-primary whitespace-nowrap"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : (
            `Convert ${pendingCount > 0 ? `${pendingCount} ` : ''}Images`
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{Math.round(progress)}% complete</span>
          {isProcessing && <span className="text-primary-400">Processing...</span>}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-gray-400">{pendingCount}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>

        <div className="bg-slate-900 rounded-lg p-3 border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{processingCount}</div>
          <div className="text-xs text-blue-300">Processing</div>
        </div>

        <div className="bg-slate-900 rounded-lg p-3 border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{completedCount}</div>
          <div className="text-xs text-green-300">Completed</div>
        </div>

        <div className="bg-slate-900 rounded-lg p-3 border border-red-500/30">
          <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          <div className="text-xs text-red-300">Errors</div>
        </div>
      </div>

      {/* Success Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in">
          <p className="text-sm text-green-300 text-center">
            🎉 All images converted successfully!
          </p>
        </div>
      )}
    </div>
  );
}
