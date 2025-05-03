import { db } from '@/drizzle/db';
import { faculty, student, mentorStudent, user } from '@/drizzle/schema';
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

    // Fetch all faculty with their department and userId
    const allFaculty = await db
      .select({
        id: faculty.id,
        department: faculty.department,
        userId: faculty.userId,
      })
      .from(faculty);

    // Get the user IDs of all faculty members
    const userIds = allFaculty.map((f) => f.userId);

    // Fetch roles for all faculty users
    const facultyRoles = await db
      .select({
        id: user.id,
        role: user.role,
      })
      .from(user)
      .where(inArray(user.id, userIds));

    // Create a map of userId to role
    const roleMap = new Map();
    facultyRoles.forEach((fr) => roleMap.set(fr.id, fr.role));

    // Enhance faculty data with roles
    const facultyWithRoles = allFaculty.map((f) => ({
      ...f,
      role: roleMap.get(f.userId) || 'faculty', // Default to 'faculty' if role not found
      isCoordinator: roleMap.get(f.userId) === 'coordinator',
    }));

    // Group unassigned students by department
    const studentsByDept = new Map<string | null, number[]>();
    unassignedStudents.forEach(({ id, department }) => {
      if (!studentsByDept.has(department)) {
        studentsByDept.set(department, []);
      }
      studentsByDept.get(department)!.push(id);
    });

    // Group faculty by department, separating coordinators and regular faculty
    const facultyByDept = new Map<string | null, Array<{ id: number; isCoordinator: boolean }>>();
    facultyWithRoles.forEach(({ id, department, isCoordinator }) => {
      if (!facultyByDept.has(department)) {
        facultyByDept.set(department, []);
      }
      facultyByDept.get(department)!.push({ id, isCoordinator });
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

      // Separate coordinators and regular faculty
      const coordinators = departmentFaculty.filter((f) => f.isCoordinator);
      const regularFaculty = departmentFaculty.filter((f) => !f.isCoordinator);

      // Calculate distribution slots
      // Each coordinator counts as 0.5 slots, regular faculty as 1 slot
      const totalFacultySlots = regularFaculty.length + coordinators.length * 0.5;

      // Calculate students per slot
      const studentsPerSlot = Math.floor(studentIds.length / totalFacultySlots);
      const remainingStudents = studentIds.length % Math.floor(totalFacultySlots);

      let studentIndex = 0;

      // First assign to coordinators (with half load)
      for (const coordinator of coordinators) {
        // Coordinators get half the regular load (rounded down)
        const studentsToAssign = Math.floor(studentsPerSlot * 0.5);

        for (let i = 0; i < studentsToAssign && studentIndex < studentIds.length; i++) {
          await db.insert(mentorStudent).values({
            mentorId: coordinator.id,
            studentId: studentIds[studentIndex],
          });
          studentIndex++;
        }
      }

      // Then assign remaining students to regular faculty
      for (const regularFac of regularFaculty) {
        // Calculate how many students to assign to this faculty
        // We distribute any remaining students one by one to faculty
        const extraStudent = remainingStudents > 0 && studentIndex >= studentIds.length - remainingStudents ? 1 : 0;
        const studentsToAssign = studentsPerSlot + extraStudent;

        for (let i = 0; i < studentsToAssign && studentIndex < studentIds.length; i++) {
          await db.insert(mentorStudent).values({
            mentorId: regularFac.id,
            studentId: studentIds[studentIndex],
          });
          studentIndex++;
        }
      }

      // If we still have unassigned students due to rounding, assign them to faculty with the least load
      while (studentIndex < studentIds.length) {
        // Get current faculty loads from existing mentor assignments
        const currentLoads = await db
          .select({
            mentorId: mentorStudent.mentorId,
            count: sql`count(*)`.mapWith(Number),
          })
          .from(mentorStudent)
          .where(
            inArray(
              mentorStudent.mentorId,
              departmentFaculty.map((f) => f.id)
            )
          )
          .groupBy(mentorStudent.mentorId);

        // Create a load map
        const deptFacultyLoad = new Map<number, number>();
        departmentFaculty.forEach((f) => deptFacultyLoad.set(f.id, 0));

        // Update with actual loads
        currentLoads.forEach(({ mentorId, count }) => {
          deptFacultyLoad.set(mentorId, count);
        });

        // Find faculty with least load, considering coordinator status
        const sortedByLoad = [...departmentFaculty]
          .map((f) => ({
            id: f.id,
            isCoordinator: f.isCoordinator,
            // Adjust load comparison - coordinators should have half the load
            adjustedLoad: (deptFacultyLoad.get(f.id) || 0) / (f.isCoordinator ? 0.5 : 1),
          }))
          .sort((a, b) => a.adjustedLoad - b.adjustedLoad);

        // Assign to faculty with least load
        if (sortedByLoad.length > 0) {
          await db.insert(mentorStudent).values({
            mentorId: sortedByLoad[0].id,
            studentId: studentIds[studentIndex],
          });
          studentIndex++;
        } else {
          // This should not happen, but just in case
          studentsWithoutDeptFaculty.push({ id: studentIds[studentIndex], department });
          studentIndex++;
        }
      }
    }

    // Handle students without faculty in their department
    if (studentsWithoutDeptFaculty.length > 0) {
      console.log(`Assigning ${studentsWithoutDeptFaculty.length} students with no faculty in their department`);

      // Create a load counter for all faculty
      const facultyLoad = new Map<number, number>();
      facultyWithRoles.forEach((f) => facultyLoad.set(f.id, 0));

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
        // Sort faculty by current load, considering coordinator status
        const sortedFaculty = [...facultyWithRoles]
          .map((f) => ({
            id: f.id,
            isCoordinator: f.isCoordinator,
            // Adjust load comparison - coordinators should have half the load
            adjustedLoad: (facultyLoad.get(f.id) || 0) / (f.isCoordinator ? 0.5 : 1),
          }))
          .sort((a, b) => a.adjustedLoad - b.adjustedLoad);

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
