import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Editorial Dashboard', robots: { index: false } };

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Editorial Dashboard</h1>
      <p className="mt-2 text-text-secondary">Manage destinations, events, food, and media.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Destinations', count: '—', href: '/admin/destinations' },
          { label: 'Events', count: '—', href: '/admin/events' },
          { label: 'Food', count: '—', href: '/admin/food' },
          { label: 'Media', count: '—', href: '/admin/media' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block p-5 rounded-2xl bg-surface border border-border hover:border-deep-teal/30 transition-colors"
          >
            <p className="text-sm text-text-muted">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{item.count}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
