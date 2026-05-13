import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://visitvagad.com';
const SITE_NAME = 'VisitVagad';

/** Generate canonical URL for a given path */
export function getCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** Generate page metadata with defaults */
export function createPageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = getCanonicalUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
  };
}

/** JSON-LD for TouristAttraction schema */
export function touristAttractionJsonLd({
  name,
  description,
  image,
  url,
  address,
}: {
  name: string;
  description: string;
  image?: string;
  url: string;
  address?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    url: getCanonicalUrl(url),
    ...(image && { image }),
    ...(address && {
      address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN', streetAddress: address },
    }),
  };
}

/** JSON-LD for Event schema */
export function eventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    url: getCanonicalUrl(url),
    location: { '@type': 'Place', name: location, address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' } },
  };
}

/** JSON-LD for BreadcrumbList */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };
}

/** JSON-LD for FAQPage schema */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** JSON-LD for WebSite schema (homepage) */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Discover the sun-drenched heritage of Rajasthan\'s Vagad region.',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

/** Generate OG image URL (for future dynamic OG image API route) */
export function getOgImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title, ...(subtitle && { subtitle }) });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Render JSON-LD script tag (use in page components) */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
