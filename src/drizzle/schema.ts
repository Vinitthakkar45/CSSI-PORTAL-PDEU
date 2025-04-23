import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
});

export const student = pgTable('student', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),

  //personal details
  rollNumber: text('roll_number'),
  name: text('name'),
  department: text('department'),
  division: text('division'),
  groupNumber: text('group_number'),
  email: text('email'),
  contactNumber: text('contact_number'),
  profileImage: text('profile_image'),

  //ngo details
  ngoName: text('ngo_name'),
  ngoCity: text('ngo_city'),
  ngoDistrict: text('ngo_district'),
  ngoState: text('ngo_state'),
  ngoCountry: text('ngo_country'),
  ngoAddress: text('ngo_address'),
  ngoNatureOfWork: text('ngo_nature_of_work'),
  ngoEmail: text('ngo_email'),
  ngoPhone: text('ngo_phone'),

  // Project Details
  problemDefinition: text('problem_definition'),
  proposedSolution: text('proposed_solution'),

  // Status Fields
  ngoChosen: boolean('ngo_chosen').default(false),
  stage: integer('stage').default(0),
  internal_evaluation_marks: integer('internal_evaluation_marks'),
  final_evaluation_marks: integer('final_evaluation_marks'),
  report: text('report'),
  certificate: text('certificate'),
  poster: text('poster'),
  offerLetter: text('offerletter'),
  week_one_photo: text('week_one_photo'),
  week_two_photo: text('week_two_photo'),

  // Faculty Mentor Evaluation Fields

  // Poster Organization
  posterOrganization: integer('poster_organization'),
  dayToDayActivity: integer('day_to_day_activity'),
  contributionToWork: integer('contribution_to_work'),
  learningOutcomes: integer('learning_outcomes'),
  geotagPhotos: integer('geotag_photos'),
  // Report Organization, Certificate
  reportOrganization: integer('report_organization'),
  hardCopyCertificate: integer('hard_copy_certificate'),

  // Faculty Evaluator Evaluation Fields

  // Presentation
  learningExplanation: integer('learning_explanation'),
  problemIndentification: integer('problem_ indentification'),
  contributionExplanation: integer('contribution_explanation'),
  proposedSolutionExplanation: integer('proposed_solution_explanation'),
  presentationSkill: integer('presentation_skill'),

  // QnA
  qnaMarks: integer('qna_marks'),
});

export const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  name: text('name'),
  department: text('department'),
  sitting: text('sitting'),
  freeTimeSlots: text('free_time_slots')
    .array()
    .default(sql`ARRAY[]::text[]`),
  profileImage: text('profile_image'),
});

export const mentorStudent = pgTable('mentor_student', {
  id: serial('id').primaryKey(),
  mentorId: integer('mentor_id')
    .notNull()
    .references(() => faculty.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  studentId: integer('student_id')
    .notNull()
    .references(() => student.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
});

export const evaluatorStudent = pgTable('evaluator_student', {
  id: serial('id').primaryKey(),
  evaluatorId: integer('evaluator_id')
    .notNull()
    .references(() => faculty.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  studentId: integer('student_id')
    .notNull()
    .references(() => student.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
});

export const stage = pgTable('stage', {
  id: serial('id').primaryKey(),
  year: integer('year').notNull(),
  stage: integer('stage').notNull(),
});

export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;
export type InsertStudent = typeof student.$inferInsert;
export type SelectStudent = typeof student.$inferSelect;
export type InsertFaculty = typeof faculty.$inferInsert;
export type SelectFaculty = typeof faculty.$inferSelect;
export type InsertMentorStudent = typeof mentorStudent.$inferInsert;
export type SelectMentorStudent = typeof mentorStudent.$inferSelect;
export type InsertEvaluatorStudent = typeof evaluatorStudent.$inferInsert;
export type SelectEvaluatorStudent = typeof evaluatorStudent.$inferSelect;
export type InsertStage = typeof stage.$inferInsert;
export type SelectStage = typeof stage.$inferSelect;
