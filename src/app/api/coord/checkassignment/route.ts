import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { mentorStudent, evaluatorStudent, faculty, user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getCurrentAcademicYear } from '@/lib/academicYear';

export async function GET() {
  try {
    const [mentorList, evaluatorList, facultyList] = await Promise.all([
      db.select().from(mentorStudent),
      db.select().from(evaluatorStudent),
      db
        .select({ id: faculty.id })
        .from(faculty)
        .innerJoin(user, eq(faculty.userId, user.id))
        .where(eq(user.academicYear, getCurrentAcademicYear())),
    ]);

    const mentorIds = new Set(mentorList.map((m) => m.mentorId));
    const evaluatorIds = new Set(evaluatorList.map((e) => e.evaluatorId));

    const assignmentList = facultyList.map((f) => ({
      facultyId: f.id,
      assignedMentor: mentorIds.has(f.id) ? 1 : 0,
      evaluatorAssigned: evaluatorIds.has(f.id) ? 1 : 0,
    }));

    return NextResponse.json(assignmentList);
  } catch (error) {
    console.error('Error fetching assignment data:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment data' }, { status: 500 });
  }
}
