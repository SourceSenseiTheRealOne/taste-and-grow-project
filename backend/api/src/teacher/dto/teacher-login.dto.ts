import { IsEmail, IsString } from 'class-validator';

export class TeacherLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

