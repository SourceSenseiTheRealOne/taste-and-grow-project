import { IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';

export enum UserRoleEnum {
  TEACHER = 'TEACHER',
  COORDINATOR = 'COORDINATOR',
  PRINCIPAL = 'PRINCIPAL',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}

