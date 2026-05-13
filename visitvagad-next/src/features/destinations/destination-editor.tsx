'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Textarea, Select, Toggle } from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { createDestination, updateDestination } from '@/features/destinations/actions';
import type { DestinationFormData, ContentStatus } from '@/types/cms';

interface Props {
  initialData?: Partial<DestinationFormData>;
  documentId?: string;
}

const defaultData: DestinationFormData = {
  title: '', slug: '', district: 'Banswara', summary: '', story: '',
  heroImage: '', gallery: [], highlights: [], experiences: [],
  bestTime: '', lat: 0, lng: 0, nearbyPlaces: [],
  seoTitle: '', seoDescription: '', seoOgImage: '', seoKeywords: '',
  featured: false, status: 'draft',
};

export function DestinationEditor({ initialData, documentId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<DestinationFormData>({ ...defaultData, ...initialData });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof DestinationFormData>(key: K, value: DestinationFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleSave(status?: ContentStatus) {
    setSaving(true);
    try {
      const payload = { ...data, status: status || data.status };
      if (documentId) {
        await updateDestination(documentId, payload);
      } else {
        await createDestination(payload);
      }
      router.push('/admin/destinations');
      router.refresh();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8 max-w-3xl">
      {/* Core fields */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Content</h2>
        <Field label="Title">
          <Input
            value={data.title}
            onChange={(e) => { update('title', e.target.value); update('slug', generateSlug(e.target.value)); }}
            placeholder="Mangarh Hill"
          />
        </Field>
        <Field label="Slug">
          <Input value={data.slug} onChange={(e) => update('slug', e.target.value)} placeholder="mangarh-hill" />
        </Field>
        <Field label="District">
          <Select value={data.district} onChange={(e) => update('district', e.target.value as 'Banswara' | 'Dungarpur')}>
            <option value="Banswara">Banswara</option>
            <option value="Dungarpur">Dungarpur</option>
          </Select>
        </Field>
        <Field label="Summary">
          <Textarea value={data.summary} onChange={(e) => update('summary', e.target.value)} placeholder="Brief description (max 512 chars)" maxLength={512} />
        </Field>
        <Field label="Story">
          <Textarea value={data.story} onChange={(e) => update('story', e.target.value)} placeholder="Full editorial story…" className="min-h-[200px]" />
        </Field>
        <Field label="Best Time to Visit">
          <Input value={data.bestTime} onChange={(e) => update('bestTime', e.target.value)} placeholder="October to March" />
        </Field>
      </section>

      {/* Media */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Media</h2>
        <ImageUpload value={data.heroImage} onChange={(url) => update('heroImage', url)} label="Hero Image" />
      </section>

      {/* Location */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Location</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude">
            <Input type="number" step="any" value={data.lat || ''} onChange={(e) => update('lat', parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Longitude">
            <Input type="number" step="any" value={data.lng || ''} onChange={(e) => update('lng', parseFloat(e.target.value) || 0)} />
          </Field>
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">SEO</h2>
        <Field label="Meta Title">
          <Input value={data.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} placeholder="Page title for search engines" />
        </Field>
        <Field label="Meta Description">
          <Textarea value={data.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} placeholder="Description for search results" className="min-h-[80px]" />
        </Field>
        <Field label="Keywords">
          <Input value={data.seoKeywords} onChange={(e) => update('seoKeywords', e.target.value)} placeholder="comma, separated, keywords" />
        </Field>
        <ImageUpload value={data.seoOgImage} onChange={(url) => update('seoOgImage', url)} label="OG Image" />
      </section>

      {/* Publishing */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Publishing</h2>
        <Toggle checked={data.featured} onChange={(v) => update('featured', v)} label="Featured destination" />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium bg-surface border border-border rounded-xl hover:border-deep-teal/30 transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave('published')}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium bg-deep-teal text-off-white rounded-xl hover:bg-deep-teal/90 transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      </div>
    </form>
  );
}
