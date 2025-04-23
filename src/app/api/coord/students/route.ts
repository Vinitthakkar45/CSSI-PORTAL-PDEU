import { db } from '@/drizzle/db';
import { faculty, student, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const uid = Number(id);
    const department = await db.select({ department: faculty.department }).from(faculty).where(eq(faculty.userId, uid));
    const userdep = department[0]?.department;

    if (!userdep) {
      return NextResponse.json({ message: 'Department not found' }, { status: 404 });
    }

    const studentList = await db
      .select({
        student: student,
        user: {
          email: user.email,
          role: user.role,
        },
      })
      .from(student)
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(student.department, userdep));

    return NextResponse.json(studentList, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
