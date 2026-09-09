'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Briefcase, ArrowUpRight, Search } from 'lucide-react';

type ExperienceLink = { label: string; url: string };

type Experience = {
  _id: string;
  role: string;
  company: string;
  companyUrl?: string;
  duration: string;
  description: string;
  tags: string[];
  links?: ExperienceLink[];
  order: number;
};

export default function ExperienceClientPage({ experiences }: { experiences: Experience[] }) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const allTags = useMemo(() => {
    return [...new Set(experiences.flatMap(e => e.tags))].sort();
  }, [experiences]);

  const filtered = useMemo(() => {
    return experiences.filter(e => {
      const matchSearch =
        !search ||
        e.role.toLowerCase().includes(search.toLowerCase()) ||
        e.company.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !activeTag || e.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [experiences, search, activeTag]);

  return (
    <div className="bg-background min-h-screen py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-border/60">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Career History
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Work Experience & Roles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Chronological overview of software engineering positions, key achievements, and technology stacks.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roles, companies, or tech..."
              id="experience-search"
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
                All ({experiences.length})
              </button>
              {allTags.map(t => {
                const count = experiences.filter(e => e.tags.includes(t)).length;
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
            No work experience found matching your query.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filtered.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-foreground/20 hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                {/* Left Column: Role + Company */}
                <div className="flex flex-col gap-1.5 md:w-1/3">
                  <span className="text-xs font-mono text-muted-foreground font-medium">
                    {item.duration}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {item.role}
                  </h3>
                  {item.companyUrl ? (
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 w-fit"
                    >
                      <span>{item.company}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-muted-foreground">{item.company}</span>
                  )}
                </div>

                {/* Right Column: Description + Tech Badges */}
                <div className="flex flex-col gap-4 md:w-2/3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>

                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                      {item.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-foreground/80 hover:underline"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            activeTag === tag
                              ? 'bg-foreground border-foreground text-background font-medium'
                              : 'bg-secondary/80 border-border/60 text-foreground/80 hover:border-foreground/30'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
