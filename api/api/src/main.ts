import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for dashboard communication
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite default port
      'http://localhost:3001', // API port
      'http://localhost:8080', // Dashboard port
      'http://localhost:3000', // Common React port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Create admin user on startup
  const authService = app.get(AuthService);
  await authService.createAdminUser();
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 API Server running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
