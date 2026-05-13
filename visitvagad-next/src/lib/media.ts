'use server';

import { ID } from 'node-appwrite';
import { adminStorage } from '@/lib/appwrite-admin';
import { BUCKET_ID } from '@/lib/appwrite-schema';
import { requireAuth } from '@/lib/auth';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/validations';

export interface UploadResult {
  fileId: string;
  url: string;
}

export interface UploadError {
  error: string;
  code: 'NO_FILE' | 'TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED';
}

/** Upload a file with full validation */
export async function uploadFile(formData: FormData): Promise<UploadResult | UploadError> {
  await requireAuth();

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { error: 'No file provided', code: 'NO_FILE' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, code: 'TOO_LARGE' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return { error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, AVIF, SVG`, code: 'INVALID_TYPE' };
  }

  try {
    const result = await adminStorage.createFile(BUCKET_ID, ID.unique(), file);
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
    const url = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${result.$id}/view?project=${projectId}`;
    return { fileId: result.$id, url };
  } catch {
    return { error: 'Upload failed. Please try again.', code: 'UPLOAD_FAILED' };
  }
}

/** Delete a file (admin only) */
export async function deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
  await requireAuth();

  if (!fileId || typeof fileId !== 'string') {
    return { success: false, error: 'Invalid file ID' };
  }

  try {
    await adminStorage.deleteFile(BUCKET_ID, fileId);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete file' };
  }
}

/** Check if upload result is an error */
export function isUploadError(result: UploadResult | UploadError): result is UploadError {
  return 'error' in result;
}
