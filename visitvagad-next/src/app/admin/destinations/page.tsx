import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Destinations — Editorial', robots: { index: false } };

export default function AdminDestinationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Destinations</h1>
        <Link
          href="/admin/destinations/new"
          className="px-4 py-2.5 bg-deep-teal text-off-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors"
        >
          + New Destination
        </Link>
      </div>
      <p className="mt-2 text-sm text-text-muted">
        Connect Appwrite to see content. Create your first destination below.
      </p>
    </div>
  );
}
