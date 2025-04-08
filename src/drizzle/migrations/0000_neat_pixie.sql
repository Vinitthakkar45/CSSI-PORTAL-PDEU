CREATE TABLE "evaluator_student" (
	"id" serial PRIMARY KEY NOT NULL,
	"evaluator_id" integer NOT NULL,
	"student_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text,
	"department" text,
	"sitting" text,
	"free_time_slots" text[] DEFAULT ARRAY[]::text[],
	CONSTRAINT "faculty_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "mentor_student" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"student_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stage" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"stage" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"roll_number" text,
	"name" text,
	"department" text,
	"division" text,
	"group_number" text,
	"email" text,
	"contact_number" text,
	"profile_image" text,
	"ngo_name" text,
	"ngo_city" text,
	"ngo_district" text,
	"ngo_state" text,
	"ngo_country" text,
	"ngo_address" text,
	"ngo_nature_of_work" text,
	"ngo_email" text,
	"ngo_phone" text,
	"problem_definition" text,
	"proposed_solution" text,
	"ngo_chosen" boolean DEFAULT false,
	"stage" integer DEFAULT 0,
	"internal_evaluation_marks" integer,
	"final_evaluation_marks" integer,
	"report" text,
	"certificate" text,
	"poster" text,
	"offer_letter" text,
	CONSTRAINT "student_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_evaluator_id_faculty_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_mentor_id_faculty_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;