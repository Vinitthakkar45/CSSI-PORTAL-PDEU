import { db } from '@/drizzle/db';
import { student, faculty, mentorStudent } from '@/drizzle/schema';
import { eq, isNull, asc } from 'drizzle-orm';

export async function mentorAssignment() {
  try {
    const students = await db
      .select({
        id: student.id,
        department: student.department,
        rollNumber: student.rollNumber,
      })
      .from(student)
      .leftJoin(mentorStudent, eq(student.id, mentorStudent.studentId))
      .where(isNull(mentorStudent.id))
      .orderBy(asc(student.department), asc(student.rollNumber));

    if (students.length === 0) {
      return {
        allAssigned: true,
        message: 'All students already have mentors assigned',
      };
    }

    const faculties = await db
      .select({
        id: faculty.id,
        department: faculty.department,
      })
      .from(faculty);

    const studentsByDept = new Map<string, { id: number }[]>();
    const facultiesByDept = new Map<string, { id: number }[]>();

    for (const s of students) {
      if (!s.department) continue;
      if (!studentsByDept.has(s.department)) {
        studentsByDept.set(s.department, []);
      }
      studentsByDept.get(s.department)!.push({ id: s.id });
    }

    for (const f of faculties) {
      if (!f.department) continue;
      if (!facultiesByDept.has(f.department)) {
        facultiesByDept.set(f.department, []);
      }
      facultiesByDept.get(f.department)!.push({ id: f.id });
    }

    const assignments: { studentId: number; mentorId: number }[] = [];

    for (const [dept, deptStudents] of studentsByDept.entries()) {
      const deptFaculties = facultiesByDept.get(dept);

      if (!deptFaculties || deptFaculties.length === 0) {
        console.warn(`No faculty in department ${dept}, skipping`);
        continue;
      }

      const minStudentsPerFaculty = Math.floor(deptStudents.length / deptFaculties.length);
      const extraStudents = deptStudents.length % deptFaculties.length;

      let studentIndex = 0;
      for (let i = 0; i < deptFaculties.length; i++) {
        // Calculate how many students this faculty should get
        const studentsForThisFaculty = minStudentsPerFaculty + (i < extraStudents ? 1 : 0);

        for (let j = 0; j < studentsForThisFaculty; j++) {
          if (studentIndex < deptStudents.length) {
            assignments.push({
              studentId: deptStudents[studentIndex].id,
              mentorId: deptFaculties[i].id,
            });
            studentIndex++;
          }
        }
      }
    }

    if (assignments.length > 0) {
      await db.insert(mentorStudent).values(assignments);
    }

    return {
      success: true,
      message: `Assigned ${assignments.length} students evenly across departments.`,
      assignedCount: assignments.length,
    };
  } catch (err) {
    console.error('Mentor assignment failed:', err);
    throw err;
  }
}
