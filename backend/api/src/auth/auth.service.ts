import { Injectable, UnauthorizedException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { generateSchoolAccessCode, generateParentsLink } from '../common/utils/code-generator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, role, preferredLanguage } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role - defaults to USER if not specified
    const userRole = role || 'USER';

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        role: userRole,
        preferredLanguage: preferredLanguage || 'en',
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        schoolId: user.schoolId,
        schoolAccessCode: user.schoolAccessCode,
        parentsLink: user.parentsLink,
      },
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        school: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      schoolId: user.schoolId,
      schoolAccessCode: user.schoolAccessCode,
      parentsLink: user.parentsLink,
    };
  }

  async getAllUsers() {
    // Fetch all users with their school information
    // Note: In production, this should require admin authentication
    const users = await this.prisma.user.findMany({
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
            schoolCode: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Remove password from response
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(
    requestingUserId: string,
    targetUserId: string,
    updateDto: Partial<RegisterDto>,
  ) {
    // Check if requesting user is admin
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update users');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Prepare update data
    const updateData: any = {};

    if (updateDto.name) updateData.name = updateDto.name;
    if (updateDto.email) updateData.email = updateDto.email;
    if (updateDto.phone !== undefined) updateData.phone = updateDto.phone;
    if (updateDto.role) updateData.role = updateDto.role;
    if (updateDto.preferredLanguage) updateData.preferredLanguage = updateDto.preferredLanguage;

    // Only update password if provided
    if (updateDto.password) {
      updateData.password = await bcrypt.hash(updateDto.password, 10);
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
            schoolCode: true,
          },
        },
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(requestingUserId: string, targetUserId: string) {
    // Check if requesting user is admin
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete users');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent admin from deleting themselves
    if (requestingUserId === targetUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id: targetUserId },
    });

    return { message: 'User deleted successfully' };
  }
}

