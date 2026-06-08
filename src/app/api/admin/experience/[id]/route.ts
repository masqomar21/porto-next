import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const experience = await Experience.findByIdAndUpdate(id, body, { new: true });
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(experience);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  const experience = await Experience.findByIdAndDelete(id);
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
