import { supabase } from '@/lib/supabase';

/**
 * Uploads a base64 Data URL, Blob, or File to Supabase Storage and returns its public URL
 */
export async function uploadImageToStorage(
  source: string | Blob | File,
  bucket: 'pieces' | 'mixes' | 'avatars' = 'pieces',
  fileNamePrefix: string = 'img'
): Promise<string> {
  try {
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
        // Already a remote URL
        return source;
      } else {
        return source;
      }
    } else {
      blob = source;
    }

    const fileExt = blob.type === 'image/jpeg' ? 'jpg' : 'png';
    const filePath = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: blob.type || 'image/png',
        upsert: true
      });

    if (error) {
      console.warn(`Supabase Storage upload warning (${bucket}):`, error.message);
      // If upload fails, fallback to source if string
      return typeof source === 'string' ? source : '';
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Storage upload exception:', err);
    return typeof source === 'string' ? source : '';
  }
}
