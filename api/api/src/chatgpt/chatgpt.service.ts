import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResponse {
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  topic: string;
}

@Injectable()
export class ChatGptService {
  private readonly logger = new Logger(ChatGptService.name);
  private readonly openai: OpenAI | null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com/v1';
    
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables. Running in fallback mode.');
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
      });
    }
  }

  async generateQuiz(topic: string, ageGroup: string = '5-8', difficulty: 'easy' | 'medium' | 'hard' = 'easy'): Promise<QuizResponse> {
    // If no OpenAI client is available, use fallback immediately
    if (!this.openai) {
      this.logger.log(`Using fallback quiz for topic: ${topic}, age: ${ageGroup}, difficulty: ${difficulty}`);
      return this.getFallbackQuiz(topic, ageGroup, difficulty);
    }

    try {
      const defaultPrompt = this.buildQuizPrompt(topic, ageGroup, difficulty);
      
      this.logger.log(`Generating quiz for topic: ${topic}, age: ${ageGroup}, difficulty: ${difficulty}`);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating engaging quizzes for children. You create age-appropriate, fun, and educational quiz content that helps children learn about various topics in an interactive way.'
          },
          {
            role: 'user',
            content: defaultPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const quizData = JSON.parse(response);
      
      this.logger.log('Quiz generated successfully');
      return quizData;

    } catch (error) {
      this.logger.error('Error generating quiz:', error);
      
      // Return a fallback quiz if API fails
      return this.getFallbackQuiz(topic, ageGroup, difficulty);
    }
  }

  private buildQuizPrompt(topic: string, ageGroup: string, difficulty: string): string {
    return `Create a fun and educational quiz about "${topic}" for children aged ${ageGroup} with ${difficulty} difficulty level.

Please generate a quiz with the following structure:
- 5 multiple choice questions
- Each question should have 4 answer options (A, B, C, D)
- Include a correct answer index (0-3)
- Add a simple explanation for each answer
- Make it engaging and age-appropriate
- Use simple language that children can understand
- Include fun facts or interesting information

Return the response as a JSON object with this exact structure:
{
  "title": "Fun Quiz About [Topic]",
  "description": "A brief description of what children will learn",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct and what children can learn"
    }
  ],
  "difficulty": "${difficulty}",
  "ageGroup": "${ageGroup}",
  "topic": "${topic}"
}

Make sure the quiz is educational, fun, and appropriate for the specified age group.`;
  }

  private getFallbackQuiz(topic: string, ageGroup: string, difficulty: string): QuizResponse {
    this.logger.log('Using fallback quiz due to API error');
    
    return {
      title: `Fun Quiz About ${topic}`,
      description: `Learn about ${topic} in a fun and interactive way!`,
      questions: [
        {
          question: `What is ${topic}?`,
          options: [
            'A type of fruit',
            'A type of vegetable', 
            'A type of plant',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: `Great question! ${topic} can be many different things, and it's fun to learn about all the different types!`
        },
        {
          question: `Why is ${topic} important for our health?`,
          options: [
            'It gives us energy',
            'It helps us grow strong',
            'It tastes delicious',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: `${topic} is amazing because it does all these things - it gives us energy, helps us grow, and tastes great too!`
        },
        {
          question: `How many different colors can ${topic} come in?`,
          options: [
            'Just one color',
            'Two colors',
            'Many different colors',
            'No colors at all'
          ],
          correctAnswer: 2,
          explanation: `${topic} comes in so many beautiful colors! Nature is full of variety and surprises.`
        },
        {
          question: `When is the best time to enjoy ${topic}?`,
          options: [
            'Only in the morning',
            'Only at night',
            'Any time of day',
            'Only on weekends'
          ],
          correctAnswer: 2,
          explanation: `You can enjoy ${topic} anytime! It's always a good time to eat healthy and delicious food.`
        },
        {
          question: `What should you do with ${topic} before eating it?`,
          options: [
            'Wash it',
            'Cook it',
            'Peel it',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: `It's important to prepare ${topic} properly by washing, and sometimes cooking or peeling, depending on the type!`
        }
      ],
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      ageGroup: ageGroup,
      topic: topic
    };
  }

  async generateFunFacts(topic: string, count: number = 5): Promise<string[]> {
    // If no OpenAI client is available, use fallback immediately
    if (!this.openai) {
      this.logger.log(`Using fallback fun facts for topic: ${topic}, count: ${count}`);
      return this.getFallbackFacts(topic, count);
    }

    try {
      const prompt = `Generate ${count} fun and educational facts about "${topic}" for children aged 5-8. Make them interesting, easy to understand, and engaging. Return only the facts as a JSON array of strings.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating fun, educational content for children. Create engaging facts that are age-appropriate and help children learn.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const facts = JSON.parse(response);
      this.logger.log(`Generated ${facts.length} fun facts about ${topic}`);
      return facts;

    } catch (error) {
      this.logger.error('Error generating fun facts:', error);
      
      // Return fallback facts
      return this.getFallbackFacts(topic, count);
    }
  }

  private getFallbackFacts(topic: string, count: number): string[] {
    const baseFacts = [
      `${topic} is amazing and full of surprises!`,
      `Did you know that ${topic} comes in many different shapes and sizes?`,
      `${topic} is great for your health and helps you grow strong!`,
      `Children all around the world love to learn about ${topic}!`,
      `${topic} has been around for a very long time and has many interesting stories!`,
      `${topic} is one of nature's wonderful gifts to us!`,
      `Learning about ${topic} can be so much fun!`,
      `${topic} teaches us about the amazing world around us!`,
      `Every ${topic} has its own special story to tell!`,
      `${topic} helps us understand how nature works!`
    ];

    // Return the requested number of facts, cycling through the base facts if needed
    return baseFacts.slice(0, Math.min(count, baseFacts.length));
  }
}
