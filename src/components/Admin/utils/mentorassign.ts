import { db } from '@/drizzle/db';
import { faculty, student, mentorStudent } from '@/drizzle/schema';
import { eq, inArray, sql } from 'drizzle-orm';

export async function mentorAssignment() {
  try {
    // First, check if all students already have mentors
    const totalStudents = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(student);
    const totalMentorAssignments = await db
      .select({ count: sql`count(distinct "student_id")`.mapWith(Number) })
      .from(mentorStudent);

    // If all students have mentors, return with a message
    if (totalStudents[0].count === totalMentorAssignments[0].count) {
      return { allAssigned: true, message: 'All students already have mentors assigned' };
    }

    // Fetch all students
    const allStudents = await db.select({ id: student.id, department: student.department }).from(student);

    // Fetch all existing mentor assignments to find students who already have mentors
    const existingAssignments = await db.select({ studentId: mentorStudent.studentId }).from(mentorStudent);
    const assignedStudentIds = new Set(existingAssignments.map((a) => a.studentId));

    // Filter out students who already have mentors
    const unassignedStudents = allStudents.filter((s) => !assignedStudentIds.has(s.id));

    console.log(`Found ${unassignedStudents.length} students without mentors`);

    // If there are no unassigned students, return early
    if (unassignedStudents.length === 0) {
      return { allAssigned: true, message: 'All students already have mentors assigned' };
    }

    // Fetch all faculty with their department
    const allFaculty = await db.select({ id: faculty.id, department: faculty.department }).from(faculty);

    // Group unassigned students by department
    const studentsByDept = new Map<string | null, number[]>();
    unassignedStudents.forEach(({ id, department }) => {
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
    const studentsWithoutDeptFaculty: Array<{ id: number; department: string | null }> = [];

    // Process each department
    for (const [department, studentIds] of studentsByDept.entries()) {
      const departmentFaculty = facultyByDept.get(department);

      // If no faculty in this department, add students to unassigned list
      if (!departmentFaculty || departmentFaculty.length === 0) {
        studentIds.forEach((id) => studentsWithoutDeptFaculty.push({ id, department }));
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

    // Handle students without faculty in their department
    if (studentsWithoutDeptFaculty.length > 0) {
      console.log(`Assigning ${studentsWithoutDeptFaculty.length} students with no faculty in their department`);

      // Create a load counter for all faculty
      const facultyLoad = new Map<number, number>();
      allFaculty.forEach((f) => facultyLoad.set(f.id, 0));

      // Get current faculty loads from existing mentor assignments
      const currentLoads = await db
        .select({
          mentorId: mentorStudent.mentorId,
          count: sql`count(*)`.mapWith(Number),
        })
        .from(mentorStudent)
        .groupBy(mentorStudent.mentorId);

      // Update faculty load with existing assignments
      currentLoads.forEach(({ mentorId, count }) => {
        facultyLoad.set(mentorId, count);
      });

      // Assign each student without dept faculty to faculty with the least load
      for (const { id: studentId } of studentsWithoutDeptFaculty) {
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

    console.log(`Successfully assigned ${unassignedStudents.length} remaining students to mentors`);
    return {
      allAssigned: false,
      success: true,
      message: `Successfully assigned ${unassignedStudents.length} remaining students to mentors`,
      assignedCount: unassignedStudents.length,
    };
  } catch (error) {
    console.error('Error in mentor assignment:', error);
    throw error;
  }
}
