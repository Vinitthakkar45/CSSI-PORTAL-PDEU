import { db } from '@/drizzle/db';
import { student, faculty, evaluatorStudent } from '@/drizzle/schema';
import { asc } from 'drizzle-orm';

type StudentType = {
  id: number;
  department: string | null;
  rollNumber: string | null;
};

type FacultyType = {
  id: number;
  department: string | null;
};

type Assignment = {
  evaluatorId: number;
  studentId: number;
};

export async function evaluatorAssignment() {
  try {
    const students = await db
      .select({
        id: student.id,
        department: student.department,
        rollNumber: student.rollNumber,
      })
      .from(student)
      .orderBy(asc(student.department), asc(student.rollNumber));

    const faculties = await db
      .select({
        id: faculty.id,
        department: faculty.department,
      })
      .from(faculty)
      .orderBy(asc(faculty.department));

    // Group by department
    const studentGroups: Record<string, StudentType[]> = {};
    for (const s of students) {
      const dept = s.department!;
      if (!studentGroups[dept]) studentGroups[dept] = [];
      studentGroups[dept].push(s);
    }

    const facultyGroups: Record<string, FacultyType[]> = {};
    for (const f of faculties) {
      const dept = f.department!;
      if (!facultyGroups[dept]) facultyGroups[dept] = [];
      facultyGroups[dept].push(f);
    }

    // Filter departments having both students & faculties
    const departments = Object.keys(studentGroups).filter(
      (dept) => facultyGroups[dept] && facultyGroups[dept].length > 0
    );

    // Sort departments by student count (descending)
    departments.sort((a, b) => studentGroups[b].length - studentGroups[a].length);

    const assignments: Assignment[] = [];
    await db.delete(evaluatorStudent).execute();

    const limit = departments.length % 2 === 0 ? departments.length : departments.length - 3;

    // Assign department pairs: A ↔ B
    for (let i = 0; i < limit; i += 2) {
      const deptA = departments[i];
      const deptB = departments[i + 1];

      assignStudentsToFaculties(studentGroups[deptA], facultyGroups[deptB], assignments);
      assignStudentsToFaculties(studentGroups[deptB], facultyGroups[deptA], assignments);
    }

    // Handle last 3 departments in triangle if odd
    if (departments.length % 2 === 1) {
      const [d1, d2, d3] = departments.slice(-3);

      assignStudentsToFaculties(studentGroups[d1], facultyGroups[d2], assignments);
      assignStudentsToFaculties(studentGroups[d2], facultyGroups[d3], assignments);
      assignStudentsToFaculties(studentGroups[d3], facultyGroups[d1], assignments);
    }

    await db.insert(evaluatorStudent).values(assignments).execute();

    return {
      success: true,
      assignedCount: assignments.length,
    };
  } catch (error) {
    console.error('Error during evaluator assignment:', error);
    throw error;
  }
}

function assignStudentsToFaculties(
  deptStudents: StudentType[],
  deptFaculties: FacultyType[],
  assignments: Assignment[]
) {
  if (!deptStudents || !deptFaculties || deptFaculties.length === 0) return;

  const minStudentsPerFaculty = Math.floor(deptStudents.length / deptFaculties.length);
  const extraStudents = deptStudents.length % deptFaculties.length;

  let studentIndex = 0;

  for (let i = 0; i < deptFaculties.length; i++) {
    const studentsForThisFaculty = minStudentsPerFaculty + (i < extraStudents ? 1 : 0);

    for (let j = 0; j < studentsForThisFaculty; j++) {
      if (studentIndex < deptStudents.length) {
        assignments.push({
          evaluatorId: deptFaculties[i].id,
          studentId: deptStudents[studentIndex].id,
        });
        studentIndex++;
      }
    }
  }
}
