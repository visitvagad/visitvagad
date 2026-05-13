import type { Destination, Experience, Region, Event } from '@/types';

export const destinations: Destination[] = [
  {
    slug: 'mangarh-hill',
    title: 'Mangarh Hill',
    district: 'Banswara',
    heroImage: '/images/destinations/mangarh-hero.jpg',
    summary: 'The sacred hill where 1,500 Bhil freedom fighters sacrificed their lives in 1913 — a monument to tribal resistance and courage.',
    story: 'Mangarh Hill stands as a powerful testament to the Bhil tribal uprising led by Govind Guru against British colonial rule. On November 17, 1913, British forces opened fire on a gathering of over 1,500 tribal people who had assembled to protest unjust taxation and forced labor. Often called the "Adivasi Jallianwala," this massacre predates the Jallianwala Bagh tragedy by six years. Today, the hill is a national monument honoring the courage of the Bhil community and their unwavering fight for freedom.',
    highlights: [
      { icon: '🏔️', title: 'Sacred Monument', description: 'National monument honoring 1,500 Bhil martyrs of 1913' },
      { icon: '🌅', title: 'Panoramic Views', description: 'Sweeping views of the Vagad landscape from the hilltop' },
      { icon: '📜', title: 'Living History', description: 'Museum and memorial documenting the tribal freedom movement' },
    ],
    gallery: [
      { src: '/images/destinations/mangarh-1.jpg', alt: 'Mangarh Hill memorial at sunrise' },
      { src: '/images/destinations/mangarh-2.jpg', alt: 'Panoramic view from Mangarh hilltop' },
      { src: '/images/destinations/mangarh-3.jpg', alt: 'Govind Guru memorial statue' },
    ],
    experiences: ['heritage-walk', 'tribal-history'],
    bestTime: 'October to March — pleasant weather ideal for the hilltop trek',
    coordinates: { lat: 23.5547, lng: 74.1107 },
    nearbyPlaces: [
      { slug: 'arthuna-temples', title: 'Arthuna Temples', distance: '45 km', image: '/images/destinations/arthuna-thumb.jpg' },
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '60 km', image: '/images/destinations/beneshwar-thumb.jpg' },
    ],
    seo: {
      title: 'Mangarh Hill — Tribal Freedom Monument | VisitVagad',
      description: 'Visit Mangarh Hill, the sacred site of the 1913 Bhil uprising. A national monument honoring tribal resistance in Rajasthan\'s Vagad region.',
    },
    featured: true,
  },
  {
    slug: 'beneshwar-dham',
    title: 'Beneshwar Dham',
    district: 'Dungarpur',
    heroImage: '/images/destinations/beneshwar-hero.jpg',
    summary: 'A sacred delta at the confluence of three rivers — the tribal Kumbh where millions gather each year for the Beneshwar Fair.',
    story: 'Beneshwar Dham is a naturally formed delta at the sacred confluence of the Som, Mahi, and Jakham rivers. Revered as the "Tribal Kumbh," it hosts one of Rajasthan\'s largest fairs every Magh Purnima, drawing over a million devotees from the Bhil, Meena, and Garasia communities. The ancient Shiva temple at its center, believed to house a self-manifested lingam, makes this a site of deep spiritual significance. The fair transforms the riverbanks into a vibrant celebration of tribal music, dance, and devotion.',
    highlights: [
      { icon: '🌊', title: 'Sacred Confluence', description: 'Meeting point of Som, Mahi, and Jakham rivers' },
      { icon: '🛕', title: 'Ancient Temple', description: 'Shiva temple with a self-manifested lingam' },
      { icon: '🎪', title: 'Tribal Kumbh', description: 'Annual fair drawing over a million devotees' },
    ],
    gallery: [
      { src: '/images/destinations/beneshwar-1.jpg', alt: 'Aerial view of Beneshwar delta' },
      { src: '/images/destinations/beneshwar-2.jpg', alt: 'Devotees at the sacred confluence' },
      { src: '/images/destinations/beneshwar-3.jpg', alt: 'Beneshwar Fair celebrations' },
    ],
    experiences: ['spiritual-journey', 'tribal-fair'],
    bestTime: 'January to February — coincides with the Beneshwar Fair on Magh Purnima',
    coordinates: { lat: 23.6167, lng: 73.8833 },
    nearbyPlaces: [
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '60 km', image: '/images/destinations/mangarh-thumb.jpg' },
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '35 km', image: '/images/destinations/gaibsagar-thumb.jpg' },
    ],
    seo: {
      title: 'Beneshwar Dham — The Tribal Kumbh | VisitVagad',
      description: 'Discover Beneshwar Dham, the sacred river confluence and tribal Kumbh of Rajasthan. Ancient temples, vibrant fairs, and spiritual heritage.',
    },
    featured: true,
  },
  {
    slug: 'gaib-sagar-lake',
    title: 'Gaib Sagar Lake',
    district: 'Dungarpur',
    heroImage: '/images/destinations/gaibsagar-hero.jpg',
    summary: 'A serene 18th-century lake in the heart of Dungarpur, surrounded by heritage architecture and migratory birds.',
    story: 'Built by Maharawal Gopinath in the 18th century, Gaib Sagar Lake is the cultural heart of Dungarpur city. Its tranquil waters reflect the ornate Badal Mahal and Udai Bilas Palace on its shores. During winter months, the lake becomes a haven for migratory birds, including flamingos and painted storks. The surrounding ghats come alive during festivals, when locals gather for evening aartis and cultural celebrations. It represents the harmonious blend of Vagad\'s royal heritage and natural beauty.',
    highlights: [
      { icon: '🦩', title: 'Bird Sanctuary', description: 'Winter home to flamingos, storks, and migratory species' },
      { icon: '🏛️', title: 'Heritage Shores', description: 'Badal Mahal and Udai Bilas Palace on the lakefront' },
      { icon: '🌅', title: 'Golden Hour', description: 'Stunning sunset views over the heritage skyline' },
    ],
    gallery: [
      { src: '/images/destinations/gaibsagar-1.jpg', alt: 'Gaib Sagar Lake at sunset' },
      { src: '/images/destinations/gaibsagar-2.jpg', alt: 'Migratory birds on Gaib Sagar' },
      { src: '/images/destinations/gaibsagar-3.jpg', alt: 'Badal Mahal reflected in the lake' },
    ],
    experiences: ['bird-watching', 'heritage-walk'],
    bestTime: 'November to February — migratory birds and pleasant weather',
    coordinates: { lat: 23.8417, lng: 73.7147 },
    nearbyPlaces: [
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '35 km', image: '/images/destinations/beneshwar-thumb.jpg' },
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '90 km', image: '/images/destinations/mangarh-thumb.jpg' },
    ],
    seo: {
      title: 'Gaib Sagar Lake — Heritage Lake of Dungarpur | VisitVagad',
      description: 'Visit Gaib Sagar Lake in Dungarpur — an 18th-century heritage lake surrounded by palaces, temples, and migratory birds.',
    },
    featured: true,
  },
];

