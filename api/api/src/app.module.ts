import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ChatGptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ChatGptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


