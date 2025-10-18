import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SchoolModule } from './school/school.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [PrismaModule, AuthModule, SchoolModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
