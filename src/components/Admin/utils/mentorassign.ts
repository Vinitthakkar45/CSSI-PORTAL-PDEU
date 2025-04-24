import { db } from '@/drizzle/db';
import { faculty, student, mentorStudent } from '@/drizzle/schema';

export async function mentorAssignment() {
  try {
    // Fetch all students with their department
    const allStudents = await db.select({ id: student.id, department: student.department }).from(student);

    // Fetch all faculty with their department
    const allFaculty = await db.select({ id: faculty.id, department: faculty.department }).from(faculty);

    // Group students by department
    const studentsByDept = new Map<string | null, number[]>();
    allStudents.forEach(({ id, department }) => {
      if (!studentsByDept.has(department)) {
        studentsByDept.set(department, []);
      }
      studentsByDept.get(department)!.push(id);
    });

    // Group faculty by department
    const facultyByDept = new Map<string | null, number[]>();
    allFaculty.forEach(({ id, department }) => {
      if (!facultyByDept.has(department)) {
        facultyByDept.set(department, []);
      }
      facultyByDept.get(department)!.push(id);
    });

    // List to track students who couldn't be assigned to faculty in their department
    const unassignedStudents: Array<{ id: number; department: string | null }> = [];

    // Process each department
    for (const [department, studentIds] of studentsByDept.entries()) {
      const departmentFaculty = facultyByDept.get(department);

      // If no faculty in this department, add students to unassigned list
      if (!departmentFaculty || departmentFaculty.length === 0) {
        studentIds.forEach((id) => unassignedStudents.push({ id, department }));
        continue;
      }

      // Calculate students per faculty (equal distribution)
      const studentsPerFaculty = Math.floor(studentIds.length / departmentFaculty.length);
      const remainingStudents = studentIds.length % departmentFaculty.length;

      let studentIndex = 0;

      // Assign students to faculty in this department
      for (let facIndex = 0; facIndex < departmentFaculty.length; facIndex++) {
        const facultyId = departmentFaculty[facIndex];
        const studentsToAssign = studentsPerFaculty + (facIndex < remainingStudents ? 1 : 0);

        for (let i = 0; i < studentsToAssign && studentIndex < studentIds.length; i++) {
          await db.insert(mentorStudent).values({
            mentorId: facultyId,
            studentId: studentIds[studentIndex],
          });
          studentIndex++;
        }
      }
    }

    // Handle unassigned students (those with no faculty in their department)
    if (unassignedStudents.length > 0) {
      console.log(`Assigning ${unassignedStudents.length} students with no faculty in their department`);

      // Create a load counter for all faculty
      const facultyLoad = new Map<number, number>();
      allFaculty.forEach((f) => facultyLoad.set(f.id, 0));

      // Assign each unassigned student to faculty with the least load
      for (const { id: studentId } of unassignedStudents) {
        // Sort faculty by current load
        const sortedFaculty = [...allFaculty].sort(
          (a, b) => (facultyLoad.get(a.id) || 0) - (facultyLoad.get(b.id) || 0)
        );

        const leastLoadedFaculty = sortedFaculty[0].id;

        await db.insert(mentorStudent).values({
          mentorId: leastLoadedFaculty,
          studentId: studentId,
        });

        facultyLoad.set(leastLoadedFaculty, (facultyLoad.get(leastLoadedFaculty) || 0) + 1);
      }
    }

    console.log('Mentor assignment completed successfully');
  } catch (error) {
    console.error('Error in mentor assignment:', error);
    throw error;
  }
}
