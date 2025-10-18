import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherLoginDto } from './dto/teacher-login.dto';

@Injectable()
export class TeacherService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createTeacherDto: CreateTeacherDto) {
    const { email, password, name, schoolId } = createTeacherDto;

    // Check if teacher already exists
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      throw new ConflictException('Teacher with this email already exists');
    }

    // Check if school exists
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    const teacher = await this.prisma.teacher.create({
      data: {
        email,
        name,
        password: hashedPassword,
        schoolId,
      },
      include: {
        school: true,
      },
    });

    // Generate JWT token
    const token = this.generateToken(teacher.id, teacher.email);

    return {
      teacher: {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
        school: teacher.school,
      },
      token,
    };
  }

  async login(loginDto: TeacherLoginDto) {
    const { email, password } = loginDto;

    // Find teacher by email
    const teacher = await this.prisma.teacher.findUnique({
      where: { email },
      include: {
        school: true,
      },
    });

    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(teacher.id, teacher.email);

    return {
      teacher: {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
        school: teacher.school,
      },
      token,
    };
  }

  private generateToken(teacherId: string, email: string): string {
    const payload = { sub: teacherId, email, type: 'teacher' };
    return this.jwtService.sign(payload);
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const { email, password, name, schoolId } = createTeacherDto;

    // Check if teacher already exists
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      throw new ConflictException('Teacher with this email already exists');
    }

    // Check if school exists
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    const teacher = await this.prisma.teacher.create({
      data: {
        email,
        name,
        password: hashedPassword,
        schoolId,
      },
      include: {
        school: true,
      },
    });

    // Return teacher without password
    const { password: _, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword;
  }

  async findAll() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        school: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Remove passwords from response
    return teachers.map(({ password, ...teacher }) => teacher);
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        school: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Return teacher without password
    const { password: _, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(id); // Check if exists

    const updateData: any = { ...updateTeacherDto };

    // Hash password if provided
    if (updateTeacherDto.password) {
      updateData.password = await bcrypt.hash(updateTeacherDto.password, 10);
    }

    // Check if school exists if schoolId is provided
    if ('schoolId' in updateTeacherDto && updateTeacherDto.schoolId) {
      const school = await this.prisma.school.findUnique({
        where: { id: updateTeacherDto.schoolId },
      });

      if (!school) {
        throw new NotFoundException('School not found');
      }
    }

    const teacher = await this.prisma.teacher.update({
      where: { id },
      data: updateData,
      include: {
        school: true,
      },
    });

    // Return teacher without password
    const { password: _, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    const teacher = await this.prisma.teacher.delete({
      where: { id },
    });

    // Return teacher without password
    const { password: _, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword;
  }
}

