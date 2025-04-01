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
  rollNumber: text('roll_number').notNull(),
  name: text('name'),
  department: text('department'),
  ngoName: text('ngo_name'),
  ngoLocation: text('ngo_location'),
  ngoPhone: text('ngo_phone'),
  ngoDescription: text('ngo_description'),
  ngoChosen: boolean('ngo_chosen').default(false),
  stage: integer('stage').default(0),
  internal_evaluation_marks: integer('internal_evaluation_marks'),
  final_evaluation_marks: integer('final_evaluation_marks'),
  report: text('report'),
  certificate: text('certificate'),
  poster: text('poster'),
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
