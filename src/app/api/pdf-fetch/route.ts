import { NextResponse } from 'next/server';
import { mediaUrl } from '@/lib/storage';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const documentUrls = {
      offerLetter: mediaUrl(`offerletter/${userId}.pdf`),
      poster: mediaUrl(`poster/${userId}.pdf`),
      certificate: mediaUrl(`certificate/${userId}.pdf`),
      report: mediaUrl(`report/${userId}.pdf`),
    };

    return NextResponse.json({ urls: documentUrls }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
