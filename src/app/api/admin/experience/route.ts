import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Experience from '@/models/Experience';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const experiences = await Experience.find({}).sort({ order: 1 });
  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  const experience = await Experience.create(body);
  return NextResponse.json(experience, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  
  if (body && Array.isArray(body.orders)) {
    const bulkOps = body.orders.map((item: { id: string; order: number }) => {
      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: item.order } },
        },
      };
    });
    await Experience.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}
