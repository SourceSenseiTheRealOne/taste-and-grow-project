-- Add new ContentType enum values for new website sections
-- This migration runs after the ContentType enum is created (after 20251021000000)
DO $$ 
BEGIN
    -- Check if ContentType enum exists first
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentType') THEN
        -- Check and add CINEMATIC_INTRO
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'CINEMATIC_INTRO' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ContentType')) THEN
            ALTER TYPE "ContentType" ADD VALUE 'CINEMATIC_INTRO';
        END IF;
        
        -- Check and add MISSION_ROLES
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'MISSION_ROLES' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ContentType')) THEN
            ALTER TYPE "ContentType" ADD VALUE 'MISSION_ROLES';
        END IF;
        
        -- Check and add MISSION_CARDS
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'MISSION_CARDS' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ContentType')) THEN
            ALTER TYPE "ContentType" ADD VALUE 'MISSION_CARDS';
        END IF;
        
        -- Check and add SEED_CARDS
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SEED_CARDS' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ContentType')) THEN
            ALTER TYPE "ContentType" ADD VALUE 'SEED_CARDS';
        END IF;
        
        -- Check and add FINAL_CTA
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'FINAL_CTA' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ContentType')) THEN
            ALTER TYPE "ContentType" ADD VALUE 'FINAL_CTA';
        END IF;
    END IF;
END $$;

