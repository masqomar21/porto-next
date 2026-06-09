import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Hero from '@/models/Hero';
import { deleteFileFromS3 } from '@/lib/s3';

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
  let hero = await Hero.findOne({});
  if (!hero) {
    hero = await Hero.create({});
  }
  return NextResponse.json(hero);
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  await connectDB();
  const body = await req.json();

  const oldHero = await Hero.findOne({});
  if (oldHero) {
    if (oldHero.imageUrl && oldHero.imageUrl !== body.imageUrl) {
      await deleteFileFromS3(oldHero.imageUrl);
    }
  }

  const hero = await Hero.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(hero);
}
