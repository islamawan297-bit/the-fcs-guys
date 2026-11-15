import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireStaffSession } from '@/services/auth.service';
import { MediaUploadValidationSchema } from '@/lib/validations';
import { z } from 'zod';

export async function uploadEditorialMedia(params: {
  fileBuffer: Buffer;
  metadata: z.infer<typeof MediaUploadValidationSchema>;
}) {
  const { user } = await requireStaffSession();
  const validMeta = MediaUploadValidationSchema.parse(params.metadata);

  const supabase = await createServerSupabaseClient();
  const fileExt = validMeta.filename.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = validMeta.filename.replace(/[^a-zA-Z0-9-]/g, '_');
  const storagePath = `uploads/${Date.now()}_${cleanName}.${fileExt}`;

  // 1. Upload file binary into protected Supabase storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('editorial-media')
    .upload(storagePath, params.fileBuffer, {
      contentType: validMeta.mime_type,
      upsert: false,
    });

  if (storageError || !storageData) {
    throw new Error(`Media storage error: ${storageError?.message}`);
  }

  // 2. Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from('editorial-media')
    .getPublicUrl(storagePath);

  // 3. Record asset metadata into media_assets table
  const { data: assetRecord, error: assetError } = await supabase
    .from('media_assets')
    .insert({
      bucket_name: 'editorial-media',
      storage_path: storagePath,
      filename: validMeta.filename,
      file_size_bytes: validMeta.file_size_bytes,
      mime_type: validMeta.mime_type,
      alt_text: validMeta.alt_text,
      caption: validMeta.caption,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (assetError) throw assetError;

  return {
    asset: assetRecord,
    publicUrl,
  };
}

