import { z } from 'zod';

// ─── Server Schema (never exposed to client) ────────────────────────────────

const serverSchema = z.object({
  APPWRITE_API_KEY: z.string().min(1, 'APPWRITE_API_KEY is required'),
  SESSION_SECRET: z.string().optional(),
  AUTH_COOKIE_NAME: z.string().default('visitvagad_session'),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// ─── Client Schema (NEXT_PUBLIC_ vars) ──────────────────────────────────────

const boolString = z.enum(['true', 'false']).transform((v) => v === 'true').optional();

const clientSchema = z.object({
  // App
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_NAME: z.string().default('VisitVagad'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('en'),

  // Appwrite
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_APPWRITE_PROJECT_NAME: z.string().optional(),
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string().default('visitvagad'),
  NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID: z.string().default('media'),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_ENABLE_ANALYTICS: boolString,

  // SEO
  NEXT_PUBLIC_OG_IMAGE_BASE_URL: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_PWA: boolString,
  NEXT_PUBLIC_ENABLE_MARKETPLACE: boolString,
  NEXT_PUBLIC_ENABLE_AI: boolString,

  // Media
  NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional(),

  // Development
  NEXT_PUBLIC_DEBUG_MODE: boolString,
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

/** Validated server env — throws at startup if misconfigured */
export function getServerEnv(): ServerEnv {
  return serverSchema.parse(process.env);
}

/** Validated client env */
export function getClientEnv(): ClientEnv {
  return clientSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    NEXT_PUBLIC_APPWRITE_PROJECT_NAME: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_OG_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL,
    NEXT_PUBLIC_ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA,
    NEXT_PUBLIC_ENABLE_MARKETPLACE: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE,
    NEXT_PUBLIC_ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI,
    NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB: process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB,
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
  });
}
