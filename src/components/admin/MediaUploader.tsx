'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Upload, 
  X, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface MediaUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function MediaUploader({ value, onChange, className = '' }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError('Invalid format. Only JPEG, PNG, WEBP, and GIF images are allowed.');
      return;
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max limit is 5 MB.`);
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();

      // Ensure session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required. Please log into the admin dashboard before uploading media.');
      }

      // 3. Generate unique, collision-proof path
      const year = new Date().getFullYear();
      const timestamp = Date.now();
      const randomNonce = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 40);

      const filePath = `articles/${year}/${timestamp}-${randomNonce}-${cleanFileName}.${extension}`;

      // 4. Upload to editorial-media bucket
      const { data, error } = await supabase.storage
        .from('editorial-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        throw error;
      }

      // 5. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('editorial-media')
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL for uploaded media.');
      }

      onChange(publicUrlData.publicUrl);
    } catch (err: unknown) {
      console.error('Media upload error:', err);
      const message = err instanceof Error ? err.message : 'Upload failed. Ensure you have authorized editor permissions.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange(null);
    setUploadError(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#282828] bg-[#141414] group">
          <div className="aspect-[16/9] w-full relative overflow-hidden bg-[#111111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded article banner"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
          </div>

          <div className="p-3 bg-[#181818] border-t border-[#282828] flex items-center justify-between text-xs">
            <span className="text-[#888888] truncate max-w-xs font-mono text-[11px]">
              {value}
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1 bg-[#252525] hover:bg-[#333333] text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="p-1 hover:bg-rose-500/20 text-[#888888] hover:text-rose-400 rounded transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2.5 ${
            isDragOver
              ? 'border-[#FFD400] bg-[#FFD400]/5'
              : 'border-[#333333] hover:border-[#555555] bg-[#141414]/80 hover:bg-[#181818]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-4">
              <Loader2 className="w-8 h-8 text-[#FFD400] animate-spin" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Uploading to editorial-media bucket...
              </p>
              <p className="text-[11px] text-[#888888]">
                Applying Supabase RLS and generating public media URL
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#202020] flex items-center justify-center text-[#888888] group-hover:text-[#FFD400] transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Drag & Drop or <span className="text-[#FFD400] underline">Browse Image</span>
                </p>
                <p className="text-[11px] text-[#777777]">
                  Supports JPEG, PNG, WEBP, GIF (Max 5 MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
