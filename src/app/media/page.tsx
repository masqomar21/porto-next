import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';
import MediaGalleryClient from './MediaGalleryClient';

export const metadata: Metadata = {
  title: 'Media Gallery — Muhammad Qomarudin',
  description: 'Explore uploaded media assets, screenshots, and visual highlights.',
};

export const dynamic = 'force-dynamic';

export default async function PublicMediaPage() {
  await connectDB();
  const rawAssets = await MediaAsset.find().sort({ createdAt: -1 }).lean();

  const assets = rawAssets.map((asset) => ({
    id: (asset._id as { toString(): string }).toString(),
    filename: asset.filename,
    url: asset.url,
    mimeType: asset.mimeType || 'image/jpeg',
    createdAt: asset.createdAt ? new Date(asset.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground py-24 md:py-36 px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="border-b border-dashed border-foreground/20 pb-8">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Media Gallery
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60 mt-3">
            Collection of visual assets, screenshots, and media highlights ({assets.length} items)
          </p>
        </div>

        <MediaGalleryClient initialAssets={assets} />
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </div>
  );
}
