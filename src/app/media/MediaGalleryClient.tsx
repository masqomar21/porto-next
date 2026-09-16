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
    toast.success('Asset URL copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media assets..."
          className="w-full pl-10 pr-4 py-2 bg-card border border-border/70 rounded-full font-sans text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-foreground"
        />
      </div>

      {/* Bento Grid Gallery */}
      {filteredAssets.length === 0 ? (
        <div className="p-16 text-center bg-card border border-border/60 rounded-3xl">
          <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-mono text-xs text-muted-foreground">No media assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setActiveMedia(asset)}
              className="group relative aspect-square w-full rounded-2xl overflow-hidden border border-border/70 hover:border-foreground/30 bg-muted/40 cursor-pointer shadow-2xs hover:shadow-xs transition-all duration-300"
            >
              {/* Image as Background */}
              {asset.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || asset.mimeType.startsWith('image/') ? (
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}

              {/* Hover overlay with filename and copy action */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <div className="flex items-center justify-end">
                  <button
                    onClick={(e) => handleCopy(e, asset.id, asset.url)}
                    className="p-1.5 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md rounded-full transition-colors cursor-pointer border border-white/10"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] font-mono text-white truncate drop-shadow-sm">
                  {asset.filename}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 space-y-4 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-mono text-xs font-semibold text-foreground truncate max-w-sm">
                {activeMedia.filename}
              </h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center p-2 border border-border/60">
              <img
                src={activeMedia.url}
                alt={activeMedia.filename}
                className="max-h-[55vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="font-mono text-[11px] text-muted-foreground truncate max-w-xs">{activeMedia.url}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCopy(e, activeMedia.id, activeMedia.url)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-border rounded-full font-mono text-xs text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  {copiedId === activeMedia.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy URL
                </button>
                <a
                  href={activeMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-foreground text-background rounded-full font-mono text-xs font-medium hover:opacity-90 transition-opacity"
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
