import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import type { Metadata } from 'next';
import BlogClientPage from './BlogClient';

export const metadata: Metadata = { title: 'Blog', description: 'Articles, thoughts, and tutorials.' };
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find({ published: true }).sort({ publishedAt: -1 }).select('-content').lean();
  const serialized = JSON.parse(JSON.stringify(posts));
  return <BlogClientPage posts={serialized} />;
}
