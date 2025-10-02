// ChatGPT API service for generating fun facts
// This is a mock implementation for development purposes

interface ChatGptResponse {
  facts: string[];
  success: boolean;
  error?: string;
}

interface ChatGptRequest {
  prompt: string;
  fruitName?: string;
  scientificName?: string;
  sceneCount?: number;
}

export class ChatGptService {
  private static readonly API_KEY = import.meta.env.VITE_CHATGPT_API_KEY || '';
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  static async generateFunFacts(request: ChatGptRequest): Promise<ChatGptResponse> {
    // For development, return mock data
    // In production, replace this with actual ChatGPT API call
    
    if (!this.API_KEY) {
      console.warn('ChatGPT API key not found. Using mock data.');
      return this.getMockResponse(request);
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an educational content creator specializing in fun facts about fruits and vegetables for children aged 5-8. Generate engaging, age-appropriate facts that are both educational and entertaining.'
            },
            {
              role: 'user',
              content: this.buildPrompt(request)
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Parse the response to extract individual facts
      const facts = this.parseFactsFromResponse(content);
      
      return {
        facts,
        success: true,
      };
    } catch (error) {
      console.error('ChatGPT API error:', error);
      return this.getMockResponse(request);
    }
  }

  private static buildPrompt(request: ChatGptRequest): string {
    const { prompt, fruitName, scientificName, sceneCount } = request;
    
    let basePrompt = prompt;
    
    if (fruitName) {
      basePrompt += `\n\nFruit/Vegetable: ${fruitName}`;
    }
    
    if (scientificName) {
      basePrompt += `\nScientific Name: ${scientificName}`;
    }
    
    if (sceneCount) {
      basePrompt += `\nNumber of scenes: ${sceneCount}`;
    }
    
    basePrompt += '\n\nPlease provide exactly 5 fun facts, each on a new line, suitable for children aged 5-8. Make them engaging and educational.';
    
    return basePrompt;
  }

  private static parseFactsFromResponse(content: string): string[] {
    // Split by newlines and clean up the facts
    const facts = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering
      .map(line => line.replace(/^[-*]\s*/, '')) // Remove bullet points
      .filter(line => line.length > 10) // Filter out very short lines
      .slice(0, 5); // Limit to 5 facts
    
    return facts;
  }

  private static getMockResponse(request: ChatGptRequest): ChatGptResponse {
    const { fruitName = 'this fruit', scientificName } = request;
    
    const mockFacts = [
      `${fruitName} is packed with vitamins and minerals that help kids grow strong and healthy!`,
      `The scientific name ${scientificName || 'of this fruit'} tells us about its family and characteristics.`,
      `Children love the sweet taste of ${fruitName}, making it a perfect healthy snack!`,
      `${fruitName} grows best in sunny weather and needs lots of water to grow big and juicy.`,
      `The bright color of ${fruitName} comes from special nutrients called antioxidants that protect our bodies.`
    ];

    return {
      facts: mockFacts,
      success: true,
    };
  }
}

export default ChatGptService;
