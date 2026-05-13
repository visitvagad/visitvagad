'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui';

const navLinks = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Culture', href: '/culture' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'Stays', href: '/stays' },
  { label: 'Plan Your Trip', href: '/plan-your-trip' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-surface/80 backdrop-blur-md border-b border-border'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
          <Link href="/" className="text-xl font-bold text-deep-teal tracking-tight">
            VisitVagad
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 py-2 ${
                    pathname.startsWith(link.href)
                      ? 'text-deep-teal'
                      : 'text-text-secondary hover:text-deep-teal'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle - 44px min touch target */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 text-text-primary rounded-xl hover:bg-surface-alt transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-border bg-surface overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Container>
          <ul className="py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center min-h-[44px] px-2 text-base font-medium rounded-xl transition-colors ${
                    pathname.startsWith(link.href)
                      ? 'text-deep-teal bg-deep-teal/5'
                      : 'text-text-secondary hover:text-deep-teal hover:bg-surface-alt'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}
