import { countStudents, countFaculty } from './countrecords';
import { db } from '@/drizzle/db';
import { faculty, student, mentorStudent } from '@/drizzle/schema';

export async function mentorAssignment() {
  const totalStudents = await countStudents();
  const totalFaculty = await countFaculty();
  const studentsPerFaculty = Math.floor(totalStudents / totalFaculty);

  // Fetch student and faculty IDs
  const studentsList = await db.select({ id: student.id }).from(student);
  const facultyList = await db.select({ id: faculty.id }).from(faculty);

  let studentIndex = 0;

  // Assign students to faculties equally
  for (let i = 0; i < totalFaculty - 1; i++) {
    for (let j = 0; j < studentsPerFaculty; j++) {
      await db.insert(mentorStudent).values({
        mentorId: facultyList[i].id,
        studentId: studentsList[studentIndex].id,
      });
      studentIndex++;
    }
  }

  // Assign remaining students to the last faculty
  for (; studentIndex < totalStudents; studentIndex++) {
    await db.insert(mentorStudent).values({
      mentorId: facultyList[totalFaculty - 1].id, // Last faculty
      studentId: studentsList[studentIndex].id,
    });
  }
}
