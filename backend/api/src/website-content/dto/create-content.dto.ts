import { IsString, IsEnum, IsOptional, IsInt, IsBoolean, IsObject } from 'class-validator';

export enum ContentType {
  HERO = 'HERO',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  FOOD_KIT = 'FOOD_KIT',
  TESTIMONIAL = 'TESTIMONIAL',
  FAQ = 'FAQ',
  FOOTER = 'FOOTER',
  SEO = 'SEO',
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

