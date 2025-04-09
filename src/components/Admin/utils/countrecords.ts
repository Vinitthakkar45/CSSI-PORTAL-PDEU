import { db } from '@/drizzle/db';
import { student, faculty, mentorStudent, evaluatorStudent } from '@/drizzle/schema';
import { count } from 'drizzle-orm';

export async function countStudents() {
  const result = await db.select({ total: count() }).from(student);
  return result[0]?.total ?? 0;
}

export async function countFaculty() {
  const result = await db.select({ total: count() }).from(faculty);
  return result[0]?.total ?? 0;
}

export async function countMentors() {
  const result = await db.select({ total: count() }).from(mentorStudent);
  return result[0]?.total ?? 0;
}

export async function countEvaluators() {
  const result = await db.select({ total: count() }).from(evaluatorStudent);
  return result[0]?.total ?? 0;
}
