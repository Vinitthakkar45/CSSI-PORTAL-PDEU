import { NextRequest, NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
  }

  try {
    const publicUrl = await getPresignedDownloadUrl(filePath);
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Storage URL error:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
