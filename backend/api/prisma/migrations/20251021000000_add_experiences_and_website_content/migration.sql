-- CreateEnum for ContentType
CREATE TYPE "ContentType" AS ENUM ('HERO', 'HOW_IT_WORKS', 'FOOD_KIT', 'TESTIMONIAL', 'FAQ', 'FOOTER', 'SEO');

-- CreateTable for experiences
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DOUBLE PRECISION NOT NULL,
    "items_included" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable for school_activations
CREATE TABLE "school_activations" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "experience_id" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "fundraiser_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_raised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "parent_qr_code" TEXT NOT NULL,
    "teacher_qr_code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_activations_pkey" PRIMARY KEY ("id")
);

-- CreateTable for website_content
CREATE TABLE "website_content" (
    "id" TEXT NOT NULL,
    "section" "ContentType" NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experiences_school_id_idx" ON "experiences"("school_id");

-- CreateIndex
CREATE INDEX "school_activations_school_id_idx" ON "school_activations"("school_id");

-- CreateIndex
CREATE INDEX "school_activations_experience_id_idx" ON "school_activations"("experience_id");

-- CreateIndex
CREATE INDEX "school_activations_status_idx" ON "school_activations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "school_activations_parent_qr_code_key" ON "school_activations"("parent_qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "school_activations_teacher_qr_code_key" ON "school_activations"("teacher_qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "website_content_section_key_key" ON "website_content"("section", "key");

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_activations" ADD CONSTRAINT "school_activations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_activations" ADD CONSTRAINT "school_activations_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

