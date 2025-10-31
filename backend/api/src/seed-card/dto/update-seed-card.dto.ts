import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum SeedStatus {
  Heritage = 'Heritage',
  AtRisk = 'At Risk',
  Endangered = 'Endangered',
  Lost = 'Lost',
}

enum SeedEra {
  Heritage = 'Heritage',
  Ancestral = 'Ancestral',
  Millennial = 'Millennial',
}

enum SeedRarity {
  Common = 'Common',
  Rare = 'Rare',
  Legendary = 'Legendary',
}

class TasteProfileDto {
  @IsNumber()
  @IsOptional()
  sweetness?: number;

  @IsNumber()
  @IsOptional()
  acidity?: number;

  @IsNumber()
  @IsOptional()
  complexity?: number;
}

export class UpdateSeedCardDto {
  @IsString()
  @IsOptional()
  seedId?: string;

  @IsString()
  @IsOptional()
  commonName?: string;

  @IsString()
  @IsOptional()
  scientific?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsEnum(SeedStatus)
  @IsOptional()
  status?: SeedStatus;

  @IsEnum(SeedEra)
  @IsOptional()
  era?: SeedEra;

  @IsEnum(SeedRarity)
  @IsOptional()
  rarity?: SeedRarity;

  @IsNumber()
  @IsOptional()
  ageYears?: number;

  @IsString()
  @IsOptional()
  story?: string;

  @ValidateNested()
  @Type(() => TasteProfileDto)
  @IsOptional()
  tasteProfile?: TasteProfileDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sources?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

