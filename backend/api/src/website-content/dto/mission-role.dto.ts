import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMissionRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  mission: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  bgColor?: string;
}

export class UpdateMissionRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  bgColor?: string;
}

