import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const projects = await Project.find({}).sort({ order: 1 }).select('-content');
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  const project = await Project.create(body);
  return NextResponse.json(project, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  
  if (body && Array.isArray(body.orders)) {
    const bulkOps = body.orders.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));
    await Project.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}
