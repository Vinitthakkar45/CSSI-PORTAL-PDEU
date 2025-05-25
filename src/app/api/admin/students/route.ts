import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, mentorStudent, student, user } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const mentorFaculty = alias(faculty, 'mentorFaculty');
const evaluatorFaculty = alias(faculty, 'evaluatorFaculty');

export async function GET() {
  try {
    const results = await db
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
      .leftJoin(evaluatorFaculty, eq(evaluatorFaculty.id, evaluatorStudent.evaluatorId));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching students:', error);

    if (
      error instanceof Error &&
      (error.message.includes('Connect Timeout') || error.message.includes('fetch failed'))
    ) {
      return NextResponse.json({ error: 'Database connection timeout. Please try again later.' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
