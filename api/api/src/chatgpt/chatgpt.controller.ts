import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { ChatGptService, QuizResponse } from './chatgpt.service';

export class GenerateQuizDto {
  topic: string;
  ageGroup?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class GenerateFunFactsDto {
  topic: string;
  count?: number;
}

@Controller('chatgpt')
export class ChatGptController {
  private readonly logger = new Logger(ChatGptController.name);

  constructor(private readonly chatGptService: ChatGptService) {}

  @Post('generate-quiz')
  async generateQuiz(@Body() generateQuizDto: GenerateQuizDto): Promise<QuizResponse> {
    this.logger.log(`Received quiz generation request for topic: ${generateQuizDto.topic}`);
    
    const { topic, ageGroup = '5-8', difficulty = 'easy' } = generateQuizDto;
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    return await this.chatGptService.generateQuiz(topic, ageGroup, difficulty);
  }

  @Post('generate-fun-facts')
  async generateFunFacts(@Body() generateFunFactsDto: GenerateFunFactsDto): Promise<{ facts: string[] }> {
    this.logger.log(`Received fun facts generation request for topic: ${generateFunFactsDto.topic}`);
    
    const { topic, count = 5 } = generateFunFactsDto;
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    const facts = await this.chatGptService.generateFunFacts(topic, count);
    
    return { facts };
  }

  @Get('health')
  async healthCheck(): Promise<{ status: string; message: string; mode: string }> {
    const hasApiKey = !!this.chatGptService['openai'];
    return {
      status: 'ok',
      message: hasApiKey ? 'ChatGPT service is running with OpenAI API' : 'ChatGPT service is running in fallback mode',
      mode: hasApiKey ? 'openai' : 'fallback'
    };
  }
}