export const experiences: Experience[] = [
  { id: 'heritage-walk', title: 'Heritage Walks', description: 'Walk through centuries of tribal and royal history', image: '/images/experiences/heritage-walk.jpg', category: 'culture' },
  { id: 'tribal-history', title: 'Tribal History Tours', description: 'Discover the untold stories of Bhil resistance', image: '/images/experiences/tribal-history.jpg', category: 'culture' },
  { id: 'bird-watching', title: 'Bird Watching', description: 'Spot migratory species at pristine lakes', image: '/images/experiences/bird-watching.jpg', category: 'nature' },
  { id: 'spiritual-journey', title: 'Spiritual Journeys', description: 'Visit ancient temples and sacred confluences', image: '/images/experiences/spiritual.jpg', category: 'spiritual' },
  { id: 'tribal-fair', title: 'Tribal Fairs', description: 'Experience vibrant Bhil and Meena celebrations', image: '/images/experiences/tribal-fair.jpg', category: 'culture' },
  { id: 'eco-trek', title: 'Eco Treks', description: 'Trek through the Aravalli foothills and forests', image: '/images/experiences/eco-trek.jpg', category: 'adventure' },
];

export const regions: Region[] = [
  { id: 'banswara', name: 'Banswara', tagline: 'City of a Hundred Islands', image: '/images/regions/banswara.jpg', destinationCount: 12 },
  { id: 'dungarpur', name: 'Dungarpur', tagline: 'City of Hills', image: '/images/regions/dungarpur.jpg', destinationCount: 10 },
];

export const events: Event[] = [
  {
    slug: 'beneshwar-fair',
    title: 'Beneshwar Fair',
    description: 'The largest tribal fair in Rajasthan, held at the sacred confluence of three rivers during Magh Purnima.',
    image: '/images/events/beneshwar-fair.jpg',
    date: '2026-02-12',
    endDate: '2026-02-14',
    location: 'Beneshwar Dham, Dungarpur',
    district: 'Dungarpur',
    category: 'fair',
    seo: { title: 'Beneshwar Fair 2026 | VisitVagad', description: 'Experience the Beneshwar Fair — Rajasthan\'s largest tribal gathering at the sacred river confluence.' },
  },
  {
    slug: 'baneshwar-mahotsav',
    title: 'Vagad Mahotsav',
    description: 'A celebration of Vagad\'s tribal art, music, dance, and culinary traditions.',
    image: '/images/events/vagad-mahotsav.jpg',
    date: '2026-03-15',
    endDate: '2026-03-17',
    location: 'Banswara',
    district: 'Banswara',
    category: 'cultural',
    seo: { title: 'Vagad Mahotsav 2026 | VisitVagad', description: 'Vagad Mahotsav — celebrating tribal art, music, and culinary heritage of the Vagad region.' },
  },
];

/** Helper to find a destination by slug */
export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** Get featured destinations */
export function getFeaturedDestinations(): Destination[] {
  return destinations.filter((d) => d.featured);
}
