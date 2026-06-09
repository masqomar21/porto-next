'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { File, FileText, FileArchive, FileAudio, FileVideo, Image as FileImage, Upload, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
}

const getFileIcon = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'odt':
      return FileText;
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z':
      return FileArchive;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return FileAudio;
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
      return FileVideo;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'gif':
    case 'svg':
      return FileImage;
    default:
      return File;
  }
};

export function FileUpload({
  value,
  onChange,
  maxSizeMB = 10,
  className,
  disabled = false,
  allowedTypes,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    setError(null);

    const file = files[0];

    // Check allowedTypes if provided
    if (allowedTypes && allowedTypes.length > 0) {
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType + '/');
        }
        return file.type === type;
      });

      if (!isAllowed) {
        const allowedExtensions = allowedTypes
          .map((t) => {
            const ext = t.split('/').pop()?.toUpperCase();
            return ext === '*' ? 'Files' : ext;
          })
          .filter(Boolean)
          .join(', ');
        setError(`Invalid file type. Allowed formats: ${allowedExtensions}`);
        return;
      }
    }

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    // Direct upload
    setIsUploading(true);
    setUploadProgress(10);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + 5;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload file');
      }

      setUploadProgress(100);
      const data = await res.json();

      setTimeout(() => {
        setIsUploading(false);
        onChange(data.url);
      }, 300);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || 'An error occurred during upload.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || isUploading) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || isUploading) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || isUploading) return;
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Icon for the uploaded file
  const FileIconComponent = value ? getFileIcon(value) : File;
  const fileName = value ? value.split('/').pop() : '';

  // Allowed extensions for description
  const allowedExtensionsText = allowedTypes && allowedTypes.length > 0
    ? allowedTypes.map(t => {
        const ext = t.split('/').pop()?.toUpperCase();
        return ext === '*' ? 'Files' : ext;
      }).join(', ')
    : 'Any format';

  return (
    <div className={cn('w-full space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes ? allowedTypes.join(',') : undefined}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload Zone or Preview */}
      {value ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 shadow-sm transition-all duration-300 hover:shadow-md gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-3 bg-violet-500/10 text-violet-500 rounded-lg shrink-0 border border-violet-500/20">
              <FileIconComponent className="w-6 h-6" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-medium text-sm text-foreground truncate max-w-[250px] sm:max-w-[350px]">
                {fileName || 'Uploaded File'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border/50"
              title="Open File"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors border border-border/50 cursor-pointer"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer select-none flex flex-col items-center justify-center gap-3 bg-card/30 relative overflow-hidden',
            isDragging
              ? 'border-violet-500 bg-violet-500/5 scale-[0.985] shadow-inner'
              : 'border-border hover:border-violet-500/50 hover:bg-muted/30',
            (disabled || isUploading) && 'opacity-60 cursor-not-allowed pointer-events-none'
          )}
        >
          {isUploading ? (
            <div className="w-full max-w-xs py-4 flex flex-col items-center gap-3 animate-in fade-in duration-300">
              <div className="p-3 bg-violet-500/10 text-violet-500 rounded-full animate-pulse">
                <Upload className="w-6 h-6 animate-bounce" />
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-muted/60 text-muted-foreground rounded-full border border-border group-hover:border-violet-500/20 transition-all duration-300">
                <Upload className="w-6 h-6 text-muted-foreground/80" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {allowedExtensionsText} (max. {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs font-semibold text-destructive px-1.5 py-1 bg-destructive/10 border border-destructive/20 rounded-md animate-in slide-in-from-top-1 duration-200">
          {error}
        </div>
      )}
    </div>
  );
}
