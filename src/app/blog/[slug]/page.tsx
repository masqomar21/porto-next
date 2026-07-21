import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import ViewCounter from './ViewCounter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, published: true }).lean() as any;
  if (!post) return { title: 'Post Not Found' };
  const description = post.excerpt || `${post.title} — read this article on our blog.`;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      ...(post.coverUrl && { images: [{ url: post.coverUrl, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      ...(post.coverUrl && { images: [post.coverUrl] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug, published: true }).lean();

  if (!post) {
    notFound();
  }

  const serializedPost = JSON.parse(JSON.stringify(post));
  const dateStr = new Date(serializedPost.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: serializedPost.title,
    description: serializedPost.excerpt || '',
    ...(serializedPost.coverUrl && { image: serializedPost.coverUrl }),
    datePublished: serializedPost.publishedAt,
    dateModified: serializedPost.updatedAt || serializedPost.publishedAt,
    url: `${baseUrl}/blog/${serializedPost.slug}`,
    ...(serializedPost.tags?.length && { keywords: serializedPost.tags.join(', ') }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${serializedPost.slug}`,
    },
  };

  return (
    <div className="bg-background min-h-screen relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-32 md:py-40 z-10 relative">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground mb-8 transition-colors">
          ← Back to Blog
        </Link>
        
        <header className="mb-10">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-4">
            <span>{dateStr}</span>
            <span>•</span>
            <span>👁 {serializedPost.views} views</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground leading-tight">
            {serializedPost.title}
          </h1>

          {serializedPost.tags && serializedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serializedPost.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[9px] uppercase tracking-widest bg-foreground text-background px-3 py-1 rounded-full border border-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image styled w/ offset dashed frame */}
        <div className="relative w-full h-60 md:h-[400px] mb-12 group">
          <div className="absolute -inset-1 border-2 border-dashed border-pastel-pink rounded-[24px] pointer-events-none opacity-50" />
          <div
            className="w-full h-full rounded-[24px] border border-foreground/10 relative z-10 bg-muted/20"
            style={{
              backgroundImage: serializedPost.coverUrl ? `url(${serializedPost.coverUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <article className="prose max-w-none font-mono text-sm leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: serializedPost.content }} />

        <ViewCounter slug={serializedPost.slug} />
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </div>
  );
}
