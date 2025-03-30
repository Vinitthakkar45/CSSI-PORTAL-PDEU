import { db } from '@/drizzle/db';
import { student, user } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Use a more explicit query method
    const studentList = await db
      .select({
        student: student,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
      .from(student)
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(student.userId, user.id));
    return NextResponse.json(studentList);
  } catch (error) {
    console.error('Error fetching student:', error);

    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
