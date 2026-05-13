import { BUCKET_ID } from '@/lib/appwrite-schema';

/** Get preview URL with transformations */
export function getImageUrl(fileId: string, width?: number, height?: number): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  const params = new URLSearchParams({ project: projectId });
  if (width) params.set('width', String(width));
  if (height) params.set('height', String(height));
  params.set('output', 'webp');
  return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?${params.toString()}`;
}
