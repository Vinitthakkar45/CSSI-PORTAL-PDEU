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

export const updateInternalMarks = async (studentId: number, marks: MarksType, isAbsent: boolean = false) => {
  try {
    const total_marks = isAbsent
      ? 0
      : marks.posterOrganization +
        marks.dayToDayActivity +
        marks.contributionToWork +
        marks.learningOutcomes +
        marks.geoTagPhotos +
        marks.reportOrganization +
        marks.certificate;

    if (!isAbsent && total_marks > 50) {
      return { success: false, message: 'Total marks cannot exceed 50' };
    }

    await db
      .update(student)
      .set({
        posterOrganization: isAbsent ? 0 : marks.posterOrganization,
        dayToDayActivity: isAbsent ? 0 : marks.dayToDayActivity,
        contributionToWork: isAbsent ? 0 : marks.contributionToWork,
        learningOutcomes: isAbsent ? 0 : marks.learningOutcomes,
        geotagPhotos: isAbsent ? 0 : marks.geoTagPhotos,
        reportOrganization: isAbsent ? 0 : marks.reportOrganization,
        hardCopyCertificate: isAbsent ? 0 : marks.certificate,
        internal_evaluation_marks: total_marks,
        Absent_Mentor_Evaluation: isAbsent,
      })
      .where(eq(student.id, studentId));

    return { success: true };
  } catch (error) {
    console.error('Error updating internal marks:', error);
    throw error;
  }
};

export const updateFinalMarks = async (studentId: number, marks: MarksType, isAbsent: boolean = false) => {
  try {
    const total_marks = isAbsent
      ? 0
      : marks.learningExplanation +
        marks.problemIdentification +
        marks.contributionExplanation +
        marks.proposedSolution +
        marks.presentationSkills +
        marks.qnaViva;

    if (!isAbsent && total_marks > 50) {
      return { success: false, message: 'Total marks cannot exceed 50' };
    }

    await db
      .update(student)
      .set({
        learningExplanation: isAbsent ? 0 : marks.learningExplanation,
        problemIndentification: isAbsent ? 0 : marks.problemIdentification,
        contributionExplanation: isAbsent ? 0 : marks.contributionExplanation,
        proposedSolutionExplanation: isAbsent ? 0 : marks.proposedSolution,
        presentationSkill: isAbsent ? 0 : marks.presentationSkills,
        qnaMarks: isAbsent ? 0 : marks.qnaViva,
        final_evaluation_marks: total_marks,
        Absent_Evaluator_Evaluation: isAbsent,
      })
      .where(eq(student.id, studentId));

    return { success: true };
  } catch (error) {
    console.error('Error updating final marks:', error);
    throw error;
  }
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
