import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import ViewCounter from "./ViewCounter";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = (await Post.findOne({ slug, published: true }).lean()) as any;
  if (!post) return { title: "Post Not Found" };
  const description =
    post.excerpt || `${post.title} — read this article on our blog.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(
    post.title,
  )}&description=${encodeURIComponent(description)}&type=Blog&image=${post.coverUrl || ""}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${baseUrl}/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImageUrl],
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
  const dateStr = new Date(serializedPost.publishedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: serializedPost.title,
    description: serializedPost.excerpt || "",
    ...(serializedPost.coverUrl && { image: serializedPost.coverUrl }),
    datePublished: serializedPost.publishedAt,
    dateModified: serializedPost.updatedAt || serializedPost.publishedAt,
    url: `${baseUrl}/blog/${serializedPost.slug}`,
    ...(serializedPost.tags?.length && {
      keywords: serializedPost.tags.join(", "),
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${serializedPost.slug}`,
    },
  };

  return (
    <div className="bg-background min-h-screen py-28 md:py-36 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <span>← Back to Blog</span>
        </Link>

        <header className="flex flex-col gap-4 pb-8 border-b border-border/60">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{dateStr}</span>
            <span>•</span>
            <span>{serializedPost.views} views</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {serializedPost.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {serializedPost.excerpt}
          </p>

          {serializedPost.tags && serializedPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {serializedPost.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 rounded-full bg-secondary/80 text-foreground/80 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image Container */}
        {serializedPost.coverUrl && (
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-border/70 bg-muted/40 shadow-xs">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${serializedPost.coverUrl})` }}
            />
          </div>
        )}

        <article
          className="prose dark:prose-invert max-w-none font-sans text-sm sm:text-base leading-relaxed text-foreground/85 pt-4"
          dangerouslySetInnerHTML={{ __html: serializedPost.content }}
        />

        <div className="pt-8 border-t border-border/60">
          <ViewCounter slug={serializedPost.slug} />
        </div>
      </div>
    </div>
  );
}
