import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import type { NearbyPlace } from '@/types';
import Link from 'next/link';

export function NearbyPlaces({ places }: { places: NearbyPlace[] }) {
  return (
    <Section spacing="md" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <Heading as="h2">Nearby Places</Heading>
        </FadeIn>
        <StaggerContainer className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place) => (
            <StaggerItem key={place.slug}>
              <Link href={`/destinations/${place.slug}`} className="group block">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${place.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-medium text-off-white">{place.title}</h3>
                    <p className="text-xs text-off-white/60">{place.distance} away</p>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
