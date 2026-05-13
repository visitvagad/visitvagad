'use server';

import { ID, Query } from 'node-appwrite';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { requireAuth, requireRole } from '@/lib/auth';
import { destinationSchema, destinationUpdateSchema, contentStatusSchema } from '@/lib/validations';
import type { DestinationDoc, ContentStatus } from '@/types/cms';

const COL = COLLECTIONS.DESTINATIONS;

/** List destinations with optional status filter */
export async function listDestinations(status?: ContentStatus) {
  await requireAuth();
  const queries = status ? [Query.equal('status', status)] : [];
  queries.push(Query.orderDesc('$updatedAt'), Query.limit(50));
  const res = await adminDb.listDocuments(DATABASE_ID, COL, queries);
  return res.documents as unknown as DestinationDoc[];
}

/** Get a single destination by ID */
export async function getDestination(id: string) {
  await requireAuth();
  const doc = await adminDb.getDocument(DATABASE_ID, COL, id);
  return doc as unknown as DestinationDoc;
}

/** Create a new destination */
export async function createDestination(data: unknown) {
  const { user } = await requireAuth();
  const parsed = destinationSchema.parse(data);
  const payload = serializeForAppwrite({ ...parsed, updatedBy: user.$id });
  const doc = await adminDb.createDocument(DATABASE_ID, COL, ID.unique(), payload);
  return doc.$id;
}

/** Update an existing destination */
export async function updateDestination(id: string, data: unknown) {
  const { user } = await requireAuth();
  const parsed = destinationUpdateSchema.parse(data);
  const payload = serializeForAppwrite({ ...parsed, updatedBy: user.$id });
  await adminDb.updateDocument(DATABASE_ID, COL, id, payload);
}

/** Update status only */
export async function updateDestinationStatus(id: string, status: unknown) {
  await requireAuth();
  const parsed = contentStatusSchema.parse(status);
  const updates: Record<string, unknown> = { status: parsed };
  if (parsed === 'published' || parsed === 'featured') {
    updates.publishedAt = new Date().toISOString();
  }
  if (parsed === 'featured') updates.featured = true;
  await adminDb.updateDocument(DATABASE_ID, COL, id, updates);
}

/** Soft delete (archive) a destination — no permanent deletion */
export async function archiveDestination(id: string) {
  await requireRole('admin');
  await adminDb.updateDocument(DATABASE_ID, COL, id, {
    status: 'archived',
  });
}

/** Restore an archived destination to draft */
export async function restoreDestination(id: string) {
  await requireAuth();
  await adminDb.updateDocument(DATABASE_ID, COL, id, {
    status: 'draft',
  });
}

/** Serialize form data for Appwrite (JSON-stringify arrays/objects) */
function serializeForAppwrite(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  if (data.gallery) result.gallery = JSON.stringify(data.gallery);
  if (data.highlights) result.highlights = JSON.stringify(data.highlights);
  if (data.experiences) result.experiences = JSON.stringify(data.experiences);
  if (data.nearbyPlaces) result.nearbyPlaces = JSON.stringify(data.nearbyPlaces);
  return result;
}
