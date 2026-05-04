import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, student, user } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { getCurrentAcademicYear } from '@/lib/academicYear';

const facultyUser = alias(user, 'facultyUser');

export async function GET() {
  try {
    const academicYear = getCurrentAcademicYear();

    const data = await db
      .select({
        facultyId: faculty.id,
        facultyName: faculty.name,
        facultyDepartment: faculty.department,
        studentRoll: student.rollNumber,
        studentDepartment: student.department,
      })
      .from(evaluatorStudent)
      .innerJoin(faculty, eq(evaluatorStudent.evaluatorId, faculty.id))
      .innerJoin(facultyUser, and(eq(faculty.userId, facultyUser.id), eq(facultyUser.academicYear, academicYear)))
      .innerJoin(student, eq(evaluatorStudent.studentId, student.id))
      .innerJoin(user, and(eq(student.userId, user.id), eq(user.academicYear, academicYear)));

    const grouped: Record<
      string,
      {
        name: string;
        department: string;
        students: { rollNumber: string | null; department: string | null }[];
      }
    > = {};

    for (const row of data) {
      const key = row.facultyId.toString();
      if (!grouped[key]) {
        grouped[key] = {
          name: row.facultyName ?? '',
          department: row.facultyDepartment ?? '',
          students: [],
        };
      }

      grouped[key].students.push({
        rollNumber: row.studentRoll,
        department: row.studentDepartment,
      });
    }

    const sorted = Object.values(grouped).sort((a, b) => {
      const rollA = a.students.length > 0 ? (a.students[0]?.rollNumber ?? '') : '';
      const rollB = b.students.length > 0 ? (b.students[0]?.rollNumber ?? '') : '';
      return rollA.localeCompare(rollB);
    });

    return new Response(JSON.stringify(sorted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch evaluator data:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
