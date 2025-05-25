import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, mentorStudent, student, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

// Create aliases for faculty table to distinguish mentor and evaluator
const mentorFaculty = alias(faculty, 'mentorFaculty');
const evaluatorFaculty = alias(faculty, 'evaluatorFaculty');

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Get the department of the requesting faculty member
    const department = await db.select({ department: faculty.department }).from(faculty).where(eq(faculty.userId, id));

    const userdep = department[0]?.department;

    if (!userdep) {
      return NextResponse.json({ message: 'Department not found' }, { status: 404 });
    }

    // Single optimized query to get all students with their mentor and evaluator details
    const studentList = await db
      .select({
        student: student,
        user: {
          email: user.email,
          role: user.role,
        },
        mentor: mentorFaculty,
        evaluator: evaluatorFaculty,
      })
      .from(student)
      .innerJoin(user, eq(student.userId, user.id))
      .leftJoin(mentorStudent, eq(mentorStudent.studentId, student.id))
      .leftJoin(evaluatorStudent, eq(evaluatorStudent.studentId, student.id))
      .leftJoin(mentorFaculty, eq(mentorFaculty.id, mentorStudent.mentorId))
      .leftJoin(evaluatorFaculty, eq(evaluatorFaculty.id, evaluatorStudent.evaluatorId))
      .where(eq(student.department, userdep));

    return NextResponse.json(studentList, { status: 200 });
  } catch (error) {
    console.error('Error fetching department students:', error);

    if (
      error instanceof Error &&
      (error.message.includes('Connect Timeout') || error.message.includes('fetch failed'))
    ) {
      return NextResponse.json({ message: 'Database connection timeout. Please try again later.' }, { status: 503 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
