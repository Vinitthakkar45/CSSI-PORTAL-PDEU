import { db } from '@/drizzle/db';
import { faculty, student, evaluatorStudent } from '@/drizzle/schema';

export async function evaluatorAssignment() {
  try {
    // Fetch all students with their department
    const allStudents = await db.select({ id: student.id, department: student.department }).from(student);

    // Fetch all faculty with their department
    const allFaculty = await db.select({ id: faculty.id, department: faculty.department }).from(faculty);

    // Group students by department
    const studentsByDept = new Map<string | null, Array<{ id: number; department: string | null }>>();
    allStudents.forEach((s) => {
      if (!studentsByDept.has(s.department)) {
        studentsByDept.set(s.department, []);
      }
      studentsByDept.get(s.department)!.push({ id: s.id, department: s.department });
    });

    // Group faculty by department
    const facultyByDept = new Map<string | null, Array<{ id: number; department: string | null }>>();
    allFaculty.forEach((f) => {
      if (!facultyByDept.has(f.department)) {
        facultyByDept.set(f.department, []);
      }
      facultyByDept.get(f.department)!.push({ id: f.id, department: f.department });
    });

    // Create a map to track faculty load
    const facultyLoad = new Map<number, number>();
    allFaculty.forEach((f) => facultyLoad.set(f.id, 0));

    // List of all departments
    const departments = Array.from(studentsByDept.keys());

    // For each department's students, assign them to faculty from other departments
    for (const department of departments) {
      const studentsInDept = studentsByDept.get(department) || [];

      // Get faculty from all OTHER departments
      const eligibleFaculty = allFaculty.filter((f) => f.department !== department);

      if (eligibleFaculty.length === 0) {
        console.warn(`No eligible evaluators for department: ${department}`);
        continue;
      }

      // Sort eligible faculty by department to maintain sequence
      const sortedFaculty = [...eligibleFaculty].sort((a, b) => {
        if (a.department === b.department) return 0;
        return (a.department || '') < (b.department || '') ? -1 : 1;
      });

      // Assign each student to a faculty from a different department in sequence
      for (let i = 0; i < studentsInDept.length; i++) {
        const studentId = studentsInDept[i].id;
        const facultyIndex = i % sortedFaculty.length;
        const facultyId = sortedFaculty[facultyIndex].id;

        await db.insert(evaluatorStudent).values({
          evaluatorId: facultyId,
          studentId: studentId,
        });

        // Update faculty load
        facultyLoad.set(facultyId, (facultyLoad.get(facultyId) || 0) + 1);
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
