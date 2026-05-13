/**
 * Appwrite Collection Architecture for VisitVagad
 *
 * Database: visitvagad
 * Collections defined below with attributes and indexes.
 * Run this schema via Appwrite Console or CLI to provision.
 */

export const DATABASE_ID = 'visitvagad';
export const BUCKET_ID = 'media';

export const COLLECTIONS = {
  DESTINATIONS: 'destinations',
  EVENTS: 'events',
  FOOD: 'food',
  EXPERIENCES: 'experiences',
  GALLERIES: 'galleries',
  REGIONS: 'regions',
  SETTINGS: 'settings',
} as const;

/** Attribute definitions for each collection */
export const SCHEMAS = {
  destinations: {
    attributes: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'slug', type: 'string', size: 256, required: true },
      { key: 'district', type: 'enum', elements: ['Banswara', 'Dungarpur'], required: true },
      { key: 'summary', type: 'string', size: 512, required: true },
      { key: 'story', type: 'string', size: 10000, required: false },
      { key: 'heroImage', type: 'string', size: 512, required: false },
      { key: 'gallery', type: 'string', size: 10000, required: false }, // JSON array
      { key: 'highlights', type: 'string', size: 5000, required: false }, // JSON array
      { key: 'experiences', type: 'string', size: 2000, required: false }, // JSON array of IDs
      { key: 'bestTime', type: 'string', size: 256, required: false },
      { key: 'lat', type: 'float', required: false },
      { key: 'lng', type: 'float', required: false },
      { key: 'nearbyPlaces', type: 'string', size: 5000, required: false }, // JSON array
      { key: 'seoTitle', type: 'string', size: 256, required: false },
      { key: 'seoDescription', type: 'string', size: 512, required: false },
      { key: 'seoOgImage', type: 'string', size: 512, required: false },
      { key: 'seoKeywords', type: 'string', size: 512, required: false },
      { key: 'featured', type: 'boolean', required: false },
      { key: 'status', type: 'enum', elements: ['draft', 'published', 'featured', 'archived'], required: true },
      { key: 'publishedAt', type: 'datetime', required: false },
      { key: 'updatedBy', type: 'string', size: 36, required: false },
    ],
    indexes: [
      { key: 'idx_slug', type: 'unique', attributes: ['slug'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_district', type: 'key', attributes: ['district'] },
      { key: 'idx_featured', type: 'key', attributes: ['featured'] },
    ],
  },

  events: {
    attributes: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'slug', type: 'string', size: 256, required: true },
      { key: 'description', type: 'string', size: 5000, required: true },
      { key: 'image', type: 'string', size: 512, required: false },
      { key: 'date', type: 'datetime', required: true },
      { key: 'endDate', type: 'datetime', required: false },
      { key: 'location', type: 'string', size: 256, required: true },
      { key: 'district', type: 'enum', elements: ['Banswara', 'Dungarpur'], required: true },
      { key: 'category', type: 'enum', elements: ['festival', 'fair', 'cultural', 'religious'], required: true },
      { key: 'seoTitle', type: 'string', size: 256, required: false },
      { key: 'seoDescription', type: 'string', size: 512, required: false },
      { key: 'status', type: 'enum', elements: ['draft', 'published', 'featured', 'archived'], required: true },
      { key: 'updatedBy', type: 'string', size: 36, required: false },
    ],
    indexes: [
      { key: 'idx_slug', type: 'unique', attributes: ['slug'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_date', type: 'key', attributes: ['date'] },
    ],
  },

  food: {
    attributes: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'slug', type: 'string', size: 256, required: true },
      { key: 'description', type: 'string', size: 5000, required: true },
      { key: 'image', type: 'string', size: 512, required: false },
      { key: 'origin', type: 'string', size: 256, required: false },
      { key: 'type', type: 'enum', elements: ['dish', 'sweet', 'beverage', 'snack'], required: true },
      { key: 'seoTitle', type: 'string', size: 256, required: false },
      { key: 'seoDescription', type: 'string', size: 512, required: false },
      { key: 'status', type: 'enum', elements: ['draft', 'published', 'featured', 'archived'], required: true },
      { key: 'updatedBy', type: 'string', size: 36, required: false },
    ],
    indexes: [
      { key: 'idx_slug', type: 'unique', attributes: ['slug'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },

  experiences: {
    attributes: [
      { key: 'title', type: 'string', size: 256, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'image', type: 'string', size: 512, required: false },
      { key: 'category', type: 'enum', elements: ['adventure', 'culture', 'nature', 'spiritual', 'food'], required: true },
      { key: 'status', type: 'enum', elements: ['draft', 'published', 'archived'], required: true },
    ],
    indexes: [
      { key: 'idx_category', type: 'key', attributes: ['category'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },

  galleries: {
    attributes: [
      { key: 'fileId', type: 'string', size: 256, required: true },
      { key: 'url', type: 'string', size: 512, required: true },
      { key: 'alt', type: 'string', size: 256, required: true },
      { key: 'caption', type: 'string', size: 512, required: false },
      { key: 'order', type: 'integer', required: false },
      { key: 'parentId', type: 'string', size: 36, required: false },
      { key: 'parentType', type: 'enum', elements: ['destination', 'event', 'food'], required: false },
    ],
    indexes: [
      { key: 'idx_parent', type: 'key', attributes: ['parentId', 'parentType'] },
      { key: 'idx_order', type: 'key', attributes: ['order'] },
    ],
  },

  regions: {
    attributes: [
      { key: 'name', type: 'string', size: 128, required: true },
      { key: 'tagline', type: 'string', size: 256, required: true },
      { key: 'image', type: 'string', size: 512, required: false },
      { key: 'destinationCount', type: 'integer', required: false },
    ],
    indexes: [],
  },

  settings: {
    attributes: [
      { key: 'key', type: 'string', size: 128, required: true },
      { key: 'value', type: 'string', size: 5000, required: true },
    ],
    indexes: [
      { key: 'idx_key', type: 'unique', attributes: ['key'] },
    ],
  },
} as const;
