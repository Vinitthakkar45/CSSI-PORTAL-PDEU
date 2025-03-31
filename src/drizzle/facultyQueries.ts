import { db } from './db';
import { eq, inArray } from 'drizzle-orm/expressions';
import { faculty, mentorStudent, student, evaluatorStudent, user } from './schema';

export const getMentoredStudents = async (facultyId: number) => {
  // Fetch the faculty ID based on the user ID
  const fac_id_result = await db.select({ id: faculty.id }).from(faculty).where(eq(faculty.userId, facultyId)).limit(1);

  if (fac_id_result.length === 0) {
    throw new Error('Faculty not found');
  }

  const fac_id = fac_id_result[0].id;

  // Fetch the student IDs mentored by the faculty
  const stu_ids = await db
    .select({ id: mentorStudent.studentId })
    .from(mentorStudent)
    .where(eq(mentorStudent.mentorId, fac_id));

  const ids = stu_ids.map((stud) => stud.id);

  // Fetch the student details
  const students_data = (await db
    .select({
      id: student.id,
      rollNumber: student.rollNumber,
      department: student.department,
      ngoName: student.ngoName,
      ngoLocation: student.ngoLocation,
      ngoPhone: student.ngoPhone,
      ngoDescription: student.ngoDescription,
      name: student.name,
      email: user.email,
      mentorMarks: student.internal_evaluation_marks,
      evaluatorMarks: student.final_evaluation_marks,
      ngoChosen: student.ngoChosen,
    })
    .from(student)
    .innerJoin(user, eq(student.userId, user.id))
    .where(inArray(student.id, ids))) as Array<{
    id: number;
    rollNumber: string;
    department: string | null;
    ngoName: string | null;
    ngoLocation: string | null;
    ngoPhone: string | null;
    ngoDescription: string | null;
    name: string | null;
    email: string;
    ngoChosen: boolean;
    image?: string;
    ngoStatus?: string;
  }>;

  students_data.forEach((student) => {
    student.image = '/images/user/user-16.jpg'; // Static image path
    student.ngoStatus = student.ngoChosen ? 'active' : 'pending';
  });

  return students_data;
};

export const getEvaluatedStudents = async (facultyId: number) => {
  // Fetch the faculty ID based on the user ID
  const fac_id_result = await db.select({ id: faculty.id }).from(faculty).where(eq(faculty.userId, facultyId)).limit(1);

  if (fac_id_result.length === 0) {
    throw new Error('Faculty not found');
  }

  const fac_id = fac_id_result[0].id;

  // Fetch the student IDs evaluated by the faculty
  const stu_ids = await db
    .select({ id: evaluatorStudent.studentId })
    .from(evaluatorStudent)
    .where(eq(evaluatorStudent.evaluatorId, fac_id));

  const ids = stu_ids.map((stud) => stud.id);

  // Fetch the student details
  const students_data = (await db
    .select({
      id: student.id,
      rollNumber: student.rollNumber,
      department: student.department,
      ngoName: student.ngoName,
      ngoLocation: student.ngoLocation,
      ngoPhone: student.ngoPhone,
      ngoDescription: student.ngoDescription,
      name: student.name,
      email: user.email,
      mentorMarks: student.internal_evaluation_marks,
      evaluatorMarks: student.final_evaluation_marks,
      ngoChosen: student.ngoChosen,
    })
    .from(student)
    .innerJoin(user, eq(student.userId, user.id))
    .where(inArray(student.id, ids))) as Array<{
    id: number;
    rollNumber: string;
    department: string | null;
    ngoName: string | null;
    ngoLocation: string | null;
    ngoPhone: string | null;
    ngoDescription: string | null;
    name: string | null;
    email: string;
    image?: string;
    ngoStatus?: string;
    ngoChosen: boolean;
  }>;

  students_data.forEach((student) => {
    student.image = '/images/user/user-17.jpg'; // Static image path
    student.ngoStatus = student.ngoChosen ? 'active' : 'pending'; // NGO status
  });
  return students_data;
};

export const updateInternalMarks = async (facultyId: number, studentId: number, marks: number) => {
  await db.update(student).set({ internal_evaluation_marks: marks }).where(eq(student.id, studentId));
  return { success: true };
};

export const updateFinalMarks = async (facultyId: number, studentId: number, marks: number) => {
  await db.update(student).set({ final_evaluation_marks: marks }).where(eq(student.id, studentId));
  return { success: true };
};
