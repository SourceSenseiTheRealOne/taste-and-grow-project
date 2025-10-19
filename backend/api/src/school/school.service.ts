import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { generateSchoolAccessCode, generateParentsLink } from '../common/utils/code-generator';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  /**
   * Register a new school and link it to the authenticated user
   */
  async registerSchool(userId: string, registerSchoolDto: RegisterSchoolDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a school
    if (user.schoolId) {
      throw new ConflictException('User already has a registered school');
    }

    // Create the school
    const school = await this.prisma.school.create({
      data: {
        schoolName: registerSchoolDto.schoolName,
        cityRegion: registerSchoolDto.cityRegion,
        contactName: registerSchoolDto.contactName,
        email: registerSchoolDto.email || null,
        phone: registerSchoolDto.phone || null,
        studentCount: registerSchoolDto.studentCount || null,
        schoolCode: generateSchoolAccessCode(registerSchoolDto.schoolName),
      },
    });

    // Generate unique access code and parents link
    const schoolAccessCode = generateSchoolAccessCode(school.id);
    const parentsLink = generateParentsLink(userId, school.id);

    // Update user with school relationship and generated codes
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        schoolId: school.id,
        schoolAccessCode,
        parentsLink,
      },
      include: { school: true },
    });

    return {
      school,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        schoolAccessCode: updatedUser.schoolAccessCode,
        parentsLink: updatedUser.parentsLink,
      },
    };
  }

  /**
   * Admin: Create a new school
   */
  async create(userId: string, createSchoolDto: CreateSchoolDto) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create schools');
    }

    const school = await this.prisma.school.create({
      data: {
        ...createSchoolDto,
        schoolCode: generateSchoolAccessCode(createSchoolDto.schoolName),
      },
    });

    return school;
  }

  /**
   * Get all schools (public for dashboard access)
   * Note: In production, this should require admin authentication
   */
  async findAll() {
    return this.prisma.school.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a specific school
   */
  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            schoolAccessCode: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  /**
   * Get school by access code
   */
  async findByAccessCode(accessCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { schoolAccessCode: accessCode },
      include: { school: true },
    });

    if (!user || !user.school) {
      throw new NotFoundException('School not found with this access code');
    }

    return user.school;
  }

  /**
   * Admin: Update a school
   */
  async update(userId: string, id: string, updateSchoolDto: UpdateSchoolDto) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update schools');
    }

    await this.findOne(id); // Check if exists

    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
    });
  }

  /**
   * Admin: Delete a school
   */
  async remove(userId: string, id: string) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete schools');
    }

    await this.findOne(id); // Check if exists

    return this.prisma.school.delete({
      where: { id },
    });
  }
}

