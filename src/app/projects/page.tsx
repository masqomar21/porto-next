import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectsClientPage from './ProjectsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my software engineering work and projects.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects',
    description: 'A showcase of my software engineering work and projects.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  await connectDB();

  const projects = await Project.find({}).sort({ order: 1 }).lean();
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return (
    <ProjectsClientPage projects={serializedProjects} />
  );
}
