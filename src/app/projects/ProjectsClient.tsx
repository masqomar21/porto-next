'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

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

export default function ProjectsClientPage({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const allTags = useMemo(() => [...new Set(projects.flatMap(p => p.tags))].sort(), [projects]);

  const filtered = useMemo(() => projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  }), [projects, search, activeTag]);

  // Card layouts configuration
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
    <div className="bg-background min-h-screen relative overflow-hidden py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Page Header */}
        <div className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 font-bold block mb-2">
            // WORK SHOWCASE
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Featured Projects
          </h1>
          <div className="border-b border-dashed border-foreground/20 mt-6" />
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16">
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label htmlFor="project-search" className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
              Search Projects
            </label>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type keywords..."
              id="project-search"
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none px-0 pb-2 focus:ring-0 focus-visible:ring-0 focus-visible:border-foreground font-mono text-sm placeholder:text-foreground/30 text-foreground shadow-none w-full"
            />
          </div>

          {allTags.length > 0 && (
            <div className="md:col-span-6 flex flex-wrap gap-2 items-center justify-start md:justify-end">
              <button
                onClick={() => setActiveTag('')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                  activeTag === ''
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground'
                }`}
              >
                All
              </button>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t === activeTag ? '' : t)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                    activeTag === t
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 font-mono text-xs text-foreground/50 uppercase tracking-widest">
            No projects found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12">
            {filtered.map((p, i) => {
              const style = cardStyles[i % cardStyles.length];
              const year = p.publishedAt ? new Date(p.publishedAt).getFullYear() : new Date().getFullYear();

              return (
                <div key={p._id} className="flex flex-col group relative">
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </div>
  );
}
