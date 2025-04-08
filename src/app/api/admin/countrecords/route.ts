// app/api/counts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student, faculty, mentorStudent, evaluatorStudent } from '@/drizzle/schema';
import { count } from 'drizzle-orm';

export async function GET() {
  const [studentResult, facultyResult, mentorResult, evaluatorResult] = await Promise.all([
    db.select({ total: count() }).from(student),
    db.select({ total: count() }).from(faculty),
    db.select({ total: count() }).from(mentorStudent),
    db.select({ total: count() }).from(evaluatorStudent),
  ]);

  const data = {
    students: studentResult[0]?.total ?? 0,
    faculty: facultyResult[0]?.total ?? 0,
    mentors: mentorResult[0]?.total ?? 0,
    evaluators: evaluatorResult[0]?.total ?? 0,
  };

  return NextResponse.json(data);
}
