import { db } from '@/drizzle/db';
import { faculty, user } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const facultyList = await db
      .select({
        faculty: faculty,
        user: {
          email: user.email,
          role: user.role,
        },
      })
      .from(faculty)
      .innerJoin(user, eq(faculty.userId, user.id))
      .where(eq(faculty.userId, user.id));
    console.log(facultyList);
    return NextResponse.json(facultyList);
  } catch (error) {
    console.error('Error fetching student:', error);

    return NextResponse.json({ error: 'Failed to fetch faculty data' }, { status: 500 });
  }
}
