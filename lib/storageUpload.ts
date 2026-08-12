import { supabase } from '@/lib/supabase';

/**
 * Uploads a base64 Data URL, Blob, or File to Supabase Storage CDN.
 * Returns the permanent public HTTPS URL.
 * 
 * Throws an error if the upload fails — callers must handle this
 * and show a user-facing error instead of silently falling back to base64.
 */
export async function uploadImageToStorage(
  source: string | Blob | File,
  bucket: 'pieces' | 'mixes' | 'avatars' = 'pieces',
  fileNamePrefix: string = 'img'
): Promise<string> {
  let blob: Blob;

  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      // Convert Base64 data URL to Blob
      const arr = source.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else if (source.startsWith('http://') || source.startsWith('https://')) {
      // Already a remote CDN URL — return as-is (no re-upload needed)
      return source;
    } else {
      throw new Error('Invalid image source: must be a data URL, https URL, File, or Blob.');
    }
  } else {
    blob = source;
  }

  const fileExt = blob.type === 'image/jpeg' ? 'jpg'
    : blob.type === 'image/webp' ? 'webp'
    : 'png';
  const filePath = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, blob, {
      contentType: blob.type || 'image/png',
      upsert: true
    });

  if (error) {
    // Throw so callers can surface a real error to the user
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
 * Check whether a URL is a properly stored CDN URL (not a base64 data blob)
 */
export function isCloudUrl(url: string): boolean {
  return url.startsWith('https://') && !url.startsWith('data:');
}
