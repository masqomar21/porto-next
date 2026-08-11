import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';
import MediaClientView from './MediaClientView';

export const metadata: Metadata = { title: 'Media Library - Admin' };
export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  await connectDB();
  const rawAssets = await MediaAsset.find().sort({ createdAt: -1 }).lean();

  const assets = rawAssets.map((asset) => ({
    id: (asset._id as { toString(): string }).toString(),
    filename: asset.filename,
    url: asset.url,
    key: asset.key,
    size: asset.size,
    mimeType: asset.mimeType,
    createdAt: asset.createdAt ? new Date(asset.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Media Library</h1>
          <p className="text-muted-foreground text-xs font-mono mt-1">
            Manage images and uploaded static assets ({assets.length} assets)
          </p>
        </div>
      </div>

      <MediaClientView initialAssets={assets} />
    </div>
  );
}
