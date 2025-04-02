import { countStudents, countFaculty } from './countrecords';
import { db } from '@/drizzle/db';
import { faculty, student, mentorStudent } from '@/drizzle/schema';

export async function mentorAssignment() {
  const totalStudents = await countStudents();
  const totalFaculty = await countFaculty();

  // Fetch students grouped by department
  const studentsByDept = await db
    .select({ id: student.id, department: student.department })
    .from(student)
    .orderBy(student.department);

  // Fetch faculties grouped by department
  const facultiesByDept = await db
    .select({ id: faculty.id, department: faculty.department })
    .from(faculty)
    .orderBy(faculty.department);

  // Organizing students and faculties by department
  const studentMap = new Map();
  studentsByDept.forEach(({ id, department }) => {
    if (!studentMap.has(department)) studentMap.set(department, []);
    studentMap.get(department).push(id);
  });

  const facultyMap = new Map();
  facultiesByDept.forEach(({ id, department }) => {
    if (!facultyMap.has(department)) facultyMap.set(department, []);
    facultyMap.get(department).push(id);
  });

  // Assign students to faculty within the same department
  for (const [dept, students] of studentMap.entries()) {
    const faculties = facultyMap.get(dept) || [];
    if (faculties.length === 0) continue; // No faculty in this department

    let studentIndex = 0;
    const studentsPerFaculty = Math.floor(students.length / faculties.length);

    for (let i = 0; i < faculties.length; i++) {
      for (let j = 0; j < studentsPerFaculty; j++) {
        if (studentIndex >= students.length) break;
        await db.insert(mentorStudent).values({
          mentorId: faculties[i],
          studentId: students[studentIndex++],
        });
      }
    }

    // Assign remaining students to any faculty in the same department
    for (; studentIndex < students.length; studentIndex++) {
      await db.insert(mentorStudent).values({
        mentorId: faculties[faculties.length - 1],
        studentId: students[studentIndex],
      });
    }
  }

  // Assign unassigned students to any available faculty
  const remainingStudents = studentsByDept.filter((s) => !facultyMap.has(s.department));
  if (remainingStudents.length > 0) {
    const allFaculties = facultiesByDept.map((f) => f.id);
    let facultyIndex = 0;

    for (const { id } of remainingStudents) {
      await db.insert(mentorStudent).values({
        mentorId: allFaculties[facultyIndex % allFaculties.length],
        studentId: id,
      });
      facultyIndex++;
    }
  }
}
