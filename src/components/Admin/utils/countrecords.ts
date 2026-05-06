import { db } from '@/drizzle/db';
import { student, faculty, mentorStudent, evaluatorStudent, user } from '@/drizzle/schema';
import { count, eq } from 'drizzle-orm';
import { getCurrentAcademicYear } from '@/lib/academicYear';

export async function countStudents() {
  const academicYear = getCurrentAcademicYear();
  const result = await db.select({ total: count() }).from(student)
    .innerJoin(user, eq(student.userId, user.id))
    .where(eq(user.academicYear, academicYear));
  return result[0]?.total ?? 0;
}

export async function countFaculty() {
  const academicYear = getCurrentAcademicYear();
  const result = await db.select({ total: count() }).from(faculty)
    .innerJoin(user, eq(faculty.userId, user.id))
    .where(eq(user.academicYear, academicYear));
  return result[0]?.total ?? 0;
}

export async function countMentors() {
  const academicYear = getCurrentAcademicYear();
  const result = await db.select({ total: count() }).from(mentorStudent)
    .innerJoin(student, eq(mentorStudent.studentId, student.id))
    .innerJoin(user, eq(student.userId, user.id))
    .where(eq(user.academicYear, academicYear));
  return result[0]?.total ?? 0;
}

export async function countEvaluators() {
  const academicYear = getCurrentAcademicYear();
  const result = await db.select({ total: count() }).from(evaluatorStudent)
    .innerJoin(student, eq(evaluatorStudent.studentId, student.id))
    .innerJoin(user, eq(student.userId, user.id))
    .where(eq(user.academicYear, academicYear));
  return result[0]?.total ?? 0;
}
