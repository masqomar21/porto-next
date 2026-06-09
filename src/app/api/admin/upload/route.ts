import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: NextRequest) {
  // Authentication check
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Size limit verification (10MB)
    const limitMb = 10;
    if (file.size > limitMb * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds limit (10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload params
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct the public URL of the uploaded file
    let fileUrl = '';
    const publicUrlEnv = process.env.AWS_S3_PUBLIC_URL;
    const region = process.env.AWS_REGION || 'us-east-1';

    if (publicUrlEnv) {
      const base = publicUrlEnv.endsWith('/') ? publicUrlEnv.slice(0, -1) : publicUrlEnv;
      fileUrl = `${base}/${fileKey}`;
    } else {
      const endpoint = process.env.AWS_S3_ENDPOINT;
      const forcePathStyle = process.env.AWS_S3_FORCE_PATH_STYLE === 'true';
      if (endpoint) {
        const cleanedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        if (forcePathStyle) {
          fileUrl = `${cleanedEndpoint}/${BUCKET_NAME}/${fileKey}`;
        } else {
          const protocol = cleanedEndpoint.startsWith('https://') ? 'https://' : 'http://';
          const domain = cleanedEndpoint.replace(/^https?:\/\//, '');
          fileUrl = `${protocol}${BUCKET_NAME}.${domain}/${fileKey}`;
        }
      } else {
        fileUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileKey}`;
      }
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  }
}
