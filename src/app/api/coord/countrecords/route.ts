import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student, faculty, mentorStudent, evaluatorStudent, user } from '@/drizzle/schema';
import { count, eq } from 'drizzle-orm';
import { getCurrentAcademicYear } from '@/lib/academicYear';

export async function GET() {
  const academicYear = getCurrentAcademicYear();

  const [studentResult, facultyResult, mentorResult, evaluatorResult] = await Promise.all([
    db.select({ total: count() }).from(student)
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(user.academicYear, academicYear)),
    db.select({ total: count() }).from(faculty)
      .innerJoin(user, eq(faculty.userId, user.id))
      .where(eq(user.academicYear, academicYear)),
    db.select({ total: count() }).from(mentorStudent)
      .innerJoin(student, eq(mentorStudent.studentId, student.id))
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(user.academicYear, academicYear)),
    db.select({ total: count() }).from(evaluatorStudent)
      .innerJoin(student, eq(evaluatorStudent.studentId, student.id))
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(user.academicYear, academicYear)),
  ]);

  return NextResponse.json({
    students: studentResult[0]?.total ?? 0,
    faculty: facultyResult[0]?.total ?? 0,
    mentors: mentorResult[0]?.total ?? 0,
    evaluators: evaluatorResult[0]?.total ?? 0,
  });
}
