import { InferSelectModel } from 'drizzle-orm';
import { faculty, mentorStudent, SelectStudent } from '@/drizzle/schema';
import { db } from '@/drizzle/db';

type FacultyWithUser = {
  faculty: InferSelectModel<typeof faculty>;
  user: {
    email: string | null;
    role: string | null;
  };
};

type StudentWithUser = {
  student: SelectStudent;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

async function AssignMentors({ students, faculties }: { students: StudentWithUser[]; faculties: FacultyWithUser[] }) {
  // Calculate base students per faculty
  const studentsPerFaculty = Math.floor(students.length / faculties.length);
  const remainingStudents = students.length % faculties.length;
  const facultySize = faculties.length;

  // First, distribute the base number of students to each faculty
  let studentIndex = 0;
  for (let i = 0; i < facultySize; i++) {
    const faculty = faculties[i];

    for (let j = 0; j < studentsPerFaculty; j++) {
      if (studentIndex < students.length) {
        const student = students[studentIndex];
        await db.insert(mentorStudent).values({
          mentorId: faculty.faculty.id,
          studentId: student.student.id,
        });
        studentIndex++;
      }
    }
  }

  // Handle remaining students
  if (remainingStudents > 0) {
    // Distribute remaining students equally among the last 'remainingStudents' faculties
    for (let i = 0; i < remainingStudents; i++) {
      if (studentIndex < students.length) {
        const faculty = faculties[facultySize - remainingStudents + i];
        const student = students[studentIndex];

        await db.insert(mentorStudent).values({
          mentorId: faculty.faculty.id,
          studentId: student.student.id,
        });
        studentIndex++;
      }
    }
  }
}

export default AssignMentors;
