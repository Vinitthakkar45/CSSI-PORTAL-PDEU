CREATE TABLE "announcement" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP,
	"year" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;