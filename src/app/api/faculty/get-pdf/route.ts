import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  try {
    const publicUrl = cloudinary.url(filePath, {
      resource_type: 'auto',
      type: 'upload',
      flags: 'attachment',
    });

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Cloudinary public URL error:', error);
    return NextResponse.json({ error: 'Failed to generate public URL' }, { status: 500 });
  }
}
