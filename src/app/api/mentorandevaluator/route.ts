import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, mentorStudent, student } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { id, role } = await req.json();
    if (role == 'student') {
      const user = await db.select().from(student).where(eq(student.userId, id));
      const newID = user[0].id;
      const [mentorResult, evaluatorResult] = await Promise.all([
        db.select().from(mentorStudent).where(eq(mentorStudent.studentId, newID)).limit(1),
        db.select().from(evaluatorStudent).where(eq(evaluatorStudent.studentId, newID)).limit(1),
      ]);

      const mentorId = mentorResult[0]?.mentorId;
      const evalId = evaluatorResult[0]?.evaluatorId;

      const [mentorRes, evalRes] = await Promise.all([
        db.select().from(faculty).where(eq(faculty.id, mentorId)).limit(1),
        db.select().from(faculty).where(eq(faculty.id, evalId)).limit(1),
      ]);
      const mentorname = mentorRes[0];
      const evalname = evalRes[0];
      return NextResponse.json({ mentorname, evalname }, { status: 200 });
    } else {
      const [mentorResult, evaluatorResult] = await Promise.all([
        db.select().from(mentorStudent).where(eq(mentorStudent.studentId, id)).limit(1),
        db.select().from(evaluatorStudent).where(eq(evaluatorStudent.studentId, id)).limit(1),
      ]);

      const mentorId = mentorResult[0]?.mentorId;
      const evalId = evaluatorResult[0]?.evaluatorId;

      const [mentorRes, evalRes] = await Promise.all([
        db.select().from(faculty).where(eq(faculty.id, mentorId)).limit(1),
        db.select().from(faculty).where(eq(faculty.id, evalId)).limit(1),
      ]);
      const mentorname = mentorRes[0];
      const evalname = evalRes[0];
      return NextResponse.json({ mentorname, evalname }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
