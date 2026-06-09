import { S3Client } from '@aws-sdk/client-s3';

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
