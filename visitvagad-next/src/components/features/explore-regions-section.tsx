import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { regions } from '@/data';
import Link from 'next/link';

export function ExploreRegionsSection() {
  return (
    <Section spacing="md" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Explore
          </p>
          <Heading as="h2">Two Regions, One Soul</Heading>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {regions.map((region) => (
            <StaggerItem key={region.id}>
              <Link href={`/destinations?region=${region.id}`} className="group block relative h-80 rounded-2xl overflow-hidden" aria-label={`Explore ${region.name} — ${region.tagline}`}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${region.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-semibold text-off-white">{region.name}</h3>
                  <p className="mt-1 text-sm text-off-white/70">{region.tagline}</p>
                  <p className="mt-2 text-xs text-off-white/50">{region.destinationCount} destinations</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
