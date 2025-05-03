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
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folderName = formData.get('folderName') as string;
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File Not Found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine if this is a PDF document or an image based on folder name
    const isPdfDocument = ['offerletter', 'report', 'certificate', 'poster'].includes(folderName.toLowerCase());

    // Configure upload options based on file type
    const uploadOptions = {
      resource_type: isPdfDocument ? ('raw' as const) : ('image' as const),
      folder: folderName,
      format: isPdfDocument ? 'pdf' : undefined,
      pages: isPdfDocument ? true : undefined,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      public_id: userId,
    };

    const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResponse);
      });
      uploadStream.end(buffer);
    });

    let columnName = '';
    switch (folderName.toLowerCase()) {
      case 'offerletter':
        columnName = 'offerLetter';
        break;
      case 'report':
        columnName = 'report';
        break;
      case 'certificate':
        columnName = 'certificate';
        break;
      case 'poster':
        columnName = 'poster';
        break;
      case 'weekonephoto':
        columnName = 'week_one_photo';
        break;
      case 'weektwophoto':
        columnName = 'week_two_photo';
        break;
      case 'profileimage':
        columnName = 'profile_image';
        break;
      default:
        throw new Error('Invalid folder name');
    }

    await db
      .update(student)
      .set({ [columnName]: result.public_id })
      .where(eq(student.userId, userId));

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
