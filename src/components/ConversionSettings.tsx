import type { ConversionSettings as Settings } from '../types';

interface ConversionSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
}

export function ConversionSettings({ settings, onSettingsChange }: ConversionSettingsProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Conversion Settings</h3>

      {/* Quality Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quality: {settings.quality}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.quality}
          onChange={(e) => onSettingsChange({ quality: parseInt(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lower quality (smaller file)</span>
          <span>Higher quality (larger file)</span>
        </div>
      </div>

      {/* Resize Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Resize (optional)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Width (px)</label>
            <input
              type="number"
              placeholder="Auto"
              value={settings.width || ''}
              onChange={(e) =>
                onSettingsChange({
                  width: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="input-field w-full"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Height (px)</label>
            <input
              type="number"
              placeholder="Auto"
              value={settings.height || ''}
              onChange={(e) =>
                onSettingsChange({
                  height: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="input-field w-full"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.maintainAspectRatio}
            onChange={(e) =>
              onSettingsChange({ maintainAspectRatio: e.target.checked })
            }
            className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
            Maintain aspect ratio
          </span>
        </label>

        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.removeExif}
            onChange={(e) => onSettingsChange({ removeExif: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
            Remove EXIF metadata (GPS, camera info, etc.)
          </span>
          <span className="ml-2 text-xs text-gray-500" title="Removes location data, camera settings, and other metadata for privacy and smaller file size">
            ℹ️
          </span>
        </label>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 Tip: Quality of 80% provides the best balance between file size and image quality.
        </p>
      </div>
    </div>
  );
}
