-- CreateEnum for UserRole
CREATE TYPE "UserRole" AS ENUM ('TEACHER', 'COORDINATOR', 'PRINCIPAL', 'ADMIN', 'USER');

-- AlterTable users - Add new columns
ALTER TABLE "users" 
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER',
  ADD COLUMN "preferred_language" TEXT DEFAULT 'en',
  ADD COLUMN "school_id" TEXT,
  ADD COLUMN "school_access_code" TEXT,
  ADD COLUMN "parents_link" TEXT,
  ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable schools - Rename and add columns
ALTER TABLE "schools"
  RENAME COLUMN "name" TO "school_name";

ALTER TABLE "schools"
  ADD COLUMN "city_region" TEXT NOT NULL DEFAULT 'Unknown',
  ADD COLUMN "contact_name" TEXT NOT NULL DEFAULT 'Unknown',
  ADD COLUMN "student_count" INTEGER,
  ADD COLUMN "school_code" TEXT NOT NULL DEFAULT gen_random_uuid(),
  ALTER COLUMN "school_name" SET DEFAULT 'Unnamed School',
  ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Remove old columns from schools (if they exist)
ALTER TABLE "schools"
  DROP COLUMN IF EXISTS "address",
  DROP COLUMN IF EXISTS "city",
  DROP COLUMN IF EXISTS "country";

-- AlterTable teachers
ALTER TABLE "teachers"
  ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_school_id_idx" ON "users"("school_id");
CREATE INDEX IF NOT EXISTS "teachers_school_id_idx" ON "teachers"("school_id");

-- CreateUniqueIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_school_access_code_key" ON "users"("school_access_code");
CREATE UNIQUE INDEX IF NOT EXISTS "users_parents_link_key" ON "users"("parents_link");
CREATE UNIQUE INDEX IF NOT EXISTS "schools_school_code_key" ON "schools"("school_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

