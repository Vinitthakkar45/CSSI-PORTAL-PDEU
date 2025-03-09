CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "evaluator_student" (
	"id" serial PRIMARY KEY NOT NULL,
	"evaluator_id" integer NOT NULL,
	"student_id" integer
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"department" text,
	"sitting" text,
	"free_time_slots" text[] DEFAULT ARRAY[]::text[],
	CONSTRAINT "faculty_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mentor_student" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"student_id" integer
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"department" text,
	"ngo_name" text,
	"ngo_location" text,
	"ngo_phone" text,
	"ngo_description" text,
	CONSTRAINT "student_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_evaluator_id_faculty_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_mentor_id_faculty_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;