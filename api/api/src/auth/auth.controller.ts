import { Controller, Post, Body, UseGuards, Get, Request, Param, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, CreateUserDto } from './auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-teacher')
  async registerTeacher(@Body() registerDto: RegisterDto) {
    if (!registerDto.username) {
      throw new BadRequestException('Username is required');
    }
    return this.authService.registerTeacher(registerDto);
  }

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@Request() req) {
    return { valid: true, user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.authService.getUserByEmail(email);
  }
}
