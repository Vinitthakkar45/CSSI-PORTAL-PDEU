import { db } from '@/drizzle/db';
import { faculty, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ message: 'Invalid or missing ID' }, { status: 400 });
    }

    const department = await db.select({ department: faculty.department }).from(faculty).where(eq(faculty.userId, id));
    const userdep = department[0]?.department;

    if (!userdep) {
      return NextResponse.json({ message: 'Department not found' }, { status: 404 });
    }

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
      .where(eq(faculty.department, userdep));

    return NextResponse.json(facultyList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
