import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { faculty, user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { id, name, department, role } = await req.json();

    await db.update(user).set({ role }).where(eq(user.id, id));

    await db.update(faculty).set({ name, department }).where(eq(faculty.userId, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPDATE_FACULTY_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
