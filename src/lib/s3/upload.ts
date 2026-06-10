import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_REGION || "us-east-1";
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3Client;
}

function getBucket(): string {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME is not configured");
  }
  return bucket;
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  slug?: string,
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const prefix = slug ? `projects/${slug}` : "uploads";
  const key = `${prefix}/${uuidv4()}-${filename}`;
  const bucket = getBucket();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: 3600,
  });

  return {
    uploadUrl,
    key,
    publicUrl: getS3PublicUrl(key),
  };
}

export async function deleteS3Image(key: string): Promise<void> {
  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    }),
  );
}

export function getS3PublicUrl(key: string): string {
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.AWS_S3_BUCKET_NAME || "";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function extractS3Key(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.pathname.slice(1);
  } catch {
    return null;
  }
}
