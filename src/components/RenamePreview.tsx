import type { ImageFile } from '../types';
import { getWebPFileName } from '../utils/converter';

interface RenamePreviewProps {
  images: ImageFile[];
}

export function RenamePreview({ images }: RenamePreviewProps) {
  if (images.length === 0) {
    return null;
  }

  // Check if any image has a finalName different from original
  const hasRenames = images.some(img => 
    img.finalName && img.finalName !== getWebPFileName(img.file.name)
  );

  if (!hasRenames) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          🔄 Rename Preview
        </h3>
        <span className="text-sm text-gray-400">
          Đang đổi tên {images.length} ảnh
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-3 text-gray-400 font-medium">#</th>
              <th className="text-left py-2 px-3 text-gray-400 font-medium">Tên gốc</th>
              <th className="text-left py-2 px-3 text-gray-400 font-medium">→</th>
              <th className="text-left py-2 px-3 text-gray-400 font-medium">Tên mới</th>
            </tr>
          </thead>
          <tbody>
            {images.slice(0, 10).map((image, index) => (
              <tr 
                key={image.id} 
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                <td className="py-2 px-3 text-gray-300 font-mono text-xs truncate max-w-xs">
                  {image.file.name}
                </td>
                <td className="py-2 px-3 text-primary-400">→</td>
                <td className="py-2 px-3 text-green-400 font-mono text-xs truncate max-w-xs">
                  {image.finalName || getWebPFileName(image.file.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show more indicator */}
      {images.length > 10 && (
        <div className="mt-3 text-center text-sm text-gray-500">
          ... and {images.length - 10} more files
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <p className="text-sm text-green-300">
          ✅ All files will be renamed with SEO-friendly Vietnamese slugs
        </p>
      </div>
    </div>
  );
}
