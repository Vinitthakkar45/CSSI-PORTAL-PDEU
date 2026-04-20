import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: 'us-east-1', // MinIO ignores this but the SDK requires a value
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

export const BUCKET = process.env.MINIO_BUCKET!;

/**
 * Returns the public URL for a media object.
 * Served through nginx at /media/<bucket>/<key>.
 */
export function mediaUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL!.replace(/\/$/, '');
  return `${base}/${BUCKET}/${key}`;
}

/**
 * Uploads a buffer to MinIO and returns the object key.
 */
export async function uploadMedia(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return key;
}

/**
 * Deletes an object from MinIO. Silently ignores missing keys (idempotent).
 */
export async function deleteMedia(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Returns a presigned download URL valid for 1 hour (for private/attachment use).
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ResponseContentDisposition: 'attachment',
    }),
    { expiresIn: 3600 }
  );
}
