import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function seed() {
  console.log('🌱 Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);

  // Models
  const UserSchema = new mongoose.Schema({ email: String, name: String, passwordHash: String });
  const HeroSchema = new mongoose.Schema({ name: String, roles: [String], tagline: String, ctaPrimaryLabel: String, ctaPrimaryUrl: String, ctaSecondaryLabel: String, ctaSecondaryUrl: String });
  const AboutSchema = new mongoose.Schema({ bio: String, photoUrl: String, resumeUrl: String });
  const ContactSchema = new mongoose.Schema({ email: String, socialLinks: [{ platform: String, url: String, icon: String }] });
  const SkillSchema = new mongoose.Schema({ category: String, name: String, level: Number, icon: String, order: Number });
  const ProjectSchema = new mongoose.Schema({ title: String, slug: String, excerpt: String, coverUrl: String, content: String, tags: [String], liveUrl: String, githubUrl: String, featured: Boolean, order: Number, publishedAt: Date });
  const PostSchema = new mongoose.Schema({ title: String, slug: String, excerpt: String, coverUrl: String, content: String, tags: [String], published: Boolean, views: Number, publishedAt: Date });
  const ExperienceSchema = new mongoose.Schema({
    role: String,
    company: String,
    companyUrl: String,
    duration: String,
    description: String,
    tags: [String],
    links: [{ label: String, url: String }],
    order: Number
  });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
  const About = mongoose.models.About || mongoose.model('About', AboutSchema);
  const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
  const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
  const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
  const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
  const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);

  // Seed admin user
  const email = 'admin@portfolio.dev';
  const password = 'Admin@1234';
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ email, name: 'Emma Lesley', passwordHash });
    console.log(`✅ Admin user created: ${email} / ${password}`);
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // Seed hero
  await Hero.deleteMany({});
  await Hero.create({
    name: 'Emma Lesley',
    roles: ['Full-Stack Developer', 'UI/UX Designer', 'Open Source Builder'],
    tagline: 'I build fast, beautiful, and highly scalable web applications, designing interfaces that feel alive and responsive.',
    ctaPrimaryLabel: 'View Works',
    ctaPrimaryUrl: '#projects',
    ctaSecondaryLabel: 'Read Blog',
    ctaSecondaryUrl: '/blog',
  });
  console.log('✅ Hero seeded.');

  // Seed about
  await About.deleteMany({});
  await About.create({
    bio: "Hi! I'm a full-stack engineer and designer passionate about crafting high-performance user interfaces and building tools that developers love. I spend my time exploring modern styling technologies, optimizing databases, and deploying clean code architectures.\n\nWhen I'm not pushing pixels or seeding databases, you'll find me writing technical deep dives on my blog, contributing to the Open Source ecosystem, or prototyping side projects.",
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    resumeUrl: 'https://example.com/resume.pdf',
  });
  console.log('✅ About seeded.');

  // Seed contact
  await Contact.deleteMany({});
  await Contact.create({
    email: 'hello@emmalesley.dev',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    ],
  });
  console.log('✅ Contact seeded.');

  // Seed skills
  await Skill.deleteMany({});
  await Skill.create([
    // Frontend
    { category: 'Frontend Development', name: 'React & Next.js', level: 95, order: 1 },
    { category: 'Frontend Development', name: 'Tailwind CSS', level: 90, order: 2 },
    { category: 'Frontend Development', name: 'TypeScript', level: 85, order: 3 },
    { category: 'Frontend Development', name: 'Framer Motion', level: 80, order: 4 },
    // Backend
    { category: 'Backend & Databases', name: 'Node.js & Express', level: 85, order: 5 },
    { category: 'Backend & Databases', name: 'GraphQL & REST', level: 80, order: 6 },
    { category: 'Backend & Databases', name: 'MongoDB & Mongoose', level: 90, order: 7 },
    { category: 'Backend & Databases', name: 'PostgreSQL', level: 75, order: 8 },
    // Tools & Design
    { category: 'Tools & Design', name: 'Figma', level: 80, order: 9 },
    { category: 'Tools & Design', name: 'Docker', level: 70, order: 10 },
    { category: 'Tools & Design', name: 'Git & GitHub CI/CD', level: 85, order: 11 },
  ]);
  console.log('✅ Skills seeded.');

  // Seed projects
  await Project.deleteMany({});
  await Project.create([
    {
      title: 'Alabaster CMS & Portfolio',
      slug: 'alabaster-cms-portfolio',
      excerpt: 'A gorgeous, high-contrast developer portfolio themed after Editorial Serif and monospace aesthetics, fully integrated with a Node.js/MongoDB CMS.',
      coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
      content: '<h2>About this project</h2><p>This project is a bespoke developer portfolio platform designed to showcase creative development work with an elegant, warm-toned Alabaster palette. Features include dynamic content management, real-time views tracking, robust Next.js authentication, and customizable database queries.</p><p>Built using Next.js 16, Tailwind CSS v4, and MongoDB to serve as a fast, reliable, and beautiful personal portal.</p>',
      tags: ['Next.js', 'Tailwind CSS', 'MongoDB'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 1,
      publishedAt: new Date('2026-05-15'),
    },
    {
      title: 'Aura Workspace App',
      slug: 'aura-workspace-app',
      excerpt: 'A minimalistic, collaborative task board with drag-and-drop workspace layout, realtime socket updates, and localized analytics charts.',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      content: '<h2>The Workspace Redefined</h2><p>Aura workspace represents a fresh take on collaborative management. Using lightweight clients, offline-first syncing databases, and high-performance WebSockets, it provides seamless task management with instant state propagation.</p>',
      tags: ['React', 'WebSockets', 'Node.js'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 2,
      publishedAt: new Date('2026-04-10'),
    },
    {
      title: 'Zenith Asset Engine',
      slug: 'zenith-asset-engine',
      excerpt: 'An optimized asset delivery engine built for high-throughput images, offering dynamic resizing, caching, and CDN propagation.',
      coverUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop',
      content: '<h2>High performance asset pipeline</h2><p>Zenith is a microservice designed to ingest, resize, format-compress, and store images in distributed cloud buckets. Under load tests, it handles 50,000 requests per minute with low sub-10ms latency.</p>',
      tags: ['Go', 'Docker', 'AWS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      order: 3,
      publishedAt: new Date('2026-03-01'),
    },
  ]);
  console.log('✅ Projects seeded.');

  // Seed posts
  await Post.deleteMany({});
  await Post.create([
    {
      title: 'Mastering Next.js Server Components',
      slug: 'mastering-nextjs-server-components',
      excerpt: 'Deep dive into React Server Components (RSC), data fetching strategies, hydration boundaries, and building zero-bundle-size client views.',
      coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
      content: '<p>React Server Components represent a major shift in how we build user interfaces. By moving rendering to the server, we can significantly reduce JavaScript shipped to the client, leading to instant load speeds.</p><h3>Why Server Components?</h3><p>Unlike standard Client Components, Server Components execute only on the server, meaning all dependencies required for fetching and formatting content stay out of client bundles.</p>',
      tags: ['Next.js', 'React'],
      published: true,
      views: 142,
      publishedAt: new Date('2026-05-20'),
    },
    {
      title: "Tailwind CSS v4: What's New?",
      slug: 'tailwind-css-v4-whats-new',
      excerpt: "An in-depth review of Tailwind CSS v4's new Rust-powered compiler, the inline @theme configuration, dynamic variants, and CSS variables integration.",
      coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
      content: '<p>Tailwind CSS v4 introduces a complete rewrite of the compiler engine, built from the ground up in Rust for up to 10x faster compile times. It also deprecates the old tailwind.config.js in favor of pure CSS config using @theme directives.</p><h3>Native Cascading Config</h3><p>CSS variables are now fully first-class citizens in v4, allowing design tokens to be updated at runtime dynamically.</p>',
      tags: ['Tailwind', 'CSS'],
      published: true,
      views: 98,
      publishedAt: new Date('2026-05-10'),
    },
  ]);
  console.log('✅ Blog posts seeded.');

  // Seed experiences
  await Experience.deleteMany({});
  await Experience.create([
    {
      role: 'Senior Frontend Engineer, Accessibility',
      company: 'Klaviyo',
      companyUrl: 'https://www.klaviyo.com',
      duration: '2024 — PRESENT',
      description: 'Build and maintain critical components used to construct Klaviyo’s frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers, to implement and advocate for best practices in web accessibility.',
      tags: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
      links: [],
      order: 1
    },
    {
      role: 'Lead Engineer',
      company: 'Upstatement',
      companyUrl: 'https://www.upstatement.com',
      duration: '2018 — 2024',
      description: 'Build, style, and ship high-quality websites, design systems, mobile apps, and digital experiences for a diverse array of projects for clients including Harvard Business School, Everytown for Gun Safety, Pratt Institute, Koala Health, Vanderbilt University, The 19th News, and more. Provide leadership within engineering department through close collaboration, knowledge shares, and spearheading the development of internal tools.',
      tags: ['JavaScript', 'TypeScript', 'HTML & SCSS', 'React', 'Next.js', 'React Native', 'WordPress', 'Contentful', 'Node.js', 'PHP'],
      links: [],
      order: 2
    },
    {
      role: 'UI Engineer Co-op',
      company: 'Apple',
      companyUrl: 'https://www.apple.com',
      duration: 'JULY — DEC 2017',
      description: 'Developed and styled interactive web apps for Apple Music, including the user interface of Apple Music’s embeddable web player widget for in-browser user authorization and full song playback.',
      tags: ['Ember', 'SCSS', 'JavaScript', 'MusicKit.js'],
      links: [
        { label: 'MusicKit.js', url: 'https://developer.apple.com/documentation/musickitjs' },
        { label: '9to5Mac', url: 'https://9to5mac.com' },
        { label: 'The Verge', url: 'https://theverge.com' }
      ],
      order: 3
    }
  ]);
  console.log('✅ Job experiences seeded.');

  console.log('\n🚀 Seed complete!');
  console.log('👉 Login at /admin/login');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('\n⚠️  Change your password after first login at /admin/settings\n');

  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
