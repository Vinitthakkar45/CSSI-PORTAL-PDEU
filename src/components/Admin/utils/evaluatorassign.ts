import { db } from '@/drizzle/db';
import { faculty, student, evaluatorStudent } from '@/drizzle/schema';
import { asc } from 'drizzle-orm';

export async function evaluatorAssignment() {
  try {
    const allStudents = await db
      .select({
        id: student.id,
        department: student.department,
        rollNumber: student.rollNumber,
      })
      .from(student)
      .orderBy(asc(student.department), asc(student.rollNumber));

    const allFaculty = await db
      .select({
        id: faculty.id,
        department: faculty.department,
      })
      .from(faculty);

    // Clear existing assignments for a fresh start
    await db.delete(evaluatorStudent);

    const studentsByDept = new Map<string, { id: number }[]>();
    for (const s of allStudents) {
      if (!s.department) continue;
      if (!studentsByDept.has(s.department)) {
        studentsByDept.set(s.department, []);
      }
      studentsByDept.get(s.department)!.push({ id: s.id });
    }

    const facultyByDept = new Map<string, { id: number }[]>();
    for (const f of allFaculty) {
      if (!f.department) continue;
      if (!facultyByDept.has(f.department)) {
        facultyByDept.set(f.department, []);
      }
      facultyByDept.get(f.department)!.push({ id: f.id });
    }

    const assignments: { evaluatorId: number; studentId: number }[] = [];

    for (const [dept, deptStudents] of studentsByDept.entries()) {
      // Get faculty from OTHER departments
      const eligibleFaculty = allFaculty.filter((f) => f.department !== dept && f.department);

      if (eligibleFaculty.length === 0) {
        console.warn(`No eligible evaluators for department: ${dept}`);
        continue;
      }

      // Group students by their roll numbers to keep them in sequence
      // This ensures students from same department stay together
      const sortedDeptStudents = [...deptStudents].sort((a, b) => {
        const studentA = allStudents.find((s) => s.id === a.id);
        const studentB = allStudents.find((s) => s.id === b.id);
        return (studentA?.rollNumber || '').localeCompare(studentB?.rollNumber || '');
      });

      // Distribute students to faculty evenly while keeping students from same dept together
      const facultyCount = eligibleFaculty.length;
      const chunkSize = Math.ceil(sortedDeptStudents.length / facultyCount);

      // Split students into chunks for each faculty
      for (let i = 0; i < facultyCount; i++) {
        const startIdx = i * chunkSize;
        const endIdx = Math.min(startIdx + chunkSize, sortedDeptStudents.length);

        // Skip if we've assigned all students
        if (startIdx >= sortedDeptStudents.length) break;

        // Assign this chunk of students to the current faculty
        const studentsChunk = sortedDeptStudents.slice(startIdx, endIdx);
        for (const student of studentsChunk) {
          assignments.push({
            studentId: student.id,
            evaluatorId: eligibleFaculty[i].id,
          });
        }
      }
    }

    // Ensure no faculty is left without students if possible
    const assignedFacultyIds = new Set(assignments.map((a) => a.evaluatorId));
    const unassignedFaculty = allFaculty.filter((f) => !assignedFacultyIds.has(f.id) && f.department);

    if (unassignedFaculty.length > 0 && assignments.length > 0) {
      // Redistribute some assignments to unassigned faculty
      for (const unassignedFac of unassignedFaculty) {
        // Find faculty with most assignments
        const facultyAssignmentCounts = new Map<number, number>();
        for (const assignment of assignments) {
          facultyAssignmentCounts.set(
            assignment.evaluatorId,
            (facultyAssignmentCounts.get(assignment.evaluatorId) || 0) + 1
          );
        }

        const maxAssignedFaculty = [...facultyAssignmentCounts.entries()].sort((a, b) => b[1] - a[1])[0];

        if (maxAssignedFaculty && maxAssignedFaculty[1] > 1) {
          // Find students assigned to this faculty
          const studentsToRedistribute = assignments
            .filter((a) => a.evaluatorId === maxAssignedFaculty[0])
            .slice(0, Math.floor(maxAssignedFaculty[1] / 2)); // Take half

          // Reassign to unassigned faculty
          for (const assignment of studentsToRedistribute) {
            assignment.evaluatorId = unassignedFac.id;
          }
        }
      }
    }

    if (assignments.length > 0) {
      await db.insert(evaluatorStudent).values(assignments);
    }

    return {
      success: true,
      assignedCount: assignments.length,
      message: `Assigned ${assignments.length} students to evaluators from different departments.`,
    };
  } catch (error) {
    console.error('Error in evaluator assignment:', error);
    throw error;
  }
}
