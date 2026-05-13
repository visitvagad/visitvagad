/** Content status workflow */
export type ContentStatus = 'draft' | 'published' | 'featured' | 'archived';

/** Base document fields from Appwrite */
export interface BaseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

/** Gallery image entry (stored as JSON in parent) */
export interface GalleryEntry {
  fileId: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

/** Highlight entry (stored as JSON) */
export interface HighlightEntry {
  icon: string;
  title: string;
  description: string;
}

/** Nearby place entry (stored as JSON) */
export interface NearbyPlaceEntry {
  slug: string;
  title: string;
  distance: string;
  image: string;
}

/** SEO fields shared across content types */
export interface SeoFields {
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  seoKeywords: string;
}

/** Destination document from Appwrite */
export interface DestinationDoc extends BaseDocument, SeoFields {
  title: string;
  slug: string;
  district: 'Banswara' | 'Dungarpur';
  summary: string;
  story: string;
  heroImage: string;
  gallery: string; // JSON string of GalleryEntry[]
  highlights: string; // JSON string of HighlightEntry[]
  experiences: string; // JSON string of string[]
  bestTime: string;
  lat: number;
  lng: number;
  nearbyPlaces: string; // JSON string of NearbyPlaceEntry[]
  featured: boolean;
  status: ContentStatus;
  publishedAt: string | null;
  updatedBy: string | null;
}

/** Form data for creating/editing a destination */
export interface DestinationFormData {
  title: string;
  slug: string;
  district: 'Banswara' | 'Dungarpur';
  summary: string;
  story: string;
  heroImage: string;
  gallery: GalleryEntry[];
  highlights: HighlightEntry[];
  experiences: string[];
  bestTime: string;
  lat: number;
  lng: number;
  nearbyPlaces: NearbyPlaceEntry[];
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  seoKeywords: string;
  featured: boolean;
  status: ContentStatus;
}

/** Event document */
export interface EventDoc extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  endDate: string | null;
  location: string;
  district: 'Banswara' | 'Dungarpur';
  category: 'festival' | 'fair' | 'cultural' | 'religious';
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  updatedBy: string | null;
}

/** Food document */
export interface FoodDoc extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  image: string;
  origin: string;
  type: 'dish' | 'sweet' | 'beverage' | 'snack';
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  updatedBy: string | null;
}

/** User role */
export type UserRole = 'admin' | 'editor';
