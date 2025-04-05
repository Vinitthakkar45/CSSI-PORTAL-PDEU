import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { student } from '@/drizzle/schema';

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const data = await db
      .select({
        report: student.report,
        certificate: student.certificate,
        poster: student.poster,
      })
      .from(student)
      .where(eq(student.userId, Number(userId)));

    const { report, certificate, poster } = data[0];

    return NextResponse.json(
      {
        data: {
          reportUploaded: report !== null,
          certificateUploaded: certificate !== null,
          posterUploaded: poster !== null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
