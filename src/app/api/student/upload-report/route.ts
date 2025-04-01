import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { student } from '@/drizzle/schema';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
  public_id: string;
  [key: string]: string | number | boolean | null | undefined;
  bytes: number;
}

export async function POST(req: NextRequest) {
  console.log('Upload Report');

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('report') as File;
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File Not Found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'Report',
          format: 'pdf',
          pages: true,
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResponse);
        }
      );
      uploadStream.end(buffer);
    });

    const userIdNum = parseInt(userId, 10);

    await db.update(student).set({ report: result.public_id }).where(eq(student.userId, userIdNum));

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log('Upload Report failed  ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
