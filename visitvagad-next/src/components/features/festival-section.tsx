import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { events } from '@/data';
import Link from 'next/link';

export function FestivalSection() {
  return (
    <Section spacing="md" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Festivals
          </p>
          <Heading as="h2">Celebrations of the Soul</Heading>
        </FadeIn>

        <StaggerContainer className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {events.map((event) => (
            <StaggerItem key={event.slug}>
              <Link href={`/events/${event.slug}`} className="group flex gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl hover:bg-surface transition-colors">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-xs uppercase tracking-wider text-text-muted">{event.category} · {event.district}</span>
                  <h3 className="mt-1 text-lg sm:text-xl font-medium text-text-primary group-hover:text-deep-teal transition-colors truncate">{event.title}</h3>
                  <p className="mt-1 sm:mt-2 text-sm text-text-secondary line-clamp-2">{event.description}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
