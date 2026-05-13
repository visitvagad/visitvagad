/**
 * Seed realistic Vagad tourism content into Appwrite.
 * Run: npm run seed
 *
 * Seeds: destinations, events, food, experiences, regions.
 * Safe to re-run — uses slug-based deduplication.
 */
import { Client, Databases, ID, Query } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from '../src/lib/appwrite-schema';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('✗ Missing env vars. Run: npm run env:check');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const db = new Databases(client);

// ─── SEED DATA ──────────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    title: 'Mangarh Hill',
    slug: 'mangarh-hill',
    district: 'Banswara',
    summary: 'Sacred hill where 1,500 Bhil freedom fighters were martyred in 1913. A powerful symbol of tribal resistance and India\'s independence movement.',
    story: 'Mangarh Hill stands as a testament to the courage of the Bhil community. On November 17, 1913, British forces opened fire on a gathering of over 1,500 tribal people led by Govind Guru, who were peacefully protesting against colonial oppression. Often called the "Adivasi Jallianwala," this site was recognized as a national monument in 2022. The hill offers panoramic views of the Vagad landscape and houses a memorial dedicated to the martyrs.',
    bestTime: 'October to March',
    lat: 23.5847,
    lng: 74.1089,
    highlights: JSON.stringify([
      { icon: '🏔️', title: 'Martyrs Memorial', description: 'Monument honoring 1,500 Bhil freedom fighters' },
      { icon: '🌅', title: 'Panoramic Views', description: 'Sweeping vistas of the Vagad countryside' },
      { icon: '📜', title: 'Historical Significance', description: 'National monument since 2022' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '45 km', image: '' },
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '60 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify([]),
    seoTitle: 'Mangarh Hill — Tribal Freedom Memorial in Banswara',
    seoDescription: 'Visit Mangarh Hill, the sacred site of the 1913 Bhil uprising. A national monument honoring 1,500 tribal martyrs in Rajasthan\'s Vagad region.',
    seoKeywords: 'Mangarh Hill, Bhil martyrs, Govind Guru, Banswara, tribal freedom',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Beneshwar Dham',
    slug: 'beneshwar-dham',
    district: 'Dungarpur',
    summary: 'Sacred island at the confluence of Som, Mahi, and Jakham rivers. Known as the "Kumbh of the Vagad" for its massive annual tribal fair.',
    story: 'Beneshwar Dham is a delta island formed at the sacred confluence (triveni sangam) of the Som, Mahi, and Jakham rivers. The ancient Shiva temple here draws millions during the Beneshwar Fair held on Magh Purnima. This is the largest tribal congregation in Rajasthan, where Bhil, Meena, and Garasia communities gather for worship, trade, and cultural celebration. The fair transforms the riverbanks into a vibrant canvas of tribal art, music, and devotion.',
    bestTime: 'January to February (during Beneshwar Fair)',
    lat: 23.6167,
    lng: 73.7833,
    highlights: JSON.stringify([
      { icon: '🕉️', title: 'Triveni Sangam', description: 'Confluence of Som, Mahi, and Jakham rivers' },
      { icon: '🎪', title: 'Beneshwar Fair', description: 'Largest tribal fair in Rajasthan' },
      { icon: '🛕', title: 'Ancient Shiva Temple', description: 'Centuries-old temple on the island' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '15 km', image: '' },
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '45 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify([]),
    seoTitle: 'Beneshwar Dham — Sacred Tribal Pilgrimage in Dungarpur',
    seoDescription: 'Discover Beneshwar Dham, the sacred island temple at the confluence of three rivers. Home to Rajasthan\'s largest tribal fair.',
    seoKeywords: 'Beneshwar Dham, Dungarpur, tribal fair, Mahi river, Shiva temple',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Gaib Sagar Lake',
    slug: 'gaib-sagar-lake',
    district: 'Dungarpur',
    summary: 'Historic artificial lake in the heart of Dungarpur city, surrounded by temples, cenotaphs, and the stunning Badal Mahal palace.',
    story: 'Built by Maharawal Gopinath in the 18th century, Gaib Sagar Lake is the cultural heart of Dungarpur. Its banks are lined with intricately carved temples and royal cenotaphs. The Badal Mahal (Cloud Palace) rises from an island in the lake, its grey-blue stone reflecting in the still waters. At sunset, the lake transforms into a mirror of gold, with migratory birds settling on its surface during winter months.',
    bestTime: 'October to March',
    lat: 23.8417,
    lng: 73.7147,
    highlights: JSON.stringify([
      { icon: '🏰', title: 'Badal Mahal', description: 'Cloud Palace rising from the lake island' },
      { icon: '🐦', title: 'Migratory Birds', description: 'Winter home to numerous bird species' },
      { icon: '🌅', title: 'Sunset Views', description: 'Spectacular golden hour reflections' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '15 km', image: '' },
      { slug: 'kagdi-pick-up-weir', title: 'Kagdi Pick Up Weir', distance: '8 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify([]),
    seoTitle: 'Gaib Sagar Lake — Historic Lake & Badal Mahal in Dungarpur',
    seoDescription: 'Explore Gaib Sagar Lake in Dungarpur, home to the stunning Badal Mahal palace, ancient temples, and spectacular sunset views.',
    seoKeywords: 'Gaib Sagar, Dungarpur lake, Badal Mahal, heritage, Rajasthan',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Kagdi Pick Up Weir',
    slug: 'kagdi-pick-up-weir',
    district: 'Dungarpur',
    summary: 'Scenic dam and waterfall on the outskirts of Dungarpur, popular for picnics and monsoon visits when water cascades over the spillway.',
    story: 'Kagdi Pick Up Weir is a charming dam built across a seasonal river near Dungarpur. During and after the monsoon season, water overflows the weir creating a spectacular curtain of cascading water. The surrounding area is lush green with rocky terrain, making it a favorite spot for locals and visitors seeking a peaceful retreat. The site offers excellent photography opportunities and a refreshing escape from the summer heat.',
    bestTime: 'July to October (monsoon)',
    lat: 23.8200,
    lng: 73.7400,
    highlights: JSON.stringify([
      { icon: '💧', title: 'Monsoon Waterfall', description: 'Spectacular overflow during rainy season' },
      { icon: '🌿', title: 'Lush Surroundings', description: 'Green rocky landscape perfect for picnics' },
      { icon: '📸', title: 'Photography Spot', description: 'Stunning natural backdrop for photos' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '8 km', image: '' },
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '20 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify([]),
    seoTitle: 'Kagdi Pick Up Weir — Monsoon Waterfall near Dungarpur',
    seoDescription: 'Visit Kagdi Pick Up Weir near Dungarpur for stunning monsoon waterfalls and lush green picnic spots in the Vagad region.',
    seoKeywords: 'Kagdi weir, Dungarpur waterfall, monsoon, picnic spot, Vagad',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Mahi Dam',
    slug: 'mahi-dam',
    district: 'Banswara',
    summary: 'One of the largest earthen dams in India, creating a vast reservoir surrounded by islands — earning Banswara the title "City of Hundred Islands."',
    story: 'The Mahi Bajaj Sagar Dam, built across the Mahi River, is one of the longest earthen dams in the world. The reservoir it creates is dotted with over a hundred small islands, giving Banswara its poetic name — "Sau Dweepon ka Shahar" (City of Hundred Islands). The dam area offers boating, fishing, and serene sunset views. The surrounding landscape is a mix of tribal villages, agricultural fields, and forested hills that come alive during the monsoon.',
    bestTime: 'September to February',
    lat: 23.4833,
    lng: 74.4500,
    highlights: JSON.stringify([
      { icon: '🏝️', title: 'Hundred Islands', description: 'Over 100 islands dot the vast reservoir' },
      { icon: '🚣', title: 'Boating', description: 'Boat rides through the island-studded waters' },
      { icon: '🌄', title: 'Sunset Point', description: 'Breathtaking views over the dam at dusk' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '35 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify([]),
    seoTitle: 'Mahi Dam — City of Hundred Islands, Banswara',
    seoDescription: 'Explore Mahi Bajaj Sagar Dam in Banswara, one of India\'s largest earthen dams with over 100 islands and stunning sunset views.',
    seoKeywords: 'Mahi Dam, Banswara, hundred islands, Mahi river, boating, Rajasthan',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
];

const EVENTS = [
  {
    title: 'Beneshwar Fair',
    slug: 'beneshwar-fair',
    description: 'The largest tribal fair in Rajasthan, held at the sacred confluence of Som, Mahi, and Jakham rivers. Millions gather for worship, cultural performances, and trade during Magh Purnima.',
    date: '2027-02-12T00:00:00.000Z',
    endDate: '2027-02-14T00:00:00.000Z',
    location: 'Beneshwar Dham, Dungarpur',
    district: 'Dungarpur',
    category: 'religious',
    seoTitle: 'Beneshwar Fair — Rajasthan\'s Largest Tribal Gathering',
    seoDescription: 'Experience the Beneshwar Fair, where millions of tribal devotees gather at the sacred triveni sangam for worship and celebration.',
    image: '',
    status: 'published',
  },
  {
    title: 'Baneshwar Mahotsav',
    slug: 'baneshwar-mahotsav',
    description: 'A cultural festival celebrating Bhil tribal heritage through traditional dance, music, and art. Features Ghoomar, Gair, and fire dances performed by local communities.',
    date: '2027-02-13T00:00:00.000Z',
    location: 'Banswara Cultural Ground',
    district: 'Banswara',
    category: 'cultural',
    seoTitle: 'Baneshwar Mahotsav — Tribal Cultural Festival',
    seoDescription: 'Witness the vibrant Baneshwar Mahotsav celebrating Bhil tribal heritage through traditional dance, music, and art in Banswara.',
    image: '',
    status: 'published',
  },
  {
    title: 'Vagad Festival',
    slug: 'vagad-festival',
    description: 'Annual celebration of Vagad region\'s unique identity, featuring local cuisine, handicrafts, folk performances, and storytelling sessions about tribal history.',
    date: '2027-03-15T00:00:00.000Z',
    endDate: '2027-03-17T00:00:00.000Z',
    location: 'Dungarpur Town Hall',
    district: 'Dungarpur',
    category: 'fair',
    seoTitle: 'Vagad Festival — Celebrating Regional Heritage',
    seoDescription: 'Join the Vagad Festival for local cuisine, handicrafts, folk performances, and tribal storytelling in Dungarpur.',
    image: '',
    status: 'published',
  },
  {
    title: 'Ghoomar Dance Festival',
    slug: 'ghoomar-dance-festival',
    description: 'A celebration of the iconic Ghoomar dance form, where women in colorful ghagras perform the graceful spinning dance accompanied by traditional Bhil folk songs.',
    date: '2027-10-20T00:00:00.000Z',
    location: 'Mangarh Hill Grounds',
    district: 'Banswara',
    category: 'cultural',
    seoTitle: 'Ghoomar Dance Festival — Traditional Rajasthani Dance',
    seoDescription: 'Experience the mesmerizing Ghoomar dance festival featuring traditional Bhil folk performances at Mangarh Hill.',
    image: '',
    status: 'draft',
  },
];

const FOOD = [
  {
    title: 'Dal Baati Churma',
    slug: 'dal-baati-churma',
    description: 'The quintessential Rajasthani meal — hard wheat balls (baati) baked over cow-dung fire, served with panchmel dal and sweet crushed wheat churma. In Vagad, the baati is often stuffed with a spiced onion filling unique to the tribal communities.',
    origin: 'Vagad Region',
    type: 'dish',
    seoTitle: 'Dal Baati Churma — Authentic Vagad Style',
    seoDescription: 'Taste the authentic Vagad-style Dal Baati Churma with tribal onion-stuffed baati, a signature dish of the region.',
    image: '',
    status: 'published',
  },
  {
    title: 'Mahua Ladoo',
    slug: 'mahua-ladoo',
    description: 'Traditional tribal sweet made from dried Mahua flowers, mixed with jaggery and ghee. A seasonal delicacy prepared during spring when Mahua trees bloom across the Vagad forests.',
    origin: 'Bhil Tribal Communities',
    type: 'sweet',
    seoTitle: 'Mahua Ladoo — Tribal Forest Sweet of Vagad',
    seoDescription: 'Discover Mahua Ladoo, a traditional Bhil tribal sweet made from forest Mahua flowers, jaggery, and ghee.',
    image: '',
    status: 'published',
  },
  {
    title: 'Ker Sangri',
    slug: 'ker-sangri',
    description: 'A tangy desert vegetable dish made from dried ker berries and sangri beans, cooked with mustard oil and local spices. A staple that showcases the resourcefulness of desert cuisine.',
    origin: 'Rajasthani Desert Cuisine',
    type: 'dish',
    seoTitle: 'Ker Sangri — Desert Vegetable Delicacy',
    seoDescription: 'Try Ker Sangri, the iconic Rajasthani desert dish made from wild berries and beans, a testament to desert culinary ingenuity.',
    image: '',
    status: 'published',
  },
  {
    title: 'Amla Murabba',
    slug: 'amla-murabba',
    description: 'Preserved Indian gooseberry soaked in sugar syrup, a traditional Vagad preparation known for its health benefits. Made during winter when amla trees bear fruit across the region.',
    origin: 'Dungarpur',
    type: 'sweet',
    seoTitle: 'Amla Murabba — Traditional Vagad Preserve',
    seoDescription: 'Enjoy Amla Murabba, a traditional Vagad gooseberry preserve known for its health benefits and sweet-tangy flavor.',
    image: '',
    status: 'published',
  },
  {
    title: 'Chaach',
    slug: 'chaach',
    description: 'Spiced buttermilk seasoned with roasted cumin, fresh coriander, and green chili. The essential cooling drink of Vagad, served with every meal during the scorching summer months.',
    origin: 'Vagad Region',
    type: 'beverage',
    seoTitle: 'Chaach — Spiced Buttermilk of Vagad',
    seoDescription: 'Cool down with Chaach, the traditional spiced buttermilk of Vagad, seasoned with cumin and fresh herbs.',
    image: '',
    status: 'published',
  },
];

const EXPERIENCES = [
  {
    title: 'Tribal Heritage Walk',
    description: 'Guided walk through Bhil tribal villages, learning about traditional art, customs, and the living heritage of Vagad\'s indigenous communities.',
    category: 'culture',
    image: '',
    status: 'published',
  },
  {
    title: 'Mahi River Boating',
    description: 'Serene boat ride through the hundred islands of Mahi Bajaj Sagar, spotting migratory birds and enjoying the tranquil waters.',
    category: 'nature',
    image: '',
    status: 'published',
  },
  {
    title: 'Mangarh Hill Trek',
    description: 'A moderate trek to the summit of Mangarh Hill, passing through scrubland and rocky terrain with panoramic views of the Vagad landscape.',
    category: 'adventure',
    image: '',
    status: 'published',
  },
  {
    title: 'Temple Trail',
    description: 'Visit ancient Jain and Hindu temples scattered across Dungarpur, featuring intricate stone carvings and centuries of devotional history.',
    category: 'spiritual',
    image: '',
    status: 'published',
  },
  {
    title: 'Vagad Food Trail',
    description: 'Taste authentic tribal cuisine — from Mahua preparations to fire-roasted baati — guided by local families who share recipes passed down through generations.',
    category: 'food',
    image: '',
    status: 'published',
  },
];

const REGIONS = [
  { name: 'Banswara', tagline: 'City of Hundred Islands', image: '', destinationCount: 2 },
  { name: 'Dungarpur', tagline: 'City of Hills', image: '', destinationCount: 3 },
];

// ─── SEEDING LOGIC ──────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding VisitVagad database\n');

  await seedCollection(COLLECTIONS.DESTINATIONS, DESTINATIONS, 'slug');
  await seedCollection(COLLECTIONS.EVENTS, EVENTS, 'slug');
  await seedCollection(COLLECTIONS.FOOD, FOOD, 'slug');
  await seedCollection(COLLECTIONS.EXPERIENCES, EXPERIENCES, 'title');
  await seedCollection(COLLECTIONS.REGIONS, REGIONS, 'name');

  console.log('\n✅ Seeding complete.');
}

async function seedCollection(collectionId: string, items: Record<string, any>[], dedupeKey: string) {
  console.log(`\n📦 ${collectionId} (${items.length} items):`);

  for (const item of items) {
    const exists = await checkExists(collectionId, dedupeKey, item[dedupeKey]);
    if (exists) {
      console.log(`  ⊘ "${item[dedupeKey]}" already exists, skipping`);
      continue;
    }

    try {
      await db.createDocument(DATABASE_ID, collectionId, ID.unique(), item);
      console.log(`  ✓ "${item[dedupeKey]}"`);
    } catch (e: any) {
      console.log(`  ✗ "${item[dedupeKey]}": ${e?.message || 'error'}`);
    }
    await sleep(200);
  }
}

async function checkExists(collectionId: string, key: string, value: string): Promise<boolean> {
  try {
    const res = await db.listDocuments(DATABASE_ID, collectionId, [
      Query.equal(key, value),
      Query.limit(1),
    ]);
    return res.total > 0;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
