'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  tags: string[];
  views: number;
  publishedAt: string;
};

export default function BlogSection({ data }: { data: Post[] }) {
  if (!data.length) return null;

  // Rotate pastel background accent borders for rows
  const pastels = ['border-pastel-pink', 'border-pastel-teal', 'border-pastel-blue'];

  return (
    <section id="blog" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">My Blog</h2>
            <div className="border-b border-dashed border-foreground/20 mt-6" />
          </div>
          <Link
            href="/blog"
            className="font-mono text-xs font-bold uppercase tracking-widest text-foreground hover:underline mt-2 sm:mt-0 shrink-0 self-start sm:self-auto"
          >
            VIEW ALL POSTS →
          </Link>
        </div>

        {/* Rows Layout */}
        <div className="flex flex-col gap-12">
          {data.map((post, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const borderCol = pastels[i % pastels.length];

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-dashed border-foreground/10 pb-12 group"
              >
                {/* 01 Number Column */}
                <div className="md:col-span-1 font-mono text-3xl font-bold text-foreground/30">
                  {num}
                </div>

                {/* Landscape Feature Illustration */}
                <div className="md:col-span-4 relative aspect-[16/10] shrink-0">
                  <div className={`absolute -inset-1 border-2 border-dashed ${borderCol} rounded-[20px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block w-full h-full rounded-[20px] border border-foreground/10 overflow-hidden relative z-10 bg-muted/30"
                  >
                    <div
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: post.coverUrl ? `url(${post.coverUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    {!post.coverUrl && (
                      <div className="w-full h-full flex items-center justify-center text-3xl bg-foreground/5">
                        📝
                      </div>
                    )}
                  </Link>
                </div>

                {/* Metadata & Description */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex gap-4 items-center mb-3">
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span className="font-bold text-foreground/70">{post.tags[0] || 'BLOG'}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="hover:opacity-85 transition-opacity">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-mono text-xs leading-relaxed text-foreground/70 mb-5 max-w-xl line-clamp-2">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block bg-foreground text-background hover:opacity-90 rounded-full font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 self-start transition-all"
                  >
                    Read more
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
