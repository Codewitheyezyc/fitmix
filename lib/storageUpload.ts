import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

/**
 * Compresses an image blob or File using HTML5 Canvas to WebP format.
 */
async function compressImageToWebP(
  sourceBlob: Blob,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<Blob> {
  // If running in environment without HTMLImageElement (e.g. Node), return as is
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return sourceBlob;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(sourceBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      // Calculate constrained dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceBlob);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(sourceBlob);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(sourceBlob);
    };

    img.src = url;
  });
}

/**
 * Uploads a base64 Data URL, Blob, or File to Supabase Storage CDN.
 * Applies client-side compression to WebP and enforces a 5MB size limit.
 */
export async function uploadImageToStorage(
  source: string | Blob | File,
  bucket: 'pieces' | 'mixes' | 'avatars' = 'pieces',
  fileNamePrefix: string = 'img'
): Promise<string> {
  let rawBlob: Blob;

  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      const arr = source.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      rawBlob = new Blob([u8arr], { type: mime });
    } else if (source.startsWith('http://') || source.startsWith('https://')) {
      return source;
    } else {
      throw new Error('Invalid image source: must be a data URL, https URL, File, or Blob.');
    }
  } else {
    rawBlob = source;
  }

  // 1. Enforce 5MB Size Cap
  if (rawBlob.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the maximum allowed limit of 5MB.');
  }

  // 2. Compress Image to WebP
  const maxDim = bucket === 'avatars' ? 400 : 1200;
  const compressedBlob = await compressImageToWebP(rawBlob, maxDim, maxDim, 0.85);

  const filePath = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;

  // 3. Upload to Supabase Storage CDN with cache header
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, compressedBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year CDN cache
      upsert: true
    });

  if (error) {
    throw new Error(`Image upload failed (${bucket}): ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error(`Could not get public URL for uploaded image in bucket: ${bucket}`);
  }

  return publicUrlData.publicUrl;
}

/**
 * Returns an optimized CDN URL with Supabase Storage transformation parameters.
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url || !url.includes('supabase.co/storage/v1/object/public')) {
    return url;
  }

  // If Supabase Storage image transformations are enabled on project:
  const renderUrl = url.replace('/object/public/', '/render/image/public/');
  const params: string[] = [];
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  params.push('resize=contain');
  params.push('quality=80');

  return `${renderUrl}?${params.join('&')}`;
}

/**
 * Check whether a URL is a properly stored CDN URL (not a base64 data blob)
 */
export function isCloudUrl(url: string): boolean {
  return url.startsWith('https://') && !url.startsWith('data:');
}
