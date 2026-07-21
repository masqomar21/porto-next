import connectDB from "@/lib/mongodb";
import Experience from "@/models/Experience";
import type { Metadata } from "next";
import ExperienceClientPage from "./ExperienceClient";

export const metadata: Metadata = {
  title: "Experience Timeline",
  description:
    "A comprehensive timeline of my work experience, software engineering roles, and contributions.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience Timeline",
    description:
      "A comprehensive timeline of my work experience, software engineering roles, and contributions.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function PublicExperiencePage() {
  await connectDB();

  const experiences = await Experience.find({}).sort({ order: 1 }).lean();
  const serialized = JSON.parse(JSON.stringify(experiences));

  return <ExperienceClientPage experiences={serialized} />;
}
