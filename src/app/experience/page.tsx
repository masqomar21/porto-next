import connectDB from "@/lib/mongodb";
import Experience from "@/models/Experience";
import type { Metadata } from "next";
import ExperienceClientPage from "./ExperienceClient";

const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=Experience%20Timeline&description=A%20comprehensive%20timeline%20of%20my%20work%20experience,%20software%20engineering%20roles,%20and%20contributions.`;

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
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Muhammad Qomarudin Experience Timeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Muhammad Qomarudin Experience Timeline",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function PublicExperiencePage() {
  await connectDB();

  const experiences = await Experience.find({}).sort({ order: 1 }).lean();
  const serialized = JSON.parse(JSON.stringify(experiences));

  return <ExperienceClientPage experiences={serialized} />;
}
