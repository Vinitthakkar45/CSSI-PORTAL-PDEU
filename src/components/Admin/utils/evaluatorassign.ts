import { db } from '@/drizzle/db';
import { student, faculty, evaluatorStudent } from '@/drizzle/schema';
import { asc } from 'drizzle-orm';

type StudentType = {
  id: number;
  department: string | null;
  rollNumber: string | null;
};

type FacultyType = {
  id: number;
  department: string | null;
};

type Assignment = {
  evaluatorId: number;
  studentId: number;
};

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

    // Group by department
    const studentGroups: Record<string, StudentType[]> = {};
    for (const s of students) {
      const dept = s.department!;
      if (!studentGroups[dept]) studentGroups[dept] = [];
      studentGroups[dept].push(s);
    }

    const facultyGroups: Record<string, FacultyType[]> = {};
    for (const f of faculties) {
      const dept = f.department!;
      if (!facultyGroups[dept]) facultyGroups[dept] = [];
      facultyGroups[dept].push(f);
    }

    // Get all departments
    const allDepartments = Array.from(new Set([...Object.keys(studentGroups), ...Object.keys(facultyGroups)]));

    await db.delete(evaluatorStudent).execute();

    // Binary search for minimum possible maximum students per faculty
    const result = binarySearchAssignment(studentGroups, facultyGroups, allDepartments);

    if (!result.success) {
      throw new Error('No valid assignment possible');
    }

    await db.insert(evaluatorStudent).values(result.assignments).execute();

    return {
      success: true,
      assignedCount: result.assignments.length,
      maxStudentsPerFaculty: result.maxStudentsPerFaculty,
    };
  } catch (error) {
    console.error('Error during evaluator assignment:', error);
    throw error;
  }
}

function binarySearchAssignment(
  studentGroups: Record<string, StudentType[]>,
  facultyGroups: Record<string, FacultyType[]>,
  departments: string[]
): { success: boolean; assignments: Assignment[]; maxStudentsPerFaculty: number } {
  const totalStudents = Object.values(studentGroups).reduce((sum, group) => sum + group.length, 0);

  // Calculate more realistic bounds considering department constraints
  let maxPossibleFaculties = 0;
  let minRequiredMax = 1;

  // For each student department, calculate how many faculties from other departments are available
  for (const studentDept of departments) {
    if (!studentGroups[studentDept] || studentGroups[studentDept].length === 0) continue;

    const studentsInDept = studentGroups[studentDept].length;
    let availableFacultiesForThisDept = 0;

    for (const facultyDept of departments) {
      if (facultyDept !== studentDept && facultyGroups[facultyDept]) {
        availableFacultiesForThisDept += facultyGroups[facultyDept].length;
      }
    }

    if (availableFacultiesForThisDept === 0) {
      throw new Error(`No available faculties for department ${studentDept}`);
    }

    // Minimum students per faculty needed for this department alone
    const minForThisDept = Math.ceil(studentsInDept / availableFacultiesForThisDept);
    minRequiredMax = Math.max(minRequiredMax, minForThisDept);
    maxPossibleFaculties += Math.min(availableFacultiesForThisDept, studentsInDept);
  }

  // Binary search bounds - much tighter now
  let left = minRequiredMax;
  let right = Math.ceil(totalStudents / Math.min(maxPossibleFaculties, totalStudents));

  // Safety upper bound
  right = Math.max(right, Math.max(...Object.values(studentGroups).map((group) => group.length)));

  let bestResult: { assignments: Assignment[]; maxStudentsPerFaculty: number } | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const result = canAssignWithMaxLimit(studentGroups, facultyGroups, departments, mid);

    if (result.success) {
      bestResult = { assignments: result.assignments, maxStudentsPerFaculty: mid };
      right = mid - 1; // Try to find smaller maximum
    } else {
      left = mid + 1; // Need larger maximum
    }
  }

  return bestResult ? { success: true, ...bestResult } : { success: false, assignments: [], maxStudentsPerFaculty: -1 };
}

