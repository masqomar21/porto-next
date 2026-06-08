'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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

  // Layout configurations for an asymmetric, artistic portfolio look
  const cardStyles = [
    {
      imgRadius: 'rounded-t-[60px]',
      bgRadius: 'rounded-t-[60px]',
      bgColor: 'bg-pastel-pink',
      translate: 'translate-x-2.5 translate-y-2.5',
    },
    {
      imgRadius: 'rounded-tr-[80px]',
      bgRadius: 'rounded-tr-[80px]',
      bgColor: 'bg-pastel-teal',
      translate: '-translate-x-2.5 translate-y-2.5',
    },
    {
      imgRadius: 'rounded-tl-[80px]',
      bgRadius: 'rounded-tl-[80px]',
      bgColor: 'bg-pastel-blue',
      translate: 'translate-x-2.5 -translate-y-2.5',
    },
  ];

  return (
    <section id="projects" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">Featured Works</h2>
          <div className="border-b border-dashed border-foreground/20 mt-6" />
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12">
          {data.map((p, i) => {
            const style = cardStyles[i % cardStyles.length];
            const year = p.publishedAt ? new Date(p.publishedAt).getFullYear() : new Date().getFullYear();
            
            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col group"
              >
                {/* Image Frame with Offset Backdrop */}
                <div className="relative w-full aspect-[4/3] mb-6 shrink-0">
                  <div className={`absolute -inset-1.5 ${style.bgColor} ${style.bgRadius} ${style.translate} transition-transform group-hover:translate-x-0 group-hover:translate-y-0 duration-300`} />
                  
                  <div
                    className={`w-full h-full border border-foreground/10 relative z-10 bg-muted/30 overflow-hidden ${style.imgRadius}`}
                    style={{
                      backgroundImage: p.coverUrl ? `url(${p.coverUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!p.coverUrl && (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-foreground/5">
                        🎨
                      </div>
                    )}
                  </div>
                </div>

                {/* Content details */}
                <div className="flex flex-col flex-grow">
                  {/* Metadata Row */}
                  <div className="flex justify-between items-center mb-3 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                    <span className="font-bold text-foreground/60">{p.tags[0] || 'DEVELOPMENT'}</span>
                    <span>{year}</span>
                  </div>

                  <Link href={`/projects/${p.slug}`} className="hover:opacity-85 transition-opacity">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="font-mono text-xs leading-relaxed text-foreground/70 mb-4 flex-grow">
                    {p.excerpt}
                  </p>

                  {/* Actions Links */}
                  <div className="flex items-center gap-4 mt-auto font-mono text-[11px] font-bold uppercase tracking-wider">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline flex items-center gap-1">
                        LIVE <span>↗</span>
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground hover:underline">
                        CODE
                      </a>
                    )}
                    <Link href={`/projects/${p.slug}`} className="ml-auto text-foreground hover:underline flex items-center gap-0.5">
                      DETAILS <span>→</span>
                    </Link>
                  </div>
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
