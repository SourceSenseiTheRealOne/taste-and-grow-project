import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, ValidateNested } from 'class-validator';
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
  @IsNotEmpty()
  sweetness: number;

  @IsNumber()
  @IsNotEmpty()
  acidity: number;

  @IsNumber()
  @IsNotEmpty()
  complexity: number;
}

export class CreateSeedCardDto {
  @IsString()
  @IsNotEmpty()
  seedId: string;

  @IsString()
  @IsNotEmpty()
  commonName: string;

  @IsString()
  @IsNotEmpty()
  scientific: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsEnum(SeedStatus)
  @IsNotEmpty()
  status: SeedStatus;

  @IsEnum(SeedEra)
  @IsNotEmpty()
  era: SeedEra;

  @IsEnum(SeedRarity)
  @IsNotEmpty()
  rarity: SeedRarity;

  @IsNumber()
  @IsNotEmpty()
  ageYears: number;

  @IsString()
  @IsNotEmpty()
  story: string;

  @ValidateNested()
  @Type(() => TasteProfileDto)
  @IsNotEmpty()
  tasteProfile: TasteProfileDto;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

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

