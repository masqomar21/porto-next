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
    <div className="min-h-screen bg-background text-foreground py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-3 pb-8 border-b border-border/60">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest">
            Visual Assets
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Collection of visual assets, screenshots, and media highlights ({assets.length} items)
          </p>
        </div>

        <MediaGalleryClient initialAssets={assets} />
      </div>
    </div>
  );
}
