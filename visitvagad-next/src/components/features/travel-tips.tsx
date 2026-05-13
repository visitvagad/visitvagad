import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';

interface TravelTipsProps {
  bestTime: string;
  coordinates: { lat: number; lng: number };
}

export function TravelTips({ bestTime, coordinates }: TravelTipsProps) {
  return (
    <Section spacing="md">
      <Container className="max-w-3xl">
        <FadeIn>
          <Heading as="h2">Travel Tips</Heading>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted">Best Time to Visit</dt>
              <dd className="mt-1 text-text-secondary">{bestTime}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted">Location</dt>
              <dd className="mt-1 text-text-secondary">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium uppercase tracking-wider text-text-muted">Getting There</dt>
              <dd className="mt-1 text-text-secondary">
                Nearest airport: Udaipur (Maharana Pratap Airport). Well-connected by road from Udaipur, Ahmedabad, and Indore.
              </dd>
            </div>
          </dl>
        </FadeIn>
      </Container>
    </Section>
  );
}
