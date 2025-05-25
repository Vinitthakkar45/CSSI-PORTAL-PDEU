import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { announcement } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const announcements = await db
      .select()
      .from(announcement)
      .where(eq(announcement.year, new Date().getFullYear().toString()))
      .orderBy(desc(announcement.id));
    return NextResponse.json({ announcements });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
