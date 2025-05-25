import { db } from './db';
import { eq, inArray } from 'drizzle-orm/expressions';
import { faculty, mentorStudent, student, evaluatorStudent, user, SelectStudent } from './schema';

export interface MarksType {
  posterOrganization: number;
  dayToDayActivity: number;
  contributionToWork: number;
  learningOutcomes: number;
  geoTagPhotos: number;
  reportOrganization: number;
  certificate: number;
  learningExplanation: number;
  problemIdentification: number;
  contributionExplanation: number;
  proposedSolution: number;
  presentationSkills: number;
  qnaViva: number;
}

export const getMentoredStudents = async (facultyId: string) => {
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
  const result = await db
    .select({ student })
    .from(student)
    .innerJoin(user, eq(student.userId, user.id))
    .where(inArray(student.id, ids))
    .orderBy(student.rollNumber);

  const students_data: SelectStudent[] = result.map((row) => row.student);

  return students_data;
};

export const getEvaluatedStudents = async (facultyId: string) => {
  // Fetch the faculty ID based on the user ID
  const fac_id_result = await db.select({ id: faculty.id }).from(faculty).where(eq(faculty.userId, facultyId)).limit(1);

  if (fac_id_result.length === 0) {
    throw new Error('Faculty not found');
  }

  const fac_id = fac_id_result[0].id;

  const stu_ids = await db
    .select({ id: evaluatorStudent.studentId })
    .from(evaluatorStudent)
    .where(eq(evaluatorStudent.evaluatorId, fac_id));

  const ids = stu_ids.map((stud) => stud.id);

  const result = await db
    .select({ student })
    .from(student)
    .innerJoin(user, eq(student.userId, user.id))
    .where(inArray(student.id, ids))
    .orderBy(student.rollNumber);

  const students_data: SelectStudent[] = result.map((row) => row.student);

  // students_data.forEach((student) => {
  //   student.image = '/images/user/user-17.jpg'; // Static image path
  //   student.ngoStatus = student.ngoChosen ? 'active' : 'pending'; // NGO status
  // });
  return students_data;
};

export const updateInternalMarks = async (studentId: number, marks: MarksType) => {
  const total_marks =
    marks.posterOrganization +
    marks.dayToDayActivity +
    marks.contributionToWork +
    marks.learningOutcomes +
    marks.geoTagPhotos +
    marks.reportOrganization +
    marks.certificate;
  if (total_marks >= 50) {
    return { success: false, message: 'Total marks cannot exceed 50' };
  }
  await db
    .update(student)
    .set({
      posterOrganization: marks.posterOrganization,
      dayToDayActivity: marks.dayToDayActivity,
      contributionToWork: marks.contributionToWork,
      learningOutcomes: marks.learningOutcomes,
      geotagPhotos: marks.geoTagPhotos,
      reportOrganization: marks.reportOrganization,
      hardCopyCertificate: marks.certificate,
      internal_evaluation_marks: total_marks,
    })
    .where(eq(student.id, studentId));

  return { success: true };
};

export const updateFinalMarks = async (studentId: number, marks: MarksType) => {
  const total_marks =
    marks.learningExplanation +
    marks.problemIdentification +
    marks.contributionExplanation +
    marks.proposedSolution +
    marks.presentationSkills +
    marks.qnaViva;
  if (total_marks >= 50) {
    return { success: false, message: 'Total marks cannot exceed 50' };
  }

  await db
    .update(student)
    .set({
      learningExplanation: marks.learningExplanation,
      problemIndentification: marks.problemIdentification,
      contributionExplanation: marks.contributionExplanation,
      proposedSolutionExplanation: marks.proposedSolution,
      presentationSkill: marks.presentationSkills,
      qnaMarks: marks.qnaViva,
    })
    .where(eq(student.id, studentId));
  return { success: true };
};

export const checkAdmin = async (facultyId: string) => {
  const adminids = await db.select({ id: user.id }).from(user).where(eq(user.role, 'admin'));

  const isAdmin = adminids.some((admin) => admin.id === facultyId);
  return isAdmin;
};

export const checkCoord = async (facultyId: string) => {
  const coordids = await db.select({ id: user.id }).from(user).where(eq(user.role, 'coordinator'));

  const isCoord = coordids.some((coord) => coord.id === facultyId);
  return isCoord;
};
