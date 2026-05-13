import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';

const galleryImages = [
  { src: '/images/gallery/vagad-1.jpg', alt: 'Sunrise over Mahi river', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/gallery/vagad-2.jpg', alt: 'Bhil tribal art', span: '' },
  { src: '/images/gallery/vagad-3.jpg', alt: 'Dungarpur palace architecture', span: '' },
  { src: '/images/gallery/vagad-4.jpg', alt: 'Tribal dance celebration', span: 'sm:col-span-2' },
  { src: '/images/gallery/vagad-5.jpg', alt: 'Banswara island landscape', span: '' },
];

export function GalleryGridSection() {
  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Gallery
          </p>
          <Heading as="h2">Visual Stories</Heading>
        </FadeIn>

        <StaggerContainer className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[200px]">
          {galleryImages.map((img) => (
            <StaggerItem key={img.src} className={img.span}>
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${img.src}')` }}
                  role="img"
                  aria-label={img.alt}
                />
                <div className="absolute inset-0 bg-surface-dark/0 group-hover:bg-surface-dark/20 transition-colors duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
