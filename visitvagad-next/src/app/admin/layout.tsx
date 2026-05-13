'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/ui/logout-button';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: '◻' },
  { label: 'Destinations', href: '/admin/destinations', icon: '◈' },
  { label: 'Events', href: '/admin/events', icon: '◉' },
  { label: 'Food', href: '/admin/food', icon: '◎' },
  { label: 'Media', href: '/admin/media', icon: '◐' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-surface-alt">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border hidden md:flex flex-col">
        <div className="p-5 border-b border-border">
          <Link href="/admin" className="text-lg font-bold text-deep-teal tracking-tight">
            VV Editorial
          </Link>
        </div>
        <nav className="flex-1 p-3" aria-label="Admin navigation">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-deep-teal/10 text-deep-teal'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                    }`}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link href="/" className="block text-xs text-text-muted hover:text-deep-teal transition-colors">
            ← Back to site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface">
          <Link href="/admin" className="text-lg font-bold text-deep-teal">VV Editorial</Link>
          <Link href="/" className="text-xs text-text-muted">← Site</Link>
        </header>
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
