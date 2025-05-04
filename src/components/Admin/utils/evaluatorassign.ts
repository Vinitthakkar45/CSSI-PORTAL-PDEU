import { db } from '@/drizzle/db';
import { faculty, student, evaluatorStudent, user } from '@/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

export async function evaluatorAssignment() {
  try {
    // Fetch all students with their department and sort by id (for sequence)
    const allStudents = await db
      .select({ id: student.id, department: student.department })
      .from(student)
      .orderBy(student.id);

    // Group students by department and maintain sequence
    const studentsByDept = new Map<string | null, Array<{ id: number; department: string | null }>>();
    allStudents.forEach((s) => {
      if (!studentsByDept.has(s.department)) {
        studentsByDept.set(s.department, []);
      }
      studentsByDept.get(s.department)!.push({ id: s.id, department: s.department });
    });

    // Fetch all faculty with their department
    const allFaculty = await db
      .select({
        id: faculty.id,
        department: faculty.department,
        userId: faculty.userId,
      })
      .from(faculty);

    // Get faculty roles
    const userIds = allFaculty.map((f) => f.userId);
    const facultyRoles = await db.select({ id: user.id, role: user.role }).from(user).where(inArray(user.id, userIds));

    // Create role map and enhance faculty data
    const roleMap = new Map();
    facultyRoles.forEach((fr) => roleMap.set(fr.id, fr.role));

    const facultyWithRoles = allFaculty.map((f) => ({
      ...f,
      isCoordinator: roleMap.get(f.userId) === 'coordinator',
    }));

    // Group faculty by department
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

    // Clear existing assignments for a fresh start
    await db.delete(evaluatorStudent);

    // Track faculty load
    const facultyLoad = new Map<number, number>();
    facultyWithRoles.forEach((f) => facultyLoad.set(f.id, 0));

    // Process each department's students in batches
    const departments = Array.from(studentsByDept.keys());

    for (const department of departments) {
      const studentsInDept = studentsByDept.get(department) || [];

      // Get faculty from OTHER departments
      const eligibleFaculty = facultyWithRoles.filter((f) => f.department !== department);

      if (eligibleFaculty.length === 0) {
        console.warn(`No eligible evaluators for department: ${department}`);
        continue;
      }

      // Sort faculty by current load to ensure even distribution
      const sortedFaculty = [...eligibleFaculty].sort((a, b) => {
        const loadA = facultyLoad.get(a.id) || 0;
        const loadB = facultyLoad.get(b.id) || 0;
        // Coordinators get half the weight
        const adjustedLoadA = loadA / (a.isCoordinator ? 0.5 : 1);
        const adjustedLoadB = loadB / (b.isCoordinator ? 0.5 : 1);
        return adjustedLoadA - adjustedLoadB;
      });

      // Batch process students (process in chunks to maintain sequence)
      const batchSize = 10; // Adjust based on your needs
      for (let i = 0; i < studentsInDept.length; i += batchSize) {
        const batch = studentsInDept.slice(i, i + batchSize);

        // Find faculty with lowest load
        const leastLoadedFaculty = sortedFaculty[0];

        // Assign batch to this faculty
        for (const student of batch) {
          await db.insert(evaluatorStudent).values({
            evaluatorId: leastLoadedFaculty.id,
            studentId: student.id,
          });

          // Update faculty load
          const loadIncrement = leastLoadedFaculty.isCoordinator ? 0.5 : 1;
          facultyLoad.set(leastLoadedFaculty.id, (facultyLoad.get(leastLoadedFaculty.id) || 0) + loadIncrement);
        }

        // Re-sort faculty by load for next batch
        sortedFaculty.sort((a, b) => {
          const loadA = facultyLoad.get(a.id) || 0;
          const loadB = facultyLoad.get(b.id) || 0;
          const adjustedLoadA = loadA / (a.isCoordinator ? 0.5 : 1);
          const adjustedLoadB = loadB / (b.isCoordinator ? 0.5 : 1);
          return adjustedLoadA - adjustedLoadB;
        });
      }
    }

    console.log('Evaluator assignment completed. Faculty load distribution:');
    console.log(Object.fromEntries(facultyLoad));
    return { success: true };
  } catch (error) {
    console.error('Error in evaluator assignment:', error);
    throw error;
  }
}
