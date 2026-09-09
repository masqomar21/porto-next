'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, BookOpen, Search } from 'lucide-react';

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
    <div className="bg-background min-h-screen py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-border/60">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Writings & Insights
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Articles, Guides & Notes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Exploring modern web engineering, architecture decisions, interface design, and development workflows.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles by title, keyword, or topic..."
              id="blog-search"
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
                All ({posts.length})
              </button>
              {allTags.map(t => {
                const count = posts.filter(p => p.tags.includes(t)).length;
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
            No articles found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => {
              const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={post._id}
                  className="group rounded-3xl bg-card border border-border/80 hover:border-foreground/20 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden border-b border-border/60">
                    {post.coverUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-104 transition-transform duration-500"
                        style={{ backgroundImage: `url(${post.coverUrl})` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-2xl text-muted-foreground/40">
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
                          <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-foreground/80 font-medium">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground group-hover:text-foreground font-medium flex items-center justify-between transition-colors mt-auto"
                    >
                      <span>Read article</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
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
