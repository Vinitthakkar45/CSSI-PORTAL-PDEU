import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, mentorStudent, student, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and, inArray } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { id, role } = await req.json();

    if (role === 'student') {
      // Get student details including department
      const studentData = await db.select().from(student).where(eq(student.userId, id)).limit(1);
      if (!studentData.length) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const studentId = studentData[0].id;
      const studentDepartment = studentData[0].department;

      // Get mentor and evaluator IDs
      const [mentorResult, evaluatorResult] = await Promise.all([
        db.select().from(mentorStudent).where(eq(mentorStudent.studentId, studentId)).limit(1),
        db.select().from(evaluatorStudent).where(eq(evaluatorStudent.studentId, studentId)).limit(1),
      ]);

      const mentorId = mentorResult[0]?.mentorId;
      const evalId = evaluatorResult[0]?.evaluatorId;

      // Get coordinator (faculty with coordinator role in the same department)
      const coordinatorUsers = await db.select({ userId: user.id }).from(user).where(eq(user.role, 'coordinator'));

      const coordinatorUserIds = coordinatorUsers.map((c) => c.userId);

      const coordinators = await db
        .select()
        .from(faculty)
        .where(
          and(
            studentDepartment ? eq(faculty.department, studentDepartment) : undefined,
            inArray(faculty.userId, coordinatorUserIds)
          )
        );

      // Get full details of mentor and evaluator
      const [mentorDetails, evaluatorDetails] = await Promise.all([
        mentorId ? db.select().from(faculty).where(eq(faculty.id, mentorId)) : Promise.resolve([]),
        evalId ? db.select().from(faculty).where(eq(faculty.id, evalId)) : Promise.resolve([]),
      ]);

      // Get emails for faculty members
      const facultyUserIds = [
        ...coordinators.map((c) => c.userId),
        ...(mentorDetails.length ? [mentorDetails[0].userId] : []),
        ...(evaluatorDetails.length ? [evaluatorDetails[0].userId] : []),
      ];

      const facultyEmails = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(inArray(user.id, facultyUserIds));

      // Map emails to faculty objects
      const emailMap = facultyEmails.reduce(
        (acc, { id, email }) => {
          acc[id] = email;
          return acc;
        },
        {} as Record<string, string>
      );

      // Add emails to faculty objects
      const coordinatorsWithEmail = coordinators.map((c) => ({
        ...c,
        email: emailMap[c.userId] || null,
      }));

      const mentorWithEmail = mentorDetails.length
        ? {
            ...mentorDetails[0],
            email: emailMap[mentorDetails[0].userId] || null,
          }
        : null;

      const evaluatorWithEmail = evaluatorDetails.length
        ? {
            ...evaluatorDetails[0],
            email: emailMap[evaluatorDetails[0].userId] || null,
          }
        : null;

      return NextResponse.json(
        {
          mentor: mentorWithEmail,
          evaluator: evaluatorWithEmail,
          coordinators: coordinatorsWithEmail,
        },
        { status: 200 }
      );
    } else {
      // 🔧 FIX: Convert userId (UUID) to studentId (INT) before querying
      const studentData = await db.select().from(student).where(eq(student.userId, id)).limit(1);
      if (!studentData.length) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const studentId = studentData[0].id;

      const [mentorResult, evaluatorResult] = await Promise.all([
        db.select().from(mentorStudent).where(eq(mentorStudent.studentId, studentId)).limit(1),
        db.select().from(evaluatorStudent).where(eq(evaluatorStudent.studentId, studentId)).limit(1),
      ]);

      const mentorId = mentorResult[0]?.mentorId;
      const evalId = evaluatorResult[0]?.evaluatorId;

      const [mentorRes, evalRes] = await Promise.all([
        mentorId ? db.select().from(faculty).where(eq(faculty.id, mentorId)).limit(1) : Promise.resolve([]),
        evalId ? db.select().from(faculty).where(eq(faculty.id, evalId)).limit(1) : Promise.resolve([]),
      ]);

      const mentorname = mentorRes[0] || null;
      const evalname = evalRes[0] || null;

      return NextResponse.json({ mentorname, evalname }, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
