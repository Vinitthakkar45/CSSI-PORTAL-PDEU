import { db } from '@/drizzle/db';
import { announcement } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (data.role === 'admin') {
      const description = data.description;

      const addedAnnouncement = await db
        .insert(announcement)
        .values({
          description: description,
          year: new Date().getFullYear().toString(),
        })
        .returning({ id: announcement.id });

      console.log(addedAnnouncement);
      return NextResponse.json({ message: 'Annoucement added Sucessfully' }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
