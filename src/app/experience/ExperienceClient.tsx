'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

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

  // Extract all unique technology tags across experiences
  const allTags = useMemo(() => {
    return [...new Set(experiences.flatMap(e => e.tags))].sort();
  }, [experiences]);

  // Filter experiences based on search input and active tag
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
    <div className="bg-background min-h-screen relative overflow-hidden py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Page Header */}
        <div className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 font-bold block mb-2">
            // CAREER HISTORY
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Work Experience
          </h1>
          <div className="border-b border-dashed border-foreground/20 mt-6" />
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16">
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label htmlFor="experience-search" className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
              Search Roles & Companies
            </label>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type role, company or skill..."
              id="experience-search"
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
            No work experience found matching your query.
          </div>
        ) : (
          /* Experience List */
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {filtered.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative border border-transparent rounded-[24px] p-6 md:p-8 hover:bg-card/40 hover:border-border hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {/* Duration */}
                  <div className="md:col-span-3">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground/45 font-semibold block pt-1">
                      {item.duration}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-9 flex flex-col">
                    <h3 className="font-serif text-xl font-bold text-foreground leading-snug">
                      {item.companyUrl ? (
                        <a
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-foreground group-hover:text-primary transition-colors cursor-pointer"
                        >
                          <span>{item.role}</span>
                          <span className="text-foreground/30 font-normal font-sans">·</span>
                          <span>{item.company}</span>
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-sm sm:text-base">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <span>{item.role}</span>
                          <span className="text-foreground/30 font-normal font-sans">·</span>
                          <span className="text-foreground/85">{item.company}</span>
                        </span>
                      )}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-foreground/65 leading-relaxed font-sans whitespace-pre-wrap">
                      {item.description}
                    </p>

                    {/* Associated Reference Links */}
                    {item.links && item.links.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                        {item.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground/60 hover:text-foreground hover:underline transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5 opacity-60"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Tech badging */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                            className={`font-mono text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full border transition-all cursor-pointer ${
                              activeTag === tag
                                ? 'bg-foreground border-foreground text-background'
                                : 'bg-foreground/[0.04] dark:bg-foreground/[0.06] border-foreground/[0.06] hover:bg-foreground/[0.08] text-foreground/80 hover:border-foreground/20'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </div>
  );
}
