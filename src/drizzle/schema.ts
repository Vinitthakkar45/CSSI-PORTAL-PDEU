import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const student = pgTable('student', {
  id: serial('id').primaryKey(),
  rollNumber: text('roll_number').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  department: text('department'),
  ngoName: text('ngo_name'),
  ngoLocation: text('ngo_location'),
  ngoPhone: text('ngo_phone'),
  ngoDescription: text('ngo_description'),
});

export const mentorStudent = pgTable('mentor_student', {
  id: serial('id').primaryKey(),
  mentorId: integer('mentor_id')
    .notNull()
    .references(() => faculty.id),
  studentId: integer('student_id').references(() => student.id),
});

export const evaluatorStudent = pgTable('evaluator_student', {
  id: serial('id').primaryKey(),
  mentorId: integer('evaluator_id')
    .notNull()
    .references(() => faculty.id),
  studentId: integer('student_id').references(() => student.id),
});

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  department: text('department'),
  sitting: text('sitting'),
  freeTimeSlots: text('free_time_slots')
    .array()
    .default(sql`ARRAY[]::text[]`),
});

export type InsertStudent = typeof student.$inferInsert;
export type SelectStudent = typeof student.$inferSelect;
export type InsertMentorStudent = typeof mentorStudent.$inferInsert;
export type SelectMentorStudent = typeof mentorStudent.$inferSelect;
export type InsertEvaluatorStudent = typeof evaluatorStudent.$inferInsert;
export type SelectEvaluatorStudent = typeof evaluatorStudent.$inferSelect;
export type InsertAdmin = typeof admin.$inferInsert;
export type SelectAdmin = typeof admin.$inferSelect;
export type InsertFaculty = typeof faculty.$inferInsert;
export type SelectFaculty = typeof faculty.$inferSelect;
