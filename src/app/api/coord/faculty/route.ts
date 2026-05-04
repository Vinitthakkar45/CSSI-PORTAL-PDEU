import { db } from '@/drizzle/db';
import { faculty, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getCurrentAcademicYear } from '@/lib/academicYear';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ message: 'Invalid or missing ID' }, { status: 400 });
    }

    const academicYear = getCurrentAcademicYear();

    // The coordinator's user.id is already year-specific (from their session).
    // Their faculty profile is looked up by userId; filtering by academicYear via the user join
    // ensures we get the correct year's profile.
    const department = await db
      .select({ department: faculty.department })
      .from(faculty)
      .innerJoin(user, eq(faculty.userId, user.id))
      .where(and(eq(faculty.userId, id), eq(user.academicYear, academicYear)));
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
      .where(and(eq(faculty.department, userdep), eq(user.academicYear, academicYear)));

    return NextResponse.json(facultyList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
