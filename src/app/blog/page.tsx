import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import type { Metadata } from "next";
import BlogClientPage from "./BlogClient";

const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=Blog&description=Articles%2C%20thoughts%2C%20and%20tutorials%20on%20software%20development.`;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, thoughts, and tutorials on software development.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog",
    description: "Articles, thoughts, and tutorials on software development.",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Muhammad Qomarudin Blog",
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
        alt: "Muhammad Qomarudin Blog",
      },
    ],
  },
};
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find({ published: true })
    .sort({ publishedAt: -1 })
    .select("-content")
    .lean();
  const serialized = JSON.parse(JSON.stringify(posts));
  return <BlogClientPage posts={serialized} />;
}
