'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Sparkles } from 'lucide-react';

type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  publishedAt?: string;
};

export default function ProjectsSection({ data }: { data: Project[] }) {
  if (!data.length) return null;

  return (
    <section id="projects" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-10">

        {/* Section Header with Minimalist Badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Selected Works
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Projects & Products
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <span>Browse archive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Modern Bento Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((p, i) => {
            const year = p.publishedAt
              ? new Date(p.publishedAt).getFullYear()
              : new Date().getFullYear();

            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group rounded-3xl bg-card border border-border/80 hover:border-foreground/20 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                {/* Visual Preview Container */}
                <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden border-b border-border/60">
                  {p.coverUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-104 transition-transform duration-500 ease-out"
                      style={{ backgroundImage: `url(${p.coverUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                      No Preview
                    </div>
                  )}

                  {/* Year pill overlay */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-[10px] font-mono font-medium text-foreground">
                    {year}
                  </div>
                </div>

                {/* Content & Action */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow gap-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/80 text-foreground/80 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link href={`/projects/${p.slug}`}>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span>{p.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>

                  {/* Footer links bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs font-mono">
                    <div className="flex items-center gap-4">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:underline flex items-center gap-1"
                        >
                          <span>Live preview</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <Code className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projects/${p.slug}`}
                      className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      Read story →
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
