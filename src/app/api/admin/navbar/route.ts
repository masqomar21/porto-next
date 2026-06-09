import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Navbar from '@/models/Navbar';

export const dynamic = 'force-dynamic';

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  await connectDB();
  let navbar = await Navbar.findOne({});
  if (!navbar) {
    navbar = await Navbar.create({});
  }
  return NextResponse.json(navbar);
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  await connectDB();
  const body = await req.json();
  const navbar = await Navbar.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(navbar);
}
