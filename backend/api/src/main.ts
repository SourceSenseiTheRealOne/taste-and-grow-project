import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with detailed configuration
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: isDevelopment
      ? true // Allow all origins in development (includes localhost:8081 and any other port)
      : [
          'https://taste-and-grow-project-1.onrender.com', // Production backend
          'https://semente-do-sabor.vercel.app', // Production frontend (Portuguese website)
          /\.vercel\.app$/, // All Vercel deployments (includes previews)
          // Add your production frontend URLs here
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours - cache preflight requests
  });
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
