import { db } from '@/drizzle/db';
import { evaluatorStudent, faculty, student } from '@/drizzle/schema'; // Adjust import path
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
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
      .innerJoin(student, eq(evaluatorStudent.studentId, student.id));

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
      if (a.department !== b.department) {
        return a.department.localeCompare(b.department);
      }
      return a.name.localeCompare(b.name);
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
