import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsClientPage from "./ProjectsClient";
import type { Metadata } from "next";

const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=Projects&description=A showcase of my software engineering work and projects.`;

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my software engineering work and projects.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    description: "A showcase of my software engineering work and projects.",
    type: "website",
    locale: "en_US",
    siteName: "Muhammad Qomarudin",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Muhammad Qomarudin Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    description: "A showcase of my software engineering work and projects.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Muhammad Qomarudin Projects",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await connectDB();

  const projects = await Project.find({}).sort({ order: 1 }).lean();
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectsClientPage projects={serializedProjects} />;
}