function canAssignWithMaxLimit(
  studentGroups: Record<string, StudentType[]>,
  facultyGroups: Record<string, FacultyType[]>,
  departments: string[],
  maxStudentsPerFaculty: number
): { success: boolean; assignments: Assignment[] } {
  // Track faculty allocations (how many students from which department)
  const facultyAllocations: Record<number, { department: string; count: number }> = {};

  // Initialize faculty tracking
  for (const dept of departments) {
    if (facultyGroups[dept]) {
      for (const faculty of facultyGroups[dept]) {
        facultyAllocations[faculty.id] = { department: '', count: 0 };
      }
    }
  }

  // Sort student departments by size (largest first) for better optimization
  const sortedStudentDepts = departments
    .filter((dept) => studentGroups[dept] && studentGroups[dept].length > 0)
    .sort((a, b) => studentGroups[b].length - studentGroups[a].length);

  // PHASE 1: Determine allocations (counts only)
  for (const studentDept of sortedStudentDepts) {
    const studentsCount = studentGroups[studentDept].length;

    // Get all available faculties from other departments
    const availableFaculties: FacultyType[] = [];
    for (const facultyDept of departments) {
      if (facultyDept !== studentDept && facultyGroups[facultyDept]) {
        availableFaculties.push(...facultyGroups[facultyDept]);
      }
    }

    if (availableFaculties.length === 0) {
      return { success: false, assignments: [] };
    }

    // Calculate how many faculties we need for this department
    const minFacultiesNeeded = Math.ceil(studentsCount / maxStudentsPerFaculty);

    // Get fresh faculties (not assigned to any department yet) - prioritize using more faculties
    const freshFaculties = availableFaculties
      .filter((f) => facultyAllocations[f.id].count === 0)
      .sort((a, b) => facultyAllocations[a.id].count - facultyAllocations[b.id].count);

    // Get faculties already assigned to this department
    const alreadyAssignedFaculties = availableFaculties
      .filter((f) => facultyAllocations[f.id].department === studentDept)
      .sort((a, b) => facultyAllocations[a.id].count - facultyAllocations[b.id].count);

    // Combine available faculties - use fresh ones first to distribute load
    const allAvailableFaculties = [...freshFaculties, ...alreadyAssignedFaculties];

    // Check if we have enough faculty capacity
    const maxPossibleCapacity = allAvailableFaculties.length * maxStudentsPerFaculty;
    if (maxPossibleCapacity < studentsCount) {
      return { success: false, assignments: [] };
    }

    // Determine how many faculties to use for optimal distribution
    const facultiesToUse = allAvailableFaculties.slice(0, Math.min(minFacultiesNeeded, allAvailableFaculties.length));

    // Distribute students across selected faculties using round-robin for counts
    let remainingStudents = studentsCount;
    let facultyIndex = 0;

    while (remainingStudents > 0) {
      const faculty = facultiesToUse[facultyIndex % facultiesToUse.length];

      if (facultyAllocations[faculty.id].count < maxStudentsPerFaculty) {
        facultyAllocations[faculty.id].department = studentDept;
        facultyAllocations[faculty.id].count++;
        remainingStudents--;
      }

      facultyIndex++;

      // Safety check - if we can't place any more students, fail
      if (facultyIndex > facultiesToUse.length * maxStudentsPerFaculty) {
        return { success: false, assignments: [] };
      }
    }
  }

  // PHASE 2: Create actual assignments with sequential roll numbers
  const assignments: Assignment[] = [];

  for (const studentDept of departments) {
    if (!studentGroups[studentDept] || studentGroups[studentDept].length === 0) {
      continue;
    }

    // Get students sorted by roll number (already sorted from DB query)
    const sortedStudents = [...studentGroups[studentDept]];

    // Get faculties assigned to this department, sorted by faculty ID for consistency
    const assignedFaculties = Object.entries(facultyAllocations)
      .filter(([_, allocation]) => allocation.department === studentDept)
      .map(([facultyId, allocation]) => ({
        facultyId: parseInt(facultyId),
        count: allocation.count,
      }))
      .sort((a, b) => a.facultyId - b.facultyId);

    // Assign students sequentially to faculties
    let studentIndex = 0;

    for (const { facultyId, count } of assignedFaculties) {
      for (let i = 0; i < count && studentIndex < sortedStudents.length; i++) {
        assignments.push({
          evaluatorId: facultyId,
          studentId: sortedStudents[studentIndex].id,
        });
        studentIndex++;
      }
    }
  }

  return { success: true, assignments };
}
