import { db } from '@/drizzle/db';
import { faculty, student, evaluatorStudent } from '@/drizzle/schema';

export async function evaluatorAssignment() {
  // Fetch all students grouped by department
  const studentsByDept = new Map<string | null, { id: number }[]>();
  const studentList = await db.select({ id: student.id, department: student.department }).from(student);

  studentList.forEach(({ id, department }) => {
    if (!studentsByDept.has(department)) studentsByDept.set(department, []);
    studentsByDept.get(department)!.push({ id });
  });

  // Fetch all faculty grouped by department
  const facultyByDept = new Map<string | null, { id: number }[]>();
  const facultyList = await db.select({ id: faculty.id, department: faculty.department }).from(faculty);

  facultyList.forEach(({ id, department }) => {
    if (!facultyByDept.has(department)) facultyByDept.set(department, []);
    facultyByDept.get(department)!.push({ id });
  });

  // Assign evaluators
  const unassignedStudents: { id: number; department: string | null }[] = [];

  for (const [studentDept, students] of studentsByDept.entries()) {
    let studentIndex = 0;

    // Find evaluators from different departments
    const possibleEvaluators = facultyList.filter((f) => f.department !== studentDept);

    if (possibleEvaluators.length > 0) {
      const evaluatorsPerStudent = Math.floor(students.length / possibleEvaluators.length);

      for (let i = 0; i < possibleEvaluators.length && studentIndex < students.length; i++) {
        for (let j = 0; j < evaluatorsPerStudent && studentIndex < students.length; j++) {
          await db.insert(evaluatorStudent).values({
            evaluatorId: possibleEvaluators[i].id,
            studentId: students[studentIndex++].id,
          });
        }
      }
    }

    // Collect remaining unassigned students
    while (studentIndex < students.length) {
      unassignedStudents.push({ id: students[studentIndex].id, department: studentDept });
      studentIndex++;
    }
  }

  // Assign remaining students to any available faculty
  let fallbackIndex = 0;
  while (unassignedStudents.length > 0) {
    const student = unassignedStudents.pop();
    if (student) {
      const evaluator = facultyList[fallbackIndex % facultyList.length]; // Round-robin assignment
      await db.insert(evaluatorStudent).values({
        evaluatorId: evaluator.id,
        studentId: student.id,
      });
      fallbackIndex++;
    }
  }
}
