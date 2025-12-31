import { FileUploader } from './components/FileUploader';
import { ConversionSettings } from './components/ConversionSettings';
import { ImagePreview } from './components/ImagePreview';
import { ProcessingQueue } from './components/ProcessingQueue';
import { Analytics } from './components/Analytics';
import { DownloadPanel } from './components/DownloadPanel';
import { useImageConverter } from './hooks/useImageConverter';

function App() {
  const {
    images,
    settings,
    isProcessing,
    addImages,
    removeImage,
    clearAll,
    convertAll,
    updateSettings,
  } = useImageConverter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">WebP Converter</h1>
                <p className="text-sm text-gray-400">Convert images to WebP format instantly</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                Client-side processing
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                No upload required
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* File Uploader */}
          <FileUploader onFilesSelected={addImages} disabled={isProcessing} />

          {/* Settings and Processing Queue */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ConversionSettings settings={settings} onSettingsChange={updateSettings} />
              </div>
              <div className="lg:col-span-2">
                <ProcessingQueue
                  images={images}
                  isProcessing={isProcessing}
                  onConvertAll={convertAll}
                />
              </div>
            </div>
          )}

          {/* Analytics */}
          <Analytics images={images} />

          {/* Image Preview Grid */}
          <ImagePreview images={images} onRemove={removeImage} />

          {/* Download Panel */}
          <DownloadPanel images={images} onClearAll={clearAll} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 ATS WebP Converter. All images are processed locally in your browser.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Version: 1.2.2 (Filename Fix) • No data is uploaded to any server.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
