import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const documentUrls = {
      offerLetter: `https://res.cloudinary.com/${cloudname}/raw/upload/OfferLetter/${userId}.pdf`,
      poster: `https://res.cloudinary.com/${cloudname}/raw/upload/Poster/${userId}.pdf`,
      certificate: `https://res.cloudinary.com/${cloudname}/raw/upload/Certificate/${userId}.pdf`,
      report: `https://res.cloudinary.com/${cloudname}/raw/upload/Report/${userId}.pdf`,
    };
    return NextResponse.json({ urls: documentUrls }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
