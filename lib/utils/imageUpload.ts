import { supabase } from '../supabase/client';

export interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  bucket?: string;
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  maxSizeMB: 5,
  maxWidthOrHeight: 1920,
  quality: 0.85,
  bucket: 'auction-images',
};

/**
 * 이미지를 압축합니다
 */
export async function compressImage(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 최대 크기로 리사이즈
        if (width > opts.maxWidthOrHeight || height > opts.maxWidthOrHeight) {
          if (width > height) {
            height = (height / width) * opts.maxWidthOrHeight;
            width = opts.maxWidthOrHeight;
          } else {
            width = (width / height) * opts.maxWidthOrHeight;
            height = opts.maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // 압축 후 파일 크기 확인
            const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;
            if (blob.size > maxSizeBytes) {
              reject(new Error(`Image size exceeds ${opts.maxSizeMB}MB`));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          opts.quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Supabase Storage에 이미지를 업로드합니다
 */
export async function uploadImageToSupabase(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // 이미지 압축
    const compressedFile = await compressImage(file, opts);

    // 고유한 파일명 생성
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from(opts.bucket)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from(opts.bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Supabase Storage에서 이미지를 삭제합니다
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucket: string = DEFAULT_OPTIONS.bucket
): Promise<void> {
  try {
    // URL에서 파일 경로 추출
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Image delete error:', error);
    throw error;
  }
}

/**
 * 여러 이미지를 동시에 업로드합니다
 */
export async function uploadMultipleImages(
  files: File[],
  options: Partial<ImageUploadOptions> = {}
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImageToSupabase(file, options));
  return Promise.all(uploadPromises);
}

/**
 * 이미지 파일 검증
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 타입 검증
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.',
    };
  }

  // 파일 크기 검증 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '이미지 크기는 10MB를 초과할 수 없습니다.',
    };
  }

  return { valid: true };
}
