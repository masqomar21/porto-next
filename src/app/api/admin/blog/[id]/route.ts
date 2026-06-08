import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const post = await Post.findByIdAndUpdate(id, body, { new: true });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
