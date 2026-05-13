import { z } from 'zod';

/** Shared enums */
export const contentStatusSchema = z.enum(['draft', 'published', 'featured', 'archived']);
export const districtSchema = z.enum(['Banswara', 'Dungarpur']);

/** Gallery entry */
export const galleryEntrySchema = z.object({
  fileId: z.string().min(1),
  url: z.string().url(),
  alt: z.string().min(1).max(256),
  caption: z.string().max(512).optional(),
  order: z.number().int().min(0),
});

/** Highlight entry */
export const highlightEntrySchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(512),
});

/** Nearby place entry */
export const nearbyPlaceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1).max(256),
  distance: z.string().min(1),
  image: z.string().min(1),
});

/** Destination create/update */
export const destinationSchema = z.object({
  title: z.string().min(1).max(256),
  slug: z.string().min(1).max(256).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  district: districtSchema,
  summary: z.string().min(1).max(512),
  story: z.string().max(10000).optional().default(''),
  heroImage: z.string().max(512).optional().default(''),
  gallery: z.array(galleryEntrySchema).optional().default([]),
  highlights: z.array(highlightEntrySchema).optional().default([]),
  experiences: z.array(z.string()).optional().default([]),
  bestTime: z.string().max(256).optional().default(''),
  lat: z.number().min(-90).max(90).optional().default(0),
  lng: z.number().min(-180).max(180).optional().default(0),
  nearbyPlaces: z.array(nearbyPlaceSchema).optional().default([]),
  seoTitle: z.string().max(256).optional().default(''),
  seoDescription: z.string().max(512).optional().default(''),
  seoOgImage: z.string().max(512).optional().default(''),
  seoKeywords: z.string().max(512).optional().default(''),
  featured: z.boolean().optional().default(false),
  status: contentStatusSchema,
});

export const destinationUpdateSchema = destinationSchema.partial();

/** Event create/update */
export const eventSchema = z.object({
  title: z.string().min(1).max(256),
  slug: z.string().min(1).max(256).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(5000),
  image: z.string().max(512).optional().default(''),
  date: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  location: z.string().min(1).max(256),
  district: districtSchema,
  category: z.enum(['festival', 'fair', 'cultural', 'religious']),
  seoTitle: z.string().max(256).optional().default(''),
  seoDescription: z.string().max(512).optional().default(''),
  status: contentStatusSchema,
});

export const eventUpdateSchema = eventSchema.partial();

/** Food create/update */
export const foodSchema = z.object({
  title: z.string().min(1).max(256),
  slug: z.string().min(1).max(256).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(5000),
  image: z.string().max(512).optional().default(''),
  origin: z.string().max(256).optional().default(''),
  type: z.enum(['dish', 'sweet', 'beverage', 'snack']),
  seoTitle: z.string().max(256).optional().default(''),
  seoDescription: z.string().max(512).optional().default(''),
  status: contentStatusSchema,
});

export const foodUpdateSchema = foodSchema.partial();

/** Status update */
export const statusUpdateSchema = z.object({
  id: z.string().min(1),
  status: contentStatusSchema,
});

/** Upload validation */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadSchema = z.object({
  file: z.instanceof(File).refine((f) => f.size <= MAX_FILE_SIZE, 'File must be under 5MB')
    .refine((f) => ALLOWED_MIME_TYPES.includes(f.type as typeof ALLOWED_MIME_TYPES[number]), 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, SVG'),
  alt: z.string().max(256).optional(),
});

/** Type exports */
export type DestinationInput = z.infer<typeof destinationSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type FoodInput = z.infer<typeof foodSchema>;
