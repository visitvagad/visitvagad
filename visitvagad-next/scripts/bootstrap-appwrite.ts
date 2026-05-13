/**
 * Bootstrap Appwrite database, collections, indexes, and storage bucket.
 * Run: npm run bootstrap:appwrite
 *
 * Uses the schema defined in src/lib/appwrite-schema.ts.
 * Safe to re-run — skips existing resources.
 */
import { Client, Databases, Storage } from 'node-appwrite';
import { DATABASE_ID, BUCKET_ID, COLLECTIONS, SCHEMAS } from '../src/lib/appwrite-schema';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('✗ Missing env vars. Set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const db = new Databases(client);
const storage = new Storage(client);

async function main() {
  console.log('🚀 Bootstrapping Appwrite for VisitVagad\n');

  // 1. Create database
  await ensureDatabase();

  // 2. Create collections + attributes + indexes
  for (const [name, collectionId] of Object.entries(COLLECTIONS)) {
    const schema = SCHEMAS[collectionId as keyof typeof SCHEMAS];
    if (!schema) {
      console.log(`  ⚠ No schema for ${name}, skipping`);
      continue;
    }
    await ensureCollection(collectionId, name);
    await ensureAttributes(collectionId, schema.attributes);
    await ensureIndexes(collectionId, schema.indexes);
  }

  // 3. Create storage bucket
  await ensureBucket();

  console.log('\n✅ Appwrite bootstrap complete.');
}

async function ensureDatabase() {
  try {
    await db.get(DATABASE_ID);
    console.log(`✓ Database "${DATABASE_ID}" exists`);
  } catch {
    await db.create(DATABASE_ID, DATABASE_ID);
    console.log(`✓ Created database "${DATABASE_ID}"`);
  }
}

async function ensureCollection(id: string, name: string) {
  try {
    await db.getCollection(DATABASE_ID, id);
    console.log(`✓ Collection "${id}" exists`);
  } catch {
    await db.createCollection(DATABASE_ID, id, name);
    console.log(`✓ Created collection "${id}"`);
  }
}

async function ensureAttributes(collectionId: string, attributes: readonly any[]) {
  for (const attr of attributes) {
    try {
      switch (attr.type) {
        case 'string':
          await db.createStringAttribute(DATABASE_ID, collectionId, attr.key, attr.size, attr.required, attr.required ? undefined : '');
          break;
        case 'enum':
          await db.createEnumAttribute(DATABASE_ID, collectionId, attr.key, attr.elements, attr.required);
          break;
        case 'boolean':
          await db.createBooleanAttribute(DATABASE_ID, collectionId, attr.key, attr.required, attr.required ? undefined : false);
          break;
        case 'integer':
          await db.createIntegerAttribute(DATABASE_ID, collectionId, attr.key, attr.required);
          break;
        case 'float':
          await db.createFloatAttribute(DATABASE_ID, collectionId, attr.key, attr.required);
          break;
        case 'datetime':
          await db.createDatetimeAttribute(DATABASE_ID, collectionId, attr.key, attr.required);
          break;
      }
      console.log(`  ✓ Attribute "${collectionId}.${attr.key}"`);
    } catch (e: any) {
      if (e?.code === 409) {
        // Already exists
      } else {
        console.log(`  ⚠ Attribute "${collectionId}.${attr.key}": ${e?.message || 'error'}`);
      }
    }
    // Appwrite needs time between attribute creations
    await sleep(500);
  }
}

async function ensureIndexes(collectionId: string, indexes: readonly any[]) {
  for (const idx of indexes) {
    try {
      await db.createIndex(DATABASE_ID, collectionId, idx.key, idx.type, idx.attributes);
      console.log(`  ✓ Index "${collectionId}.${idx.key}"`);
    } catch (e: any) {
      if (e?.code === 409) {
        // Already exists
      } else {
        console.log(`  ⚠ Index "${collectionId}.${idx.key}": ${e?.message || 'error'}`);
      }
    }
    await sleep(300);
  }
}

async function ensureBucket() {
  try {
    await storage.getBucket(BUCKET_ID);
    console.log(`✓ Bucket "${BUCKET_ID}" exists`);
  } catch {
    await storage.createBucket(
      BUCKET_ID,
      BUCKET_ID,
      undefined, // permissions
      false, // fileSecurity
      true, // enabled
      5 * 1024 * 1024, // 5MB max
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
    );
    console.log(`✓ Created bucket "${BUCKET_ID}"`);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Bootstrap failed:', err.message);
  process.exit(1);
});
