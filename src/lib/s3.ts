import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const endpoint = process.env.AWS_S3_ENDPOINT;
const forcePathStyle = process.env.AWS_S3_FORCE_PATH_STYLE === 'true';

if (!accessKeyId || !secretAccessKey) {
  console.warn('AWS S3 credentials are not configured in environment variables.');
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId || 'placeholder',
    secretAccessKey: secretAccessKey || 'placeholder',
  },
  ...(endpoint ? { endpoint } : {}),
  forcePathStyle,
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

export async function deleteFileFromS3(fileUrl: string) {
  if (!fileUrl) return;
  try {
    // If it's a local public file or placeholder, do not delete from S3
    if (fileUrl.startsWith('/') || fileUrl.includes('localhost') || fileUrl.includes('127.0.0.1')) {
      return;
    }

    let fileKey = '';
    try {
      const parsedUrl = new URL(fileUrl);
      let pathname = decodeURIComponent(parsedUrl.pathname);
      if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
      }
      // If path style S3 URL contains bucket name as first segment, strip it
      if (BUCKET_NAME && pathname.startsWith(`${BUCKET_NAME}/`)) {
        pathname = pathname.substring(BUCKET_NAME.length + 1);
      }
      fileKey = pathname;
    } catch {
      // Fallback for non-standard URLs
      const urlParts = fileUrl.split('/');
      fileKey = urlParts.slice(3).join('/');
    }

    if (!fileKey) return;

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log(`Successfully deleted file from S3: ${fileKey}`);
  } catch (error) {
    console.error(`Failed to delete file from S3 (url: ${fileUrl}):`, error);
  }
}

