import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Food — Editorial', robots: { index: false } };

export default function AdminFoodPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Food & Cuisine</h1>
        <Link
          href="/admin/food/new"
          className="px-4 py-2.5 bg-deep-teal text-off-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors"
        >
          + New Item
        </Link>
      </div>
    </div>
  );
}
