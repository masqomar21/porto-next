import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Contact from '@/models/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const project = await Project.findOne({ slug }).lean() as any;
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.excerpt || 'View this project on our portfolio.',
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const [project, contact] = await Promise.all([
    Project.findOne({ slug }).lean(),
    Contact.findOne({}).lean().then(d => d || {}),
  ]);

  if (!project) {
    notFound();
  }

  const serializedProject = JSON.parse(JSON.stringify(project));
  const serializedContact = JSON.parse(JSON.stringify(contact));
  const year = serializedProject.publishedAt ? new Date(serializedProject.publishedAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="bg-alabaster min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-32 md:py-40 z-10 relative">
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-8 transition-colors">
          ← Back to Projects
        </Link>
        
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-4">
            <span>{year}</span>
            <span>•</span>
            <span>PUBLISHED</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-6 text-charcoal leading-tight">
            {serializedProject.title}
          </h1>

          {serializedProject.tags && serializedProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {serializedProject.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[9px] uppercase tracking-widest bg-charcoal/5 text-charcoal border border-charcoal/20 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 mt-6">
            {serializedProject.liveUrl && (
              <a
                href={serializedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-charcoal text-alabaster hover:bg-charcoal/80 rounded-full font-mono text-xs uppercase tracking-widest transition-all"
              >
                Live Preview ↗
              </a>
            )}
            {serializedProject.githubUrl && (
              <a
                href={serializedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-transparent text-charcoal border border-charcoal/35 hover:border-charcoal hover:bg-charcoal/5 rounded-full font-mono text-xs uppercase tracking-widest transition-all"
              >
                Source Code
              </a>
            )}
          </div>
        </header>

        {/* Cover Image styled w/ offset dashed frame */}
        <div className="relative w-full h-60 md:h-[400px] mb-12 group">
          <div className="absolute -inset-1 border-2 border-dashed border-pastel-teal rounded-[24px] pointer-events-none opacity-50" />
          <div
            className="w-full h-full rounded-[24px] border border-charcoal/10 relative z-10 bg-muted/20"
            style={{
              backgroundImage: serializedProject.coverUrl ? `url(${serializedProject.coverUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <article className="prose max-w-none font-mono text-sm leading-relaxed text-charcoal/80" dangerouslySetInnerHTML={{ __html: serializedProject.content }} />
      </div>

      <Footer contactData={serializedContact} />

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-charcoal/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-charcoal/10 pointer-events-none" />
    </div>
  );
}
