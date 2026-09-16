'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Copy, Check, ExternalLink, X, ArrowUpRight } from 'lucide-react';
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
    toast.success('Asset URL copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="media" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Asset Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Design Artifacts & Visuals
            </h2>
          </div>
          <Link
            href="/media"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Modern Bento Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => setActiveMedia(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border/70 hover:border-foreground/30 bg-muted/40 cursor-pointer shadow-2xs hover:shadow-xs transition-all duration-300"
            >
              {item.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || item.mimeType?.startsWith('image/') ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              {/* Hover overlay with filename */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-white truncate drop-shadow-sm">
                  {item.filename}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-mono text-xs font-semibold text-foreground truncate max-w-xs">
                {activeMedia.filename}
              </h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center p-2 border border-border/60">
              <img
                src={activeMedia.url}
                alt={activeMedia.filename}
                className="max-h-[45vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={(e) => handleCopy(e, activeMedia._id, activeMedia.url)}
                className="px-4 py-2 border border-border rounded-full hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedId === activeMedia._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy URL
              </button>
              <a
                href={activeMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Direct
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
