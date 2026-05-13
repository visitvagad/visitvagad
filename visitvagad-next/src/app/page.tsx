import {
  HeroSection,
  WhyVagadSection,
  ExploreRegionsSection,
  FeaturedDestinationsSection,
  ExperienceGridSection,
  CultureSection,
  FestivalSection,
  GalleryGridSection,
  CTASection,
} from '@/components/features';
import { JsonLd, websiteJsonLd } from '@/lib/seo';

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <HeroSection />
      <WhyVagadSection />
      <ExploreRegionsSection />
      <FeaturedDestinationsSection />
      <ExperienceGridSection />
      <CultureSection />
      <FestivalSection />
      <GalleryGridSection />
      <CTASection />
    </>
  );
}
