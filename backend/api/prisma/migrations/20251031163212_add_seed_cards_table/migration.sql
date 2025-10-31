-- CreateEnum
CREATE TYPE "SeedStatus" AS ENUM ('Heritage', 'AtRisk', 'Endangered', 'Lost');

-- CreateEnum
CREATE TYPE "SeedEra" AS ENUM ('Heritage', 'Ancestral', 'Millennial');

-- CreateEnum
CREATE TYPE "SeedRarity" AS ENUM ('Common', 'Rare', 'Legendary');

-- CreateTable
CREATE TABLE "seed_cards" (
    "id" TEXT NOT NULL,
    "seed_id" TEXT NOT NULL,
    "common_name" TEXT NOT NULL,
    "scientific" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "status" "SeedStatus" NOT NULL,
    "era" "SeedEra" NOT NULL,
    "rarity" "SeedRarity" NOT NULL,
    "age_years" INTEGER NOT NULL,
    "story" TEXT NOT NULL,
    "taste_profile" JSONB NOT NULL,
    "images" TEXT[],
    "sources" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seed_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seed_cards_seed_id_key" ON "seed_cards"("seed_id");

-- CreateIndex
CREATE INDEX "seed_cards_featured_active_idx" ON "seed_cards"("featured", "active");

-- CreateIndex
CREATE INDEX "seed_cards_status_idx" ON "seed_cards"("status");

-- CreateIndex
CREATE INDEX "seed_cards_order_idx" ON "seed_cards"("order");
