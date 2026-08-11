'use client';

import { useState } from 'react';
import { Image as ImageIcon, Plus, Copy, Trash2, ExternalLink, Check } from 'lucide-react';
import { addMediaAsset, deleteMediaAsset } from './actions';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';

interface Asset {
  id: string;
  filename: string;
  url: string;
  key: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export default function MediaClientView({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent, id: string, mediaUrl: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mediaUrl);
    setCopiedId(id);
    toast.success('Asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    const res = await deleteMediaAsset(id);
    if (res.success) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success('Media asset deleted');
    } else {
      toast.error('Failed to delete asset');
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim() || !url.trim()) return;

    setIsSubmitting(true);
    const res = await addMediaAsset(filename.trim(), url.trim());
    setIsSubmitting(false);

    if (res.success && res.asset) {
      setAssets((prev) => [res.asset, ...prev]);
      setFilename('');
      setUrl('');
      setIsModalOpen(false);
      toast.success('Media asset registered successfully');
    } else {
      toast.error('Failed to register asset');
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-mono font-bold rounded-none hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Media Asset
        </button>
      </div>

      {/* Assets Grid (Background Image + Absolute Data Overlay) */}
      {assets.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-none">
          <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">No media assets found</p>
          <p className="text-[11px] font-mono text-muted-foreground mt-1">Upload images or register static assets here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="relative aspect-[4/3] w-full rounded-none overflow-hidden border border-border group bg-card"
            >
              {/* Background Image */}
              {asset.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || asset.mimeType.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}

              {/* Absolute Data Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3.5 flex flex-col justify-between z-10">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={(e) => handleCopyUrl(e, asset.id, asset.url)}
                    className="p-1.5 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                    title="Open Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={(e) => handleDelete(e, asset.id)}
                    className="p-1.5 bg-destructive/80 hover:bg-destructive text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-mono text-xs font-bold text-white truncate drop-shadow-md">{asset.filename}</h3>
                  <p className="font-mono text-[10px] text-white/70 truncate drop-shadow-md">{asset.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-none p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 duration-150 shadow-lg">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Register Media Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                  ASSET NAME
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Hero Cover Banner"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                  UPLOAD ASSET IMAGE (MAX 10MB)
                </label>
                <ImageUpload
                  value={url}
                  onChange={(uploadedUrl) => {
                    setUrl(uploadedUrl);
                    if (!filename && uploadedUrl) {
                      const extractedName = uploadedUrl.split('/').pop()?.split('?')[0] || 'Media Asset';
                      setFilename(extractedName);
                    }
                  }}
                  allowedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']}
                  maxSizeMB={10}
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                  OR PASTE DIRECT ASSET URL (S3 / CDN)
                </label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground text-xs font-mono font-bold rounded-none hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !url}
                  className="px-4 py-2 bg-foreground text-background text-xs font-mono font-bold rounded-none hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
