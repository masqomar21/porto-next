import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Contact from '@/models/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ViewCounter from './ViewCounter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, published: true }).lean() as any;
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt || 'Read this post on our platform.',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const [post, contact] = await Promise.all([
    Post.findOne({ slug, published: true }).lean(),
    Contact.findOne({}).lean().then(d => d || {}),
  ]);

  if (!post) {
    notFound();
  }

  const serializedPost = JSON.parse(JSON.stringify(post));
  const serializedContact = JSON.parse(JSON.stringify(contact));
  const dateStr = new Date(serializedPost.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-alabaster min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-32 md:py-40 z-10 relative">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-8 transition-colors">
          ← Back to Blog
        </Link>
        
        <header className="mb-10">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-4">
            <span>{dateStr}</span>
            <span>•</span>
            <span>👁 {serializedPost.views} views</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-6 text-charcoal leading-tight">
            {serializedPost.title}
          </h1>

          {serializedPost.tags && serializedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serializedPost.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[9px] uppercase tracking-widest bg-charcoal text-alabaster px-3 py-1 rounded-full border border-charcoal">
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
            className="w-full h-full rounded-[24px] border border-charcoal/10 relative z-10 bg-muted/20"
            style={{
              backgroundImage: serializedPost.coverUrl ? `url(${serializedPost.coverUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <article className="prose max-w-none font-mono text-sm leading-relaxed text-charcoal/80" dangerouslySetInnerHTML={{ __html: serializedPost.content }} />

        <ViewCounter slug={serializedPost.slug} />
      </div>

      <Footer contactData={serializedContact} />

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-charcoal/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-charcoal/10 pointer-events-none" />
    </div>
  );
}
