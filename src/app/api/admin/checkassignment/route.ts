import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/drizzle/db';
import { mentorStudent, evaluatorStudent, faculty } from '@/drizzle/schema';

export async function GET() {
  try {
    const [mentorList, evaluatorList, facultyList] = await Promise.all([
      db.select().from(mentorStudent),
      db.select().from(evaluatorStudent),
      db.select().from(faculty),
    ]);

    const mentorIds = new Set(mentorList.map((mentor) => mentor.mentorId));
    const evaluatorIds = new Set(evaluatorList.map((evaluator) => evaluator.evaluatorId));

    const assignmentList = facultyList.map((faculty) => ({
      facultyId: faculty.id,
      assignedMentor: mentorIds.has(faculty.id) ? 1 : 0,
      evaluatorAssigned: evaluatorIds.has(faculty.id) ? 1 : 0,
    }));

    return NextResponse.json(assignmentList);
  } catch (error) {
    console.error('Error fetching assignment data:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment data' }, { status: 500 });
  }
}
