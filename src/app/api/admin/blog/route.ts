import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const posts = await Post.find({}).sort({ createdAt: -1 }).select('-content');
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  const post = await Post.create(body);
  return NextResponse.json(post, { status: 201 });
}
