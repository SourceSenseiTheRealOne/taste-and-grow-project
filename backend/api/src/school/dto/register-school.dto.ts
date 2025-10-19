import { IsNotEmpty, IsString, IsOptional, IsInt, IsEmail, IsPhoneNumber } from 'class-validator';

export class RegisterSchoolDto {
  @IsNotEmpty()
  @IsString()
  schoolName: string;

  @IsNotEmpty()
  @IsString()
  cityRegion: string;

  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  studentCount?: number;
}
