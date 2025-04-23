CREATE TABLE "coordinator_faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"coordinator_id" integer NOT NULL,
	"faculty_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coordinator_faculty" ADD CONSTRAINT "coordinator_faculty_coordinator_id_faculty_id_fk" FOREIGN KEY ("coordinator_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "coordinator_faculty" ADD CONSTRAINT "coordinator_faculty_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE cascade;