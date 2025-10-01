import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for dashboard communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Dashboard URLs
    credentials: true,
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
