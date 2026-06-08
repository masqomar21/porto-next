import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

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
  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { id } = await params;
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
