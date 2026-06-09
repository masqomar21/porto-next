import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import About from '@/models/About';
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
  let about = await About.findOne({});
  if (!about) about = await About.create({});
  return NextResponse.json(about);
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAuth();
  if (authErr) return authErr;
  await connectDB();
  const body = await req.json();

  const oldAbout = await About.findOne({});
  if (oldAbout) {
    if (oldAbout.photoUrl && oldAbout.photoUrl !== body.photoUrl) {
      await deleteFileFromS3(oldAbout.photoUrl);
    }
    if (oldAbout.resumeUrl && oldAbout.resumeUrl !== body.resumeUrl) {
      await deleteFileFromS3(oldAbout.resumeUrl);
    }
  }

  const about = await About.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(about);
}
