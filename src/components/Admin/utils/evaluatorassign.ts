import { db } from '@/drizzle/db';
import { student, faculty, evaluatorStudent } from '@/drizzle/schema';
import { asc } from 'drizzle-orm';

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

    const revFac = faculties.reverse();
    const assignments: { studentId: number; evaluatorId: number }[] = [];

    const minStudentsPerFaculty = Math.floor(students.length / revFac.length);
    const extraStudents = students.length % revFac.length;

    let facultyIndex = 0;
    const studentPool = [...students];

    while (studentPool.length > 0) {
      const faculty = revFac[facultyIndex];
      const studentsToAssign = minStudentsPerFaculty + (facultyIndex < extraStudents ? 1 : 0);

      let assignedCount = 0;

      for (let i = 0; i < studentPool.length && assignedCount < studentsToAssign; ) {
        const groupDept = studentPool[i].department;

        if (groupDept !== faculty.department) {
          const sameDeptGroup = studentPool.filter((s) => s.department === groupDept);

          for (const s of sameDeptGroup) {
            if (assignedCount >= studentsToAssign) break;

            assignments.push({
              studentId: s.id,
              evaluatorId: faculty.id,
            });

            const index = studentPool.findIndex((std) => std.id === s.id);
            if (index !== -1) studentPool.splice(index, 1);

            assignedCount++;
          }

          break;
        } else {
          const skipDept = groupDept;
          while (i < studentPool.length && studentPool[i].department === skipDept) i++;
        }
      }

      facultyIndex = (facultyIndex + 1) % revFac.length;
    }

    if (assignments.length > 0) {
      await db.insert(evaluatorStudent).values(assignments);
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
