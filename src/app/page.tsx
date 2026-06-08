import connectDB from '@/lib/mongodb';
import Hero from '@/models/Hero';
import About from '@/models/About';
import Skill from '@/models/Skill';
import Project from '@/models/Project';
import Post from '@/models/Post';
import Contact from '@/models/Contact';
import HeroSection from '@/components/sections/Hero';
import AboutSection from '@/components/sections/About';
import SkillsSection from '@/components/sections/Skills';
import ProjectsSection from '@/components/sections/Projects';
import BlogSection from '@/components/sections/Blog';
import ContactSection from '@/components/sections/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const hero = await Hero.findOne({}).lean() as { name?: string; tagline?: string } | null;
  return {
    title: hero?.name ? `${hero.name} — Portfolio` : 'Developer Portfolio',
    description: hero?.tagline || 'Full-stack developer portfolio and blog.',
  };
}

export default async function HomePage() {
  await connectDB();

  const [hero, about, skills, projects, posts, contact] = await Promise.all([
    Hero.findOne({}).lean().then(d => d || {}),
    About.findOne({}).lean().then(d => d || {}),
    Skill.find({}).sort({ categoryOrder: 1, order: 1 }).lean(),
    Project.find({ featured: true }).sort({ order: 1 }).limit(6).lean(),
    Post.find({ published: true }).sort({ publishedAt: -1 }).limit(4).select('-content').lean(),
    Contact.findOne({}).lean().then(d => d || {}),
  ]);

  // Serialize Mongoose documents to plain objects (removes ObjectId, Date etc.)
  const serialize = <T,>(data: T): T => JSON.parse(JSON.stringify(data));

  return (
    <>
      <Navbar />
      <main>
        <HeroSection data={serialize(hero)} />
        <AboutSection data={serialize(about)} name={hero?.name} email={contact?.email} />
        <SkillsSection data={serialize(skills)} />
        <ProjectsSection data={serialize(projects)} />
        <BlogSection data={serialize(posts)} />
        <ContactSection data={serialize(contact)} />
      </main>
      <Footer contactData={serialize(contact)} />
    </>
  );
}
