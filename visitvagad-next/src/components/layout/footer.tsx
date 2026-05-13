import Link from 'next/link';
import { Container } from '@/components/ui';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Culture', href: '/culture' },
      { label: 'Food', href: '/food' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Itineraries', href: '/itineraries' },
      { label: 'Stays', href: '/stays' },
      { label: 'Plan Your Trip', href: '/plan-your-trip' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About Vagad', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-dark text-text-inverse" role="contentinfo">
      <Container>
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-off-white tracking-tight">
              VisitVagad
            </Link>
            <p className="mt-4 text-sm text-text-inverse/70 leading-relaxed">
              Discover the sun-drenched heritage of Rajasthan&apos;s Vagad region — tribal culture, eco-tourism, and timeless stories.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-inverse/50 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-inverse/70 hover:text-off-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-text-inverse/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-inverse/50">
            © {new Date().getFullYear()} VisitVagad. All rights reserved.
          </p>
          <p className="text-xs text-text-inverse/50">
            A cultural preservation initiative for the Vagad region.
          </p>
        </div>
      </Container>
    </footer>
  );
}
