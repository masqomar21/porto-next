import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Contact from '@/models/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectsClientPage from './ProjectsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my software engineering work and projects.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  await connectDB();

  const [projects, contact] = await Promise.all([
    Project.find({}).sort({ order: 1 }).lean(),
    Contact.findOne({}).lean().then(d => d || {}),
  ]);

  const serializedProjects = JSON.parse(JSON.stringify(projects));
  const serializedContact = JSON.parse(JSON.stringify(contact));

  return (
    <>
      <Navbar />
      <ProjectsClientPage projects={serializedProjects} />
      <Footer contactData={serializedContact} />
    </>
  );
}
