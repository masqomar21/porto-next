import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const skills = await Skill.find({}).sort({ categoryOrder: 1, order: 1 });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  const skill = await Skill.create(body);
  return NextResponse.json(skill, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  
  if (body && Array.isArray(body.orders)) {
    const bulkOps = body.orders.map((item: { id: string; order?: number; categoryOrder?: number }) => {
      const updateDoc: any = {};
      if (item.order !== undefined) updateDoc.order = item.order;
      if (item.categoryOrder !== undefined) updateDoc.categoryOrder = item.categoryOrder;
      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: updateDoc },
        },
      };
    });
    await Skill.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  if (!category) {
    return NextResponse.json({ error: 'Category query parameter is required' }, { status: 400 });
  }
  await Skill.deleteMany({ category });
  return NextResponse.json({ success: true });
}
