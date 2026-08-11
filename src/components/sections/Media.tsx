'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Copy, Check, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

type MediaItem = {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  createdAt: string;
};

export default function MediaSection({ data }: { data: MediaItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  if (!data || !data.length) return null;

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="media" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">Media Library</h2>
            <div className="border-b border-dashed border-foreground/20 mt-6" />
          </div>
          <Link
            href="/media"
            className="font-mono text-xs font-bold uppercase tracking-widest text-foreground hover:underline mt-2 sm:mt-0 shrink-0 self-start sm:self-auto"
          >
            VIEW ALL MEDIA →
          </Link>
        </div>

        {/* Grid Preview (Full background image with absolute data layer) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => setActiveMedia(item)}
              className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden border border-foreground/15 group cursor-pointer bg-card"
            >
              {/* Image as Background */}
              {item.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || item.mimeType?.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.filename}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-foreground/40" />
                </div>
              )}

              {/* Absolute Data Layer & Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-between z-10">
                <div className="flex items-center justify-end">
                  <button
                    onClick={(e) => handleCopy(e, item._id, item.url)}
                    className="p-2 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md rounded-full transition-colors cursor-pointer border border-white/20"
                    title="Copy URL"
                  >
                    {copiedId === item._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-xs font-bold text-white truncate drop-shadow-md">{item.filename}</h3>
                  <p className="font-mono text-[10px] text-white/70 truncate drop-shadow-md">{item.url}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
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

            <div className="max-h-[60vh] overflow-hidden rounded-[12px] bg-muted/40 flex items-center justify-center p-2 border border-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.url}
                alt={activeMedia.filename}
                className="max-h-[55vh] w-auto object-contain rounded-[8px]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="font-mono text-[11px] text-foreground/60 truncate max-w-md">{activeMedia.url}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCopy(e, activeMedia._id, activeMedia.url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-foreground/20 rounded-full font-mono text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {copiedId === activeMedia._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy URL
                </button>
                <a
                  href={activeMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-full font-mono text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Direct
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
