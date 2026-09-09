'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowUpRight } from 'lucide-react';

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

  return (
    <section id="blog" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Latest Articles
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Thoughts, Notes & Engineering
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <span>All articles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Modern Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((post, i) => {
            const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group rounded-3xl bg-card border border-border/80 hover:border-foreground/20 overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden border-b border-border/60">
                  {post.coverUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-104 transition-transform duration-500"
                      style={{ backgroundImage: `url(${post.coverUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-2xl text-muted-foreground/50">
                      📄
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{dateStr}</span>
                      {post.tags[0] && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary/80 text-foreground/80 font-medium">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground group-hover:text-foreground font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Read post</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
