import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

async function seed() {
  console.log("🌱 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);

  // Models
  const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    passwordHash: String,
  });
  const HeroSchema = new mongoose.Schema({
    name: String,
    roles: [String],
    tagline: String,
    ctaPrimaryLabel: String,
    ctaPrimaryUrl: String,
    ctaSecondaryLabel: String,
    ctaSecondaryUrl: String,
  });
  const AboutSchema = new mongoose.Schema({
    bio: String,
    photoUrl: String,
    resumeUrl: String,
  });
  const ContactSchema = new mongoose.Schema({
    email: String,
    socialLinks: [{ platform: String, url: String, icon: String }],
  });
  const SkillSchema = new mongoose.Schema({
    category: String,
    name: String,
    level: Number,
    icon: String,
    order: Number,
    categoryOrder: Number,
  });
  const ProjectSchema = new mongoose.Schema({
    title: String,
    slug: String,
    excerpt: String,
    coverUrl: String,
    content: String,
    tags: [String],
    liveUrl: String,
    githubUrl: String,
    featured: Boolean,
    order: Number,
    publishedAt: Date,
  });
  const PostSchema = new mongoose.Schema({
    title: String,
    slug: String,
    excerpt: String,
    coverUrl: String,
    content: String,
    tags: [String],
    published: Boolean,
    views: Number,
    publishedAt: Date,
  });
  const ExperienceSchema = new mongoose.Schema({
    role: String,
    company: String,
    companyUrl: String,
    duration: String,
    description: String,
    tags: [String],
    links: [{ label: String, url: String }],
    order: Number,
  });
  const NavbarSchema = new mongoose.Schema({
    title: { type: String, default: "My Portfolio" },
    imageUrl: { type: String, default: "" },
    sectionOrder: {
      type: [String],
      default: [
        "hero",
        "about",
        "experience",
        "skills",
        "projects",
        "blog",
        "contact",
      ],
    },
  });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
  const About = mongoose.models.About || mongoose.model("About", AboutSchema);
  const Contact =
    mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
  const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
  const Project =
    mongoose.models.Project || mongoose.model("Project", ProjectSchema);
  const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
  const Experience =
    mongoose.models.Experience ||
    mongoose.model("Experience", ExperienceSchema);
  const Navbar =
    mongoose.models.Navbar || mongoose.model("Navbar", NavbarSchema);

  // Seed admin user
  const email = "admin@app.dev";
  const password = "password123";
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ email, name: "Muhammad Qomarudin", passwordHash });
    console.log(`✅ Admin user created: ${email} / ${password}`);
  } else {
    await User.updateOne({ email }, { name: "Muhammad Qomarudin" });
    console.log("ℹ️  Admin user already exists, updated name.");
  }

  // Seed navbar
  await Navbar.deleteMany({});
  await Navbar.create({
    title: "masqomar.21",
    imageUrl: "",
    sectionOrder: [
      "hero",
      "about",
      "experience",
      "skills",
      "projects",
      "blog",
      "contact",
    ],
  });
  console.log("✅ Navbar seeded.");

  // Seed hero
  await Hero.deleteMany({});
  await Hero.create({
    name: "Muhammad Qomarudin",
    roles: [
      "Full-Stack Developer",
      "Software Engineer",
      "Open Source Builder",
      "Tech Enthusiast",
    ],
    tagline:
      "I build fast, beautiful, and highly scalable web applications, designing interfaces that feel alive and responsive.",

    ctaPrimaryLabel: "View Works",
    ctaPrimaryUrl: "#projects",
    ctaSecondaryLabel: "Read Blog",
    ctaSecondaryUrl: "/blog",
    // ctaPrimaryLabel: "Contact me here",
    // ctaPrimaryUrl: "#contact",
    // ctaSecondaryLabel: "Download CV",
    // ctaSecondaryUrl: "https://masqomar.com/CV.pdf",
  });
  console.log("✅ Hero seeded.");

  // Seed about
  await About.deleteMany({});
  await About.create({
    bio: "During my time in college, I focused heavily on delving into the world of programming, actively engaged in various projects and coding practices to strengthen my understanding and skills in different programming languages and current technologies. I am always enthusiastic about continuously learning and honing my skills in this field.\n\nIn the world of development, I am accustomed to using various programming languages and tools such PHP, JavaScipts, CI, laravel, React, React-Navite, Next.js, Node.js, MySQL, and MongoDB. I am also familiar with TypeScript, Prisma and Squelize. I am always looking to learn new technologies.\n\nWhen I'm not coding, I enjoy playing video games, and watching movies or anime. I also enjoy learning new things. I am currently learning about DevOps",
    photoUrl: "",
    resumeUrl: "https://masqomar.com/CV.pdf",
  });
  console.log("✅ About seeded.");

  // Seed contact
  await Contact.deleteMany({});
  await Contact.create({
    email: "masqomar21@gmail.com",
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/masqomar21",
        icon: "github",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/masqomar21/",
        icon: "linkedin",
      },
      {
        platform: "Instagram",
        url: "https://www.instagram.com/masqomar.21/",
        icon: "instagram",
      },
    ],
  });
  console.log("✅ Contact seeded.");

  // Seed skills
  await Skill.deleteMany({});
  await Skill.create([
    // Frontend
    {
      category: "Frontend Development",
      name: "HTML",
      level: 90,
      order: 1,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "CSS",
      level: 85,
      order: 2,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "JavaScript",
      level: 90,
      order: 3,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "TypeScript",
      level: 80,
      order: 4,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "React",
      level: 90,
      order: 5,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "React Native",
      level: 80,
      order: 6,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "Next.js",
      level: 85,
      order: 7,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "Tailwind",
      level: 90,
      order: 8,
      categoryOrder: 1,
    },
    {
      category: "Frontend Development",
      name: "Redux",
      level: 75,
      order: 9,
      categoryOrder: 1,
    },

    // Backend
    {
      category: "Backend & Databases",
      name: "PHP",
      level: 85,
      order: 1,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "Laravel",
      level: 85,
      order: 2,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "CI",
      level: 80,
      order: 3,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "Node.js",
      level: 80,
      order: 4,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "Express",
      level: 80,
      order: 5,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "Python",
      level: 70,
      order: 6,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "GO",
      level: 70,
      order: 7,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "MySQL",
      level: 85,
      order: 8,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "MongoDB",
      level: 80,
      order: 9,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "PostgreSQL",
      level: 75,
      order: 10,
      categoryOrder: 2,
    },
    {
      category: "Backend & Databases",
      name: "Prisma",
      level: 80,
      order: 11,
      categoryOrder: 2,
    },

    // Tools & Hardware
    {
      category: "Tools & Hardware",
      name: "Git",
      level: 85,
      order: 1,
      categoryOrder: 3,
    },
    {
      category: "Tools & Hardware",
      name: "Arduino",
      level: 75,
      order: 2,
      categoryOrder: 3,
    },
  ]);
  console.log("✅ Skills seeded.");

  // Seed projects
  await Project.deleteMany({});
  await Project.create([
    {
      title: "TiketPapa - Ticket Booking System (Front-End)",
      slug: "tiketpapa-ticket-booking",
      excerpt:
        "A ticket booking system for a cinema. I was responsible for the front-end development, including the design and implementation of the user interface.",
      coverUrl:
        "https://masqomar.com/_next/static/media/corpcomment.3895cd42.png",
      content:
        "<h2>About the project</h2><p>TiketPapa is a high-performance cinema ticket booking front-end application. It features an interactive seat selection layout, dynamic pricing calculations, booking history, and responsive layout adjustments.</p><p>Built using React, Next.js, Tailwind, Prisma, Redux, and Redux-Saga to deliver a modern, smooth, and highly responsive user experience.</p>",
      tags: ["React", "Next.js", "Tailwind", "Prisma", "Redux", "Redux-Saga"],
      liveUrl: "https://masqomar.com",
      githubUrl: "https://github.com/masqomar21",
      featured: true,
      order: 1,
      publishedAt: new Date("2023-11-15"),
    },
    {
      title: "BrainWave - Application for IOT monitoring",
      slug: "brainwave-iot-monitoring",
      excerpt:
        "An application for monitoring IOT devices. I was responsible for the front-end and back-end development, including implementation bluetooth connection for IOT device.",
      coverUrl:
        "https://masqomar.com/_next/static/media/corpcomment.3895cd42.png",
      content:
        "<h2>About the project</h2><p>BrainWave is a comprehensive IoT monitoring mobile/web application designed to connect and read metrics from hardware sensors in real-time. It includes a built-in Bluetooth and WiFi connectivity module to pair seamlessly with hardware controllers like ESP32/Arduino.</p><p>Built using React Native, Expo, and Tailwind to guarantee cross-platform support and a clean, responsive styling system.</p>",
      tags: ["React", "React Native", "Expo", "Tailwind"],
      liveUrl: "https://masqomar.com",
      githubUrl: "https://github.com/masqomar21",
      featured: true,
      order: 2,
      publishedAt: new Date("2023-08-20"),
    },
  ]);
  console.log("✅ Projects seeded.");

  // Seed posts
  await Post.deleteMany({});
  await Post.create([
    {
      title: "Mastering Next.js Server Components",
      slug: "mastering-nextjs-server-components",
      excerpt:
        "Deep dive into React Server Components (RSC), data fetching strategies, hydration boundaries, and building zero-bundle-size client views.",
      coverUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
      content:
        "<p>React Server Components represent a major shift in how we build user interfaces. By moving rendering to the server, we can significantly reduce JavaScript shipped to the client, leading to instant load speeds.</p><h3>Why Server Components?</h3><p>Unlike standard Client Components, Server Components execute only on the server, meaning all dependencies required for fetching and formatting content stay out of client bundles.</p>",
      tags: ["Next.js", "React"],
      published: true,
      views: 142,
      publishedAt: new Date("2026-05-20"),
    },
    {
      title: "Tailwind CSS v4: What's New?",
      slug: "tailwind-css-v4-whats-new",
      excerpt:
        "An in-depth review of Tailwind CSS v4's new Rust-powered compiler, the inline @theme configuration, dynamic variants, and CSS variables integration.",
      coverUrl:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
      content:
        "<p>Tailwind CSS v4 introduces a complete rewrite of the compiler engine, built from the ground up in Rust for up to 10x faster compile times. It also deprecates the old tailwind.config.js in favor of pure CSS config using @theme directives.</p><h3>Native Cascading Config</h3><p>CSS variables are now fully first-class citizens in v4, allowing design tokens to be updated at runtime dynamically.</p>",
      tags: ["Tailwind", "CSS"],
      published: true,
      views: 98,
      publishedAt: new Date("2026-05-10"),
    },
  ]);
  console.log("✅ Blog posts seeded.");

  // Seed experiences
  await Experience.deleteMany({});
  await Experience.create([
    {
      role: "Back-End Developer",
      company: "CV. Newus Technology",
      companyUrl: "",
      duration: "2025 - Now",
      description:
        "Developed a lot of web applications for clients using various technologies and frameworks.",
      tags: [
        "TypeScript",
        "Node.js",
        "Express",
        "Prisma",
        "PostgreSQL",
        "REST API",
        "Socket.io",
        "RabbitMQ",
        "Golang",
        "Gin",
      ],
      links: [],
      order: 1,
    },
    {
      role: "Back-End Developer",
      company: "PT. Cinda Lagika Gravia (Internship)",
      companyUrl: "",
      duration: "2023",
      description:
        "developed a web application for the company's internal use. I was responsible for the back-end development, including the design and implementation of the database.",
      tags: ["PHP", "Laravel", "MySQL", "REST API"],
      links: [],
      order: 1,
    },
    {
      role: "Full-Stack Developer",
      company: "PT. Gatra Mapan (Internship)",
      companyUrl: "",
      duration: "2023",
      description:
        "developed a web application for the company's internal use. I was responsible for the front-end and back-end development, including the design and implementation of the database.",
      tags: ["PHP", "Laravel", "Bootstrap", "MySQL"],
      links: [],
      order: 2,
    },
    {
      role: "Head of IT Sub Division",
      company: "PEMIRA 2023 (ITERA)",
      companyUrl: "https://itera.ac.id",
      duration: "2022 - 2023",
      description:
        "I was responsible for monitoring, coordinating, and developing a website for the student presidential election using Tailwind and CodeIgniter. My tasks included ensuring the site's functionality, maintaining an efficient workflow, and implementing responsive design principles to provide a smooth user experience.",
      tags: ["Tailwind", "CodeIgniter", "PHP", "MySQL"],
      links: [],
      order: 3,
    },
    {
      role: "Front-End Developer",
      company: "PPKL 2022 (ITERA)",
      companyUrl: "https://itera.ac.id",
      duration: "2022",
      description:
        "In developing a website interface for the campus introduction event at ITERA, I focused on designing an engaging and user-friendly experience.",
      tags: ["HTML", "CSS", "JavaScript"],
      links: [],
      order: 4,
    },
  ]);
  console.log("✅ Job experiences seeded.");

  console.log("\n🚀 Seed complete!");
  console.log("👉 Login at /admin/login");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(
    "\n⚠️  Change your password after first login at /admin/settings\n",
  );

  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
