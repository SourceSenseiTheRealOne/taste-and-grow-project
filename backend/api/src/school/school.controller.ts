import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  /**
   * User registers a new school (user-specific endpoint)
   */
  @UseGuards(JwtAuthGuard)
  @Post('register')
  registerSchool(
    @Request() req,
    @Body(ValidationPipe) registerSchoolDto: RegisterSchoolDto,
  ) {
    return this.schoolService.registerSchool(req.user.id, registerSchoolDto);
  }

  /**
   * Admin: Create a new school
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body(ValidationPipe) createSchoolDto: CreateSchoolDto,
  ) {
    return this.schoolService.create(req.user.id, createSchoolDto);
  }

  /**
   * Get all schools (public for dashboard access)
   */
  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  /**
   * Get school by access code
   */
  @Get('access-code/:accessCode')
  findByAccessCode(@Param('accessCode') accessCode: string) {
    return this.schoolService.findByAccessCode(accessCode);
  }

  /**
   * Get specific school by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  /**
   * Admin: Update a school
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(req.user.id, id, updateSchoolDto);
  }

  /**
   * Admin: Delete a school
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.schoolService.remove(req.user.id, id);
  }
}

