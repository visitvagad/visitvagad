import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { destinations, getDestinationBySlug } from '@/data';
import { getCanonicalUrl, touristAttractionJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import {
  DestinationHero,
  DestinationStory,
  DestinationHighlights,
  DestinationGallery,
  NearbyPlaces,
  TravelTips,
} from '@/components/features';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: 'Not Found' };

  const url = `/destinations/${dest.slug}`;
  return {
    title: dest.seo.title,
    description: dest.seo.description,
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: {
      title: dest.seo.title,
      description: dest.seo.description,
      url: getCanonicalUrl(url),
      images: dest.seo.ogImage ? [{ url: dest.seo.ogImage }] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const jsonLd = touristAttractionJsonLd({
    name: dest.title,
    description: dest.seo.description,
    image: dest.heroImage,
    url: `/destinations/${dest.slug}`,
    address: `${dest.district}, Rajasthan`,
  });

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: dest.title, url: `/destinations/${dest.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />
      <DestinationHero destination={dest} />
      <Container>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Destinations', href: '/destinations' },
          { label: dest.title },
        ]} />
      </Container>
      <DestinationStory story={dest.story} />
      <DestinationHighlights highlights={dest.highlights} />
      <DestinationGallery gallery={dest.gallery} />
      <TravelTips bestTime={dest.bestTime} coordinates={dest.coordinates} />
      <NearbyPlaces places={dest.nearbyPlaces} />
    </>
  );
}
