'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, Code, Search, Sparkles } from 'lucide-react';

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

  return (
    <div className="bg-background min-h-screen py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-border/60">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Portfolio Archive
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Featured Projects & Works
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            A comprehensive showcase of web applications, client projects, experiments, and open-source contributions.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects by title, stack, or keyword..."
              id="project-search"
              className="pl-10 pr-4 py-2 bg-card border-border/70 rounded-xl text-xs font-sans text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring w-full shadow-2xs"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-none max-w-full">
              <button
                onClick={() => setActiveTag('')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  activeTag === ''
                    ? 'bg-foreground text-background font-medium shadow-2xs'
                    : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({projects.length})
              </button>
              {allTags.map(t => {
                const count = projects.filter(p => p.tags.includes(t)).length;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTag(t === activeTag ? '' : t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeTag === t
                        ? 'bg-foreground text-background font-medium shadow-2xs'
                        : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{t}</span>
                    <span className="text-[10px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-card border border-border/60 font-mono text-xs text-muted-foreground">
            No projects found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const year = p.publishedAt ? new Date(p.publishedAt).getFullYear() : new Date().getFullYear();

              return (
                <div
                  key={p._id}
                  className="group rounded-3xl bg-card border border-border/80 hover:border-foreground/20 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  {/* Visual Preview */}
                  <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden border-b border-border/60">
                    {p.coverUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-104 transition-transform duration-500"
                        style={{ backgroundImage: `url(${p.coverUrl})` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                        No Preview
                      </div>
                    )}
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-[10px] font-mono font-medium text-foreground">
                      {year}
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-6 flex flex-col justify-between flex-grow gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary/80 text-foreground/80 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link href={`/projects/${p.slug}`}>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span>{p.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {p.excerpt}
                      </p>
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-border/50 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
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
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
