import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Media — Editorial', robots: { index: false } };

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Media Library</h1>
      <p className="mt-2 text-sm text-text-muted">Upload and manage images for the platform.</p>
    </div>
  );
}
