import { supabase } from './supabase';

/**
 * Uploads a base64 Data URL or Blob to Supabase Storage and returns the public CDN URL.
 */
export async function uploadCutoutToSupabase(
  dataUrlOrBlob: string | Blob,
  fileName: string,
  bucket: 'pieces' | 'mixes' | 'avatars' = 'pieces'
): Promise<string> {
  try {
    let fileBlob: Blob;

    if (typeof dataUrlOrBlob === 'string') {
      // If it's a data URL, convert to Blob
      if (dataUrlOrBlob.startsWith('data:')) {
        const res = await fetch(dataUrlOrBlob);
        fileBlob = await res.blob();
      } else {
        // Already a remote URL
        return dataUrlOrBlob;
      }
    } else {
      fileBlob = dataUrlOrBlob;
    }

    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png'
      });

    if (error) {
      console.warn('Supabase storage upload fallback:', error.message);
      // Fallback to data URL if offline/unauthenticated
      return typeof dataUrlOrBlob === 'string' ? dataUrlOrBlob : URL.createObjectURL(fileBlob);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Storage upload error:', err);
    return typeof dataUrlOrBlob === 'string' ? dataUrlOrBlob : '';
  }
}
