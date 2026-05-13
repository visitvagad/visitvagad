import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import type { GalleryImage } from '@/types';

export function DestinationGallery({ gallery }: { gallery: GalleryImage[] }) {
  return (
    <Section spacing="md">
      <Container>
        <FadeIn>
          <Heading as="h2">Gallery</Heading>
        </FadeIn>
        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((img) => (
            <StaggerItem key={img.src}>
              <div className="relative h-56 rounded-2xl overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${img.src}')` }}
                />
              </div>
              {img.caption && <p className="mt-2 text-sm text-text-muted">{img.caption}</p>}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
