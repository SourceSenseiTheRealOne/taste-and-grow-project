import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGptController } from './chatgpt.controller';
import { ChatGptService } from './chatgpt.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChatGptController],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
