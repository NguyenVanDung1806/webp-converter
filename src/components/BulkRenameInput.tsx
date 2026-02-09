import { useState, useEffect } from 'react';
import type { RenameSettings } from '../types';
import { validateSlug, generatePreviewNames } from '../utils/vietnameseSlug';

interface BulkRenameInputProps {
  settings: RenameSettings;
  onSettingsChange: (settings: Partial<RenameSettings>) => void;
  imageCount: number;
}

export function BulkRenameInput({ settings, onSettingsChange, imageCount }: BulkRenameInputProps) {
  const [inputValue, setInputValue] = useState(settings.baseSlug);
  const validation = validateSlug(inputValue);
  const previewNames = generatePreviewNames(inputValue, 3);

  useEffect(() => {
    setInputValue(settings.baseSlug);
  }, [settings.baseSlug]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSettingsChange({ baseSlug: value });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">
        📝 Bulk Rename (Vietnamese Slug)
      </h3>

      {/* Input Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tên file gốc (slug):
        </label>
        <input
          type="text"
          placeholder="vd: du hoc va hoc bong"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="input-field w-full"
        />
        
        {/* Character Counter */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{inputValue.length} characters</span>
          <span className={inputValue.length > 60 ? 'text-yellow-400' : ''}>
            {inputValue.length > 60 ? 'Too long!' : 'Recommended: 10-50 chars'}
          </span>
        </div>
      </div>

      {/* Preview */}
      {inputValue.trim().length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ví dụ output:
          </label>
          <div className="bg-slate-900 rounded-lg p-3 space-y-1">
            {previewNames.map((name, i) => (
              <code key={i} className="block text-sm text-green-400 font-mono">
                {name}
              </code>
            ))}
            {imageCount > 3 && (
              <span className="text-xs text-gray-500">
                ... and {imageCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {validation.errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          {validation.errors.map((error, i) => (
            <p key={i} className="text-sm text-red-300">
              ❌ {error}
            </p>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          {validation.warnings.map((warning, i) => (
            <p key={i} className="text-sm text-yellow-300">
              ⚠️ {warning}
            </p>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Vietnamese characters will be converted automatically.
          <br />
          Example: "Học bổng Úc" → "hoc-bong-uc-1.webp"
        </p>
      </div>
    </div>
  );
}
