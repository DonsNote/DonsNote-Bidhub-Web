'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImageToSupabase, validateImageFile } from '@/lib/utils/imageUpload';
import Button from './Button';

export interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const ImageUpload = ({
  value = [],
  onChange,
  maxImages = 5,
  label,
  error,
  helperText,
  required = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(value);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(error);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 이미지 개수 체크
    if (previewUrls.length + files.length > maxImages) {
      setErrorMessage(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setErrorMessage(undefined);
    setUploading(true);
    setUploadProgress(new Array(files.length).fill(0));

    try {
      // 파일 검증
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setErrorMessage(validation.error);
          setUploading(false);
          return;
        }
      }

      // 이미지 업로드
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageToSupabase(file);
        uploadedUrls.push(url);

        // 진행률 업데이트
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[i] = 100;
          return newProgress;
        });
      }

      const newUrls = [...previewUrls, ...uploadedUrls];
      setPreviewUrls(newUrls);
      onChange(newUrls);
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setUploadProgress([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onChange(newUrls);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="font-medium text-sm text-[#121417] font-sans">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Image Grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#F0F2F5] group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove button */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="
                  absolute top-2 right-2
                  p-1.5 rounded-full
                  bg-red-500 text-white
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                  hover:bg-red-600
                "
                aria-label="Remove image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {previewUrls.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={uploading}
            loading={uploading}
            fullWidth
          >
            {uploading ? '업로드 중...' : '이미지 선택'}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0066FF] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-[#61758A] font-sans min-w-[45px] text-right">
                {progress}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error or Helper Text */}
      {(errorMessage || error) && (
        <p className="text-sm text-red-500 font-sans">{errorMessage || error}</p>
      )}

      {helperText && !errorMessage && !error && (
        <p className="text-sm text-[#61758A] font-sans">{helperText}</p>
      )}

      {/* Image Count */}
      <p className="text-sm text-[#61758A] font-sans">
        {previewUrls.length} / {maxImages} 이미지
      </p>
    </div>
  );
};

export default ImageUpload;
