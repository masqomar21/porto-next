import connectDB from '@/lib/mongodb';
import Hero from '@/models/Hero';
import About from '@/models/About';
import Skill from '@/models/Skill';
import Project from '@/models/Project';
import Post from '@/models/Post';
import Contact from '@/models/Contact';
import Experience from '@/models/Experience';
import NavbarModel from '@/models/Navbar';
import HeroSection from '@/components/sections/Hero';
import AboutSection from '@/components/sections/About';
import ExperienceSection from '@/components/sections/Experience';
import SkillsSection from '@/components/sections/Skills';
import ProjectsSection from '@/components/sections/Projects';
import BlogSection from '@/components/sections/Blog';
import ContactSection from '@/components/sections/Contact';
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

  const [hero, about, skills, projects, posts, contact, experiences, navbar] = await Promise.all([
    Hero.findOne({}).lean().then(d => d || {}),
    About.findOne({}).lean().then(d => d || {}),
    Skill.find({}).sort({ categoryOrder: 1, order: 1 }).lean(),
    Project.find({ featured: true }).sort({ order: 1 }).limit(6).lean(),
    Post.find({ published: true }).sort({ publishedAt: -1 }).limit(6).select('-content').lean(),
    Contact.findOne({}).lean().then(d => d || {}),
    Experience.find({}).sort({ order: 1 }).limit(3).lean(),
    NavbarModel.findOne({}).lean().then(d => d || {}),
  ]);

  // Serialize Mongoose documents to plain objects (removes ObjectId, Date etc.)
  const serialize = <T,>(data: T): T => JSON.parse(JSON.stringify(data));

  const sectionOrder = (navbar as any)?.sectionOrder || ['hero', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'];

  return (
    <main>
      {sectionOrder.map((sectionId: string) => {
        switch (sectionId) {
          case 'hero':
            return (
              <HeroSection 
                key="hero"
                data={serialize(hero)} 
                socialLinks={serialize(contact?.socialLinks || [])} 
                skills={serialize(skills)} 
              />
            );
          case 'about':
            return (
              <AboutSection 
                key="about" 
                data={serialize(about)} 
                name={hero?.name} 
                email={contact?.email} 
              />
            );
          case 'experience':
            return (
              <ExperienceSection 
                key="experience" 
                data={serialize(experiences)} 
              />
            );
          case 'skills':
            return (
              <SkillsSection 
                key="skills" 
                data={serialize(skills)} 
              />
            );
          case 'projects':
            return (
              <ProjectsSection 
                key="projects" 
                data={serialize(projects)} 
              />
            );
          case 'blog':
            return (
              <BlogSection 
                key="blog" 
                data={serialize(posts)} 
              />
            );
          case 'contact':
            return (
              <ContactSection 
                key="contact" 
                data={serialize(contact)} 
              />
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
