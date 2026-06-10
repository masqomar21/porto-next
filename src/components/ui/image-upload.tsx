'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageEditorModal } from '@/components/ui/image-editor-modal';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | '9:16' | 'original' | 'free';
}

export function ImageUpload({
  value,
  onChange,
  maxSizeMB = 5,
  className,
  disabled = false,
  allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  aspectRatio = 'free',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image editor modal states
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const triggerFileInput = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    setError(null);

    const file = files[0];
    
    // Check if image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Check allowedTypes
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
            return ext === '*' ? 'Images' : ext;
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

    // Open image in the Editor Modal instead of uploading directly
    const reader = new FileReader();
    reader.onload = () => {
      setEditorImageSrc(reader.result as string);
      setPendingFile(file);
      setEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Upload the edited blob to S3
  const handleUploadEdited = async (blob: Blob) => {
    if (!pendingFile) return;
    setEditorOpen(false);
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
      // Create edited filename with .webp extension
      const originalName = pendingFile.name.substring(0, pendingFile.name.lastIndexOf('.')) || pendingFile.name;
      const editedFile = new File([blob], `${originalName}-edited.webp`, { type: 'image/webp' });
      formData.append('file', editedFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      setUploadProgress(100);
      const data = await res.json();
      
      setTimeout(() => {
        setIsUploading(false);
        onChange(data.url);
        // Clean up pending states
        setPendingFile(null);
        setEditorImageSrc(null);
      }, 300);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || 'An error occurred during upload.');
      setPendingFile(null);
      setEditorImageSrc(null);
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

  // Format allowed types for text display
  const allowedExtensionsText = allowedTypes
    .map((t) => {
      const ext = t.split('/').pop()?.toUpperCase();
      return ext === 'JPEG' ? 'JPG' : ext;
    })
    .filter(Boolean)
    .join(', ');

  return (
    <div className={cn('w-full space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload Zone or Preview */}
      {value ? (
        <div className="relative group overflow-hidden rounded-xl border border-border bg-card/50 aspect-video md:aspect-[3/1] max-h-[220px] flex items-center justify-center p-2 shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Image display */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Elegant overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              title="View original image"
            >
              <Eye className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick info badge */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 text-white/90 text-xs font-mono rounded-md backdrop-blur-sm pointer-events-none">
            {value.split('/').pop()?.substring(0, 24) || 'Uploaded Image'}
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

      {/* Interactive Image Editor Modal */}
      <ImageEditorModal
        open={editorOpen}
        imageSrc={editorImageSrc}
        aspectRatio={aspectRatio}
        onClose={() => {
          setEditorOpen(false);
          setPendingFile(null);
          setEditorImageSrc(null);
        }}
        onSave={handleUploadEdited}
      />
    </div>
  );
}
