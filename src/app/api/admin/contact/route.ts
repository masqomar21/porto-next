import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  let contact = await Contact.findOne({});
  if (!contact) contact = await Contact.create({});
  return NextResponse.json(contact);
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();
  const contact = await Contact.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(contact);
}
