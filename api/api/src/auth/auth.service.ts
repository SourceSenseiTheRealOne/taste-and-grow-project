import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, CreateUserDto } from './auth.dto';

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, role = 'user' } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in TypeORM
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: role as UserRole,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
      message: 'User registered successfully',
    };
  }

  async registerTeacher(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher user in TypeORM
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: UserRole.TEACHER,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
      message: 'Teacher user created successfully',
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password, role = 'user' } = createUserDto;

    // Validate role
    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in TypeORM
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: role as UserRole,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
      message: 'User created successfully',
    };
  }

  async createAdminUser() {
    const adminEmail = 'admin@kidsgame.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await this.userRepository.findOne({ 
      where: { email: adminEmail } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = this.userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    const savedAdmin = await this.userRepository.save(adminUser);
    console.log('Admin user created:', { email: adminEmail, password: adminPassword });
    
    return savedAdmin;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
