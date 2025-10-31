-- DropIndex
DROP INDEX "public"."experiences_school_id_idx";

-- DropIndex
DROP INDEX "public"."school_activations_experience_id_idx";

-- DropIndex
DROP INDEX "public"."school_activations_school_id_idx";

-- DropIndex
DROP INDEX "public"."school_activations_status_idx";

-- DropIndex
DROP INDEX "public"."teachers_school_id_idx";

-- DropIndex
DROP INDEX "public"."users_email_idx";

-- DropIndex
DROP INDEX "public"."users_role_idx";

-- DropIndex
DROP INDEX "public"."users_school_id_idx";

-- AlterTable
ALTER TABLE "experiences" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "school_activations" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "school_code" DROP DEFAULT;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "website_content" ALTER COLUMN "updated_at" DROP DEFAULT;
