import { IsString, IsEnum, IsOptional, IsInt, IsBoolean, IsObject } from 'class-validator';

export enum ContentType {
  HERO = 'HERO',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  FOOD_KIT = 'FOOD_KIT',
  TESTIMONIAL = 'TESTIMONIAL',
  FAQ = 'FAQ',
  FOOTER = 'FOOTER',
  SEO = 'SEO',
  CINEMATIC_INTRO = 'CINEMATIC_INTRO',
  MISSION_ROLES = 'MISSION_ROLES',
  MISSION_CARDS = 'MISSION_CARDS',
  SEED_CARDS = 'SEED_CARDS',
  FINAL_CTA = 'FINAL_CTA',
}

export class CreateContentDto {
  @IsEnum(ContentType)
  section: ContentType;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

