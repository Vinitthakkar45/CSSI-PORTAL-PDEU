ALTER TABLE "evaluator_student" DROP CONSTRAINT "evaluator_student_evaluator_id_faculty_user_id_fk";
--> statement-breakpoint
ALTER TABLE "evaluator_student" DROP CONSTRAINT "evaluator_student_student_id_student_user_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_student" DROP CONSTRAINT "mentor_student_mentor_id_faculty_user_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_student" DROP CONSTRAINT "mentor_student_student_id_student_user_id_fk";
--> statement-breakpoint
ALTER TABLE "student" DROP CONSTRAINT "student_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_evaluator_id_faculty_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "evaluator_student" ADD CONSTRAINT "evaluator_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_mentor_id_faculty_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_student" ADD CONSTRAINT "mentor_student_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;