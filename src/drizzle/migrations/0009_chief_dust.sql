-- Drop the old single-column unique on email (same email allowed in different academic years)
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
-- Add academic_year column (NULL = admin; "2024-2025" / "2025-2026" etc. for everyone else)
ALTER TABLE "user" ADD COLUMN "academic_year" text;--> statement-breakpoint
-- Backfill: all existing non-admin users belong to the 2024-2025 batch
UPDATE "user" SET "academic_year" = '2024-2025' WHERE "role" != 'admin';--> statement-breakpoint
-- New composite unique: one account per email per academic year
ALTER TABLE "user" ADD CONSTRAINT "user_email_year_unique" UNIQUE("email","academic_year");
