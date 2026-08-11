'use client';

import { useState } from 'react';
import { Image as ImageIcon, Copy, Check, ExternalLink, X, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Asset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  createdAt: string;
}

export default function MediaGalleryClient({ initialAssets }: { initialAssets: Asset[] }) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<Asset | null>(null);

  const filteredAssets = initialAssets.filter(
    (asset) =>
      asset.filename.toLowerCase().includes(search.toLowerCase()) ||
      asset.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media assets..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-foreground/15 rounded-full font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-hidden focus:border-foreground"
        />
      </div>

      {/* Grid (Image as background with absolute data layer) */}
      {filteredAssets.length === 0 ? (
        <div className="p-16 text-center bg-card border border-foreground/10 rounded-[20px]">
          <ImageIcon className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">No media assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setActiveMedia(asset)}
              className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden border border-foreground/15 group cursor-pointer bg-card"
            >
              {/* Image as Background */}
              {asset.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || asset.mimeType.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-foreground/40" />
                </div>
              )}

              {/* Absolute Data Layer & Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-between z-10">
                <div className="flex items-center justify-end">
                  <button
                    onClick={(e) => handleCopy(e, asset.id, asset.url)}
                    className="p-2 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md rounded-full transition-colors cursor-pointer border border-white/20"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-xs font-bold text-white truncate drop-shadow-md">{asset.filename}</h3>
                  <p className="font-mono text-[10px] text-white/70 truncate drop-shadow-md">{asset.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="bg-card border border-foreground/20 rounded-[20px] max-w-3xl w-full p-6 space-y-4 relative animate-in zoom-in-95 duration-150 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
              <h3 className="font-mono text-sm font-bold text-foreground truncate">{activeMedia.filename}</h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-[12px] bg-muted/40 flex items-center justify-center p-2 border border-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.url}
                alt={activeMedia.filename}
                className="max-h-[60vh] w-auto object-contain rounded-[8px]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="font-mono text-[11px] text-foreground/60 truncate max-w-md">{activeMedia.url}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCopy(e, activeMedia.id, activeMedia.url)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-foreground/20 rounded-full font-mono text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {copiedId === activeMedia.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy URL
                </button>
                <a
                  href={activeMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-foreground text-background rounded-full font-mono text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Direct
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
