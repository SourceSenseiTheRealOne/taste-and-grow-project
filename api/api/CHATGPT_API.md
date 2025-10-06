# ChatGPT API Endpoints

This document describes the ChatGPT API endpoints for generating educational content for kids.

## Base URL
```
http://localhost:3001/chatgpt
```

## Endpoints

### 1. Generate Quiz
**POST** `/generate-quiz`

Generates an educational quiz for children about a specific topic.

#### Request Body
```json
{
  "topic": "Strawberries",
  "ageGroup": "5-8",
  "difficulty": "easy"
}
```

#### Parameters
- `topic` (required): The subject of the quiz
- `ageGroup` (optional): Target age group (default: "5-8")
- `difficulty` (optional): Difficulty level - "easy", "medium", or "hard" (default: "easy")

#### Response
```json
{
  "title": "Fun Quiz About Strawberries",
  "description": "Learn about strawberries in a fun and interactive way!",
  "questions": [
    {
      "question": "What color are ripe strawberries?",
      "options": ["Green", "Blue", "Red", "Yellow"],
      "correctAnswer": 2,
      "explanation": "Ripe strawberries are bright red and ready to eat!"
    }
  ],
  "difficulty": "easy",
  "ageGroup": "5-8",
  "topic": "Strawberries"
}
```

### 2. Generate Fun Facts
**POST** `/generate-fun-facts`

Generates educational fun facts about a specific topic.

#### Request Body
```json
{
  "topic": "Apples",
  "count": 5
}
```

#### Parameters
- `topic` (required): The subject for fun facts
- `count` (optional): Number of facts to generate (default: 5)

#### Response
```json
{
  "facts": [
    "Apples are 25% air, which is why they float in water!",
    "There are over 7,500 different varieties of apples grown worldwide.",
    "Apple trees can live for over 100 years and still produce fruit."
  ]
}
```

### 3. Health Check
**GET** `/health`

Checks if the ChatGPT service is running.

#### Response
```json
{
  "status": "ok",
  "message": "ChatGPT service is running"
}
```

## Environment Variables

Create a `.env` file in the API root directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Testing

Run the test script to verify the endpoints:

```bash
node test-chatgpt.js
```

## Error Handling

The API includes fallback content generation if the OpenAI API is unavailable or returns an error. This ensures the service remains functional even without API access.

## Default Prompts

The service uses carefully crafted prompts optimized for children's education:

- **Quiz Generation**: Creates age-appropriate multiple-choice questions with explanations
- **Fun Facts**: Generates engaging, educational facts that spark curiosity
- **Language**: Uses simple, clear language suitable for the target age group
- **Content**: Focuses on educational value while maintaining fun and engagement
