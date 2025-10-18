import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}

