import { z } from "zod";

export const statusSchema = z.enum(["draft", "pending_review", "published"]).default("draft");

export const destinationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  district: z.enum(["Banswara", "Dungarpur"]),
  type: z.string().min(2, "Type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(5, "Short description is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  highlights: z.array(z.string()).min(1, "At least one highlight is required"),
  bestTime: z.string().min(2, "Best time is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  featured: z.boolean().default(false),
  status: statusSchema,
});

export const hotelSchema = z.object({
  name: z.string().min(3, "Name is required"),
  category: z.string().min(2, "Category is required"),
  priceRange: z.string().min(1, "Price range is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  rating: z.number().min(1).max(5),
  bookingLink: z.string().url().optional().or(z.literal("")),
  verified: z.boolean().default(false),
  image: z.string().url("Valid image URL is required"),
  status: statusSchema,
});

export const eventSchema = z.object({
  name: z.string().min(3, "Name is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location is required"),
  description: z.string().min(10, "Description is required"),
  culturalSignificance: z.string().min(5, "Cultural significance is required"),
  image: z.string().url("Valid image URL is required"),
  recurring: z.boolean().default(false),
  status: statusSchema,
});

export const foodSchema = z.object({
  name: z.string().min(3, "Name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description is required"),
  image: z.string().url("Valid image URL is required"),
  status: statusSchema,
});

export const itinerarySchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  days: z.array(z.object({
    dayNumber: z.number(),
    activities: z.array(z.string()),
    destinations: z.array(z.string()), // IDs of destinations
  })).min(1, "At least one day is required"),
  featured: z.boolean().default(false),
  status: statusSchema,
});

export type DestinationInput = z.infer<typeof destinationSchema>;
export type HotelInput = z.infer<typeof hotelSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type FoodInput = z.infer<typeof foodSchema>;
export type ItineraryInput = z.infer<typeof itinerarySchema>;
