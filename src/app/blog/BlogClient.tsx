'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

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

export default function BlogClientPage({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const allTags = useMemo(() => [...new Set(posts.flatMap(p => p.tags))].sort(), [posts]);

  const filtered = useMemo(() => posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  }), [posts, search, activeTag]);

  return (
    <div className="bg-alabaster min-h-screen relative overflow-hidden py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Page Header */}
        <div className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 font-bold block mb-2">
            // MY WRITING
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-charcoal tracking-tight">
            Latest Publications
          </h1>
          <div className="border-b border-dashed border-charcoal/20 mt-6" />
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label htmlFor="blog-search" className="font-mono text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
              Search Publications
            </label>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type keywords..."
              id="blog-search"
              className="bg-transparent border-0 border-b border-charcoal/20 rounded-none px-0 pb-2 focus:ring-0 focus-visible:ring-0 focus-visible:border-charcoal font-mono text-sm placeholder:text-charcoal/30 text-charcoal shadow-none w-full"
            />
          </div>

          {allTags.length > 0 && (
            <div className="md:col-span-6 flex flex-wrap gap-2 items-center justify-start md:justify-end">
              <button
                onClick={() => setActiveTag('')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                  activeTag === ''
                    ? 'bg-charcoal text-alabaster border-charcoal'
                    : 'bg-transparent border-charcoal/20 text-charcoal/60 hover:text-charcoal hover:border-charcoal'
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
                      ? 'bg-charcoal text-alabaster border-charcoal'
                      : 'bg-transparent border-charcoal/20 text-charcoal/60 hover:text-charcoal hover:border-charcoal'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 font-mono text-xs text-charcoal/50 uppercase tracking-widest">
            No publications found matching your query.
          </div>
        ) : (
          /* Cards Grid w/ Asymmetric look */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
            {filtered.map((post, i) => {
              const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              // Rotate pastel accent border styles
              const borders = ['border-pastel-pink', 'border-pastel-teal', 'border-pastel-blue'];
              const borderCol = borders[i % borders.length];

              return (
                <div key={post._id} className="flex flex-col group relative">
                  {/* Card Container w/ Offset frame */}
                  <div className="relative aspect-[16/11] mb-5 shrink-0">
                    <div className={`absolute -inset-1 border-2 border-dashed ${borderCol} rounded-[20px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`} />
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block w-full h-full rounded-[20px] border border-charcoal/10 overflow-hidden relative z-10 bg-muted/30"
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
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-charcoal/5">
                          📝
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50 flex gap-4 mb-2">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="font-bold text-charcoal/70">{post.tags[0]}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="hover:opacity-85 transition-opacity">
                      <h2 className="font-serif text-xl font-bold text-charcoal mb-2 leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="font-mono text-xs leading-relaxed text-charcoal/65 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block bg-charcoal text-alabaster hover:bg-charcoal/80 rounded-full font-mono text-[9px] uppercase tracking-widest px-4 py-2 self-start mt-auto transition-all"
                    >
                      Read post
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-charcoal/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-charcoal/10 pointer-events-none" />
    </div>
  );
}
