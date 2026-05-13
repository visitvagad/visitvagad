'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadFile, deleteFile, isUploadError } from '@/lib/media';
import type { UploadResult, UploadError } from '@/lib/media';

interface ImageUploadProps {
  value: string;
  fileId?: string;
  onChange: (url: string, fileId: string) => void;
  onRemove?: () => void;
  label?: string;
  altText?: string;
  onAltChange?: (alt: string) => void;
}

export function ImageUpload({
  value,
  fileId,
  onChange,
  onRemove,
  label = 'Upload Image',
  altText = '',
  onAltChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    setProgress(50);
    const result = await uploadFile(formData);
    setProgress(90);

    if (isUploadError(result)) {
      setError((result as UploadError).error);
      setUploading(false);
      setProgress(0);
      return;
    }

    const success = result as UploadResult;
    onChange(success.url, success.fileId);
    setUploading(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  }, [onChange]);

  const handleDelete = useCallback(async () => {
    if (!fileId) {
      onRemove?.();
      setConfirmDelete(false);
      return;
    }

    await deleteFile(fileId);
    onRemove?.();
    setConfirmDelete(false);
  }, [fileId, onRemove]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-primary">{label}</p>

      {value && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-alt border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={altText || 'Preview'} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-deep-teal transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      {/* Alt text input */}
      {value && onAltChange && (
        <input
          type="text"
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Alt text (describe the image)"
          className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 text-sm font-medium bg-surface border border-border rounded-xl hover:border-deep-teal/30 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Choose File'}
        </button>

        {value && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        )}

        {confirmDelete && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Delete this image?</span>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        onChange={handleUpload}
        className="hidden"
        aria-label={label}
      />
    </div>
  );
}
