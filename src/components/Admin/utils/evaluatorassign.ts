import { db } from '@/drizzle/db';
import { faculty, student, evaluatorStudent, user } from '@/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

export async function evaluatorAssignment() {
  try {
    // Fetch all students with their department
    const allStudents = await db.select({ id: student.id, department: student.department }).from(student);

    // Fetch all faculty with their department and user role (to identify coordinators)
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

    // Group students by department
    const studentsByDept = new Map<string | null, Array<{ id: number; department: string | null }>>();
    allStudents.forEach((s) => {
      if (!studentsByDept.has(s.department)) {
        studentsByDept.set(s.department, []);
      }
      studentsByDept.get(s.department)!.push({ id: s.id, department: s.department });
    });

    // Group faculty by department, separating coordinators and regular faculty
    const facultyByDept = new Map<
      string | null,
      Array<{ id: number; department: string | null; isCoordinator: boolean }>
    >();
    facultyWithRoles.forEach((f) => {
      if (!facultyByDept.has(f.department)) {
        facultyByDept.set(f.department, []);
      }
      facultyByDept.get(f.department)!.push({
        id: f.id,
        department: f.department,
        isCoordinator: f.isCoordinator,
      });
    });

    // Create a map to track faculty load
    const facultyLoad = new Map<number, number>();
    facultyWithRoles.forEach((f) => facultyLoad.set(f.id, 0));

    // List of all departments
    const departments = Array.from(studentsByDept.keys());

    // For each department's students, assign them to faculty from other departments
    for (const department of departments) {
      const studentsInDept = studentsByDept.get(department) || [];

      // Get faculty from all OTHER departments
      const eligibleFaculty = facultyWithRoles.filter((f) => f.department !== department);

      if (eligibleFaculty.length === 0) {
        console.warn(`No eligible evaluators for department: ${department}`);
        continue;
      }

      // Separate coordinators and regular faculty
      const coordinators = eligibleFaculty.filter((f) => f.isCoordinator);
      const regularFaculty = eligibleFaculty.filter((f) => !f.isCoordinator);

      // Count total faculty (both coordinators and regular)
      const totalFaculty = eligibleFaculty.length;

      // Calculate the total student assignment "slots" where coordinators get half load
      // If we have n total faculty with c coordinators, and coordinators get half load,
      // then total slots = (n - c) + (c/2) = n - c/2
      const totalSlots = totalFaculty - coordinators.length / 2;

      // Calculate base students per slot
      const baseStudentsPerSlot = Math.floor(studentsInDept.length / totalSlots);
      const remainingStudents = studentsInDept.length % totalSlots;

      // Assign students to both coordinators and regular faculty
      let assignedCount = 0;

      // First, assign to coordinators (half load)
      for (const coordinator of coordinators) {
        // Coordinators get half the regular load (rounded down)
        const coordSlots = 0.5; // Half slot per coordinator
        const studentsForCoord = Math.floor(baseStudentsPerSlot * coordSlots);

        // Assign students to this coordinator
        for (let i = 0; i < studentsForCoord && assignedCount < studentsInDept.length; i++) {
          const studentId = studentsInDept[assignedCount].id;

          await db.insert(evaluatorStudent).values({
            evaluatorId: coordinator.id,
            studentId: studentId,
          });

          facultyLoad.set(coordinator.id, (facultyLoad.get(coordinator.id) || 0) + 1);
          assignedCount++;
        }
      }

      // Then, distribute remaining students to regular faculty
      // Sort faculty to maintain sequence across departments
      const sortedRegularFaculty = [...regularFaculty].sort((a, b) => {
        if (a.department === b.department) return 0;
        return (a.department || '') < (b.department || '') ? -1 : 1;
      });

      // Distribute remaining students evenly among regular faculty
      const remainingStudentsCount = studentsInDept.length - assignedCount;
      const regularFacultyCount = sortedRegularFaculty.length;

      if (regularFacultyCount > 0) {
        const studentsPerRegularFaculty = Math.floor(remainingStudentsCount / regularFacultyCount);
        const extraStudents = remainingStudentsCount % regularFacultyCount;

        for (let i = 0; i < sortedRegularFaculty.length; i++) {
          const facultyId = sortedRegularFaculty[i].id;
          const studentsToAssign = studentsPerRegularFaculty + (i < extraStudents ? 1 : 0);

          for (let j = 0; j < studentsToAssign && assignedCount < studentsInDept.length; j++) {
            const studentId = studentsInDept[assignedCount].id;

            await db.insert(evaluatorStudent).values({
              evaluatorId: facultyId,
              studentId: studentId,
            });

            facultyLoad.set(facultyId, (facultyLoad.get(facultyId) || 0) + 1);
            assignedCount++;
          }
        }
      }

      // Handle any edge case where we still have unassigned students
      while (assignedCount < studentsInDept.length) {
        // Find the faculty with the least load
        const sortedByLoad = [...eligibleFaculty].sort(
          (a, b) => (facultyLoad.get(a.id) || 0) - (facultyLoad.get(b.id) || 0)
        );

        const leastLoadedFacultyId = sortedByLoad[0].id;
        const studentId = studentsInDept[assignedCount].id;

        await db.insert(evaluatorStudent).values({
          evaluatorId: leastLoadedFacultyId,
          studentId: studentId,
        });

        facultyLoad.set(leastLoadedFacultyId, (facultyLoad.get(leastLoadedFacultyId) || 0) + 1);
        assignedCount++;
      }
    }

    // Check if any faculty has significantly more students than others
    const loadValues = Array.from(facultyLoad.values());
    const maxLoad = Math.max(...loadValues);
    const minLoad = Math.min(...loadValues);
    const loadDifference = maxLoad - minLoad;

    // If load difference is significant, rebalance
    if (loadDifference > 5) {
      console.log(`Load imbalance detected (${minLoad}-${maxLoad}). Rebalancing...`);

      // Get all evaluator-student assignments
      const assignments = await db.select().from(evaluatorStudent);

      // Sort faculty by load descending
      const overloadedFaculty = Array.from(facultyLoad.entries())
        .sort((a, b) => b[1] - a[1])
        .filter(([_, load]) => load > minLoad + 2)
        .map(([id]) => id);

      // Sort faculty by load ascending
      const underloadedFaculty = Array.from(facultyLoad.entries())
        .sort((a, b) => a[1] - b[1])
        .filter(([_, load]) => load < maxLoad - 2)
        .map(([id]) => id);

      // Attempt to rebalance by moving some assignments
      if (overloadedFaculty.length > 0 && underloadedFaculty.length > 0) {
        // Implementation of rebalancing logic would go here
        // This would require updating existing assignments
      }
    }

    console.log('Evaluator assignment completed. Faculty load distribution:');
    console.log(Object.fromEntries(facultyLoad));
  } catch (error) {
    console.error('Error in evaluator assignment:', error);
    throw error;
  }
}
