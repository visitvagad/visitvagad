import type { Metadata } from 'next';
import { DestinationEditor } from '@/features/destinations/destination-editor';

export const metadata: Metadata = { title: 'New Destination — Editorial', robots: { index: false } };

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">New Destination</h1>
      <DestinationEditor />
    </div>
  );
}
