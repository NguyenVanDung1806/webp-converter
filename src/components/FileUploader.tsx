import React, { useCallback, useState } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUploader({ onFilesSelected, disabled = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelected(Array.from(files));
      }
      // Reset input value to allow selecting the same files again
      e.target.value = '';
    },
    [onFilesSelected, disabled]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    document.getElementById('file-input')?.click();
  }, [disabled]);

  return (
    <div
      className={`card relative cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
          : 'border-slate-700 hover:border-primary-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center py-12 text-center">
        {/* Upload Icon */}
        <div className="mb-4">
          <svg
            className={`w-16 h-16 mx-auto ${
              isDragging ? 'text-primary-500' : 'text-gray-400'
            } transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Instructions */}
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging ? 'Drop your images here' : 'Upload Images'}
        </h3>
        <p className="text-gray-400 mb-4">
          Drag & drop images here, or click to browse
        </p>

        {/* Supported formats */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>Supported formats: JPG, PNG, GIF, BMP</p>
          <p>Max file size: 10MB per image</p>
          <p>Max batch: 50 images</p>
        </div>

        {/* Browse Button */}
        <button
          type="button"
          className="btn-primary mt-6"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={disabled}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
}
