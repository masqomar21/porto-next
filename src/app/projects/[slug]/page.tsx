import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
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
  const project = (await Project.findOne({ slug }).lean()) as any;
  if (!project) return { title: "Project Not Found" };
  const description =
    project.excerpt || `${project.title} — a software engineering project.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(
    project.title,
  )}&description=${encodeURIComponent(description)}&type=Project&image=${project.coverUrl || ""}`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `${baseUrl}/projects/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const project = await Project.findOne({ slug }).lean();

  if (!project) {
    notFound();
  }

  const serializedProject = JSON.parse(JSON.stringify(project));
  const year = serializedProject.publishedAt
    ? new Date(serializedProject.publishedAt).getFullYear()
    : new Date().getFullYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: serializedProject.title,
    description: serializedProject.excerpt || "",
    ...(serializedProject.coverUrl && { image: serializedProject.coverUrl }),
    url: `${baseUrl}/projects/${serializedProject.slug}`,
    ...(serializedProject.tags?.length && {
      keywords: serializedProject.tags.join(", "),
    }),
    ...(serializedProject.liveUrl && { url: serializedProject.liveUrl }),
    ...(serializedProject.githubUrl && {
      codeRepository: serializedProject.githubUrl,
    }),
  };

  return (
    <div className="bg-background min-h-screen py-28 md:py-36 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <span>← Back to Projects</span>
        </Link>

        <header className="flex flex-col gap-4 pb-8 border-b border-border/60">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{year}</span>
            <span>•</span>
            <span className="text-primary font-medium">FEATURED PROJECT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {serializedProject.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {serializedProject.excerpt}
          </p>

          {serializedProject.tags && serializedProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {serializedProject.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 rounded-full bg-secondary/80 text-foreground/80 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 pt-4">
            {serializedProject.liveUrl && (
              <a
                href={serializedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-foreground text-background hover:opacity-90 rounded-full font-mono text-xs font-medium transition-opacity inline-flex items-center gap-1.5"
              >
                <span>Live Preview</span>
                <span>↗</span>
              </a>
            )}
            {serializedProject.githubUrl && (
              <a
                href={serializedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-card border border-border text-foreground hover:bg-secondary rounded-full font-mono text-xs font-medium transition-colors"
              >
                Source Code
              </a>
            )}
          </div>
        </header>

        {/* Cover Image Container */}
        {serializedProject.coverUrl && (
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-border/70 bg-muted/40 shadow-xs">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${serializedProject.coverUrl})` }}
            />
          </div>
        )}

        {/* Article Body */}
        <article
          className="prose dark:prose-invert max-w-none font-sans text-sm sm:text-base leading-relaxed text-foreground/85 pt-4"
          dangerouslySetInnerHTML={{ __html: serializedProject.content }}
        />
      </div>
    </div>
  );
}
