import { notFound } from 'next/navigation';
import { getUser, getUserRole } from '@/lib/auth';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import type { DestinationDoc } from '@/types/cms';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DestinationPreviewPage({ params }: Props) {
  const { id } = await params;

  // Only authenticated editors/admins can preview drafts
  const user = await getUser();
  if (!user) notFound();
  const role = await getUserRole();
  if (!role) notFound();

  let doc: DestinationDoc;
  try {
    doc = (await adminDb.getDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, id)) as unknown as DestinationDoc;
  } catch {
    notFound();
  }

  const gallery = doc.gallery ? JSON.parse(doc.gallery) : [];
  const highlights = doc.highlights ? JSON.parse(doc.highlights) : [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Preview banner */}
      <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-amber-800">
            Draft Preview — {doc.status.toUpperCase()}
          </span>
        </div>
        <a
          href={`/admin/destinations`}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          ← Back to editor
        </a>
      </div>

      {/* Preview content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {doc.heroImage && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-surface-alt mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={doc.heroImage} alt={doc.title} className="w-full h-full object-cover" />
          </div>
        )}

        <header>
          <p className="text-sm text-text-muted uppercase tracking-wide">{doc.district}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-text-primary">{doc.title}</h1>
          <p className="mt-4 text-lg text-text-secondary">{doc.summary}</p>
        </header>

        {highlights.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h: { icon: string; title: string; description: string }, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-border">
                  <p className="font-medium text-text-primary">{h.icon} {h.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{h.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {doc.story && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Story</h2>
            <div className="prose prose-neutral max-w-none text-text-secondary whitespace-pre-wrap">
              {doc.story}
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((img: { url: string; alt: string }, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-surface-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Meta info for editors */}
        <footer className="mt-12 pt-6 border-t border-border">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-text-muted">Status</dt>
              <dd className="font-medium text-text-primary">{doc.status}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Last updated</dt>
              <dd className="font-medium text-text-primary">{new Date(doc.$updatedAt).toLocaleDateString()}</dd>
            </div>
            {doc.publishedAt && (
              <div>
                <dt className="text-text-muted">Published</dt>
                <dd className="font-medium text-text-primary">{new Date(doc.publishedAt).toLocaleDateString()}</dd>
              </div>
            )}
            <div>
              <dt className="text-text-muted">SEO Title</dt>
              <dd className="font-medium text-text-primary">{doc.seoTitle || '(not set)'}</dd>
            </div>
          </dl>
        </footer>
      </article>
    </div>
  );
}
