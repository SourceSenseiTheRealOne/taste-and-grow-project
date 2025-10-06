// Simple test script for ChatGPT endpoint
// Using built-in fetch (Node.js 18+)

const API_BASE_URL = 'http://localhost:3001';

async function testChatGptEndpoint() {
  try {
    console.log('Testing ChatGPT Quiz Generation Endpoint...\n');

    // Test quiz generation
    const quizResponse = await fetch(`${API_BASE_URL}/chatgpt/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Strawberries',
        ageGroup: '5-8',
        difficulty: 'easy'
      })
    });

    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      console.log('✅ Quiz Generation Test Passed!');
      console.log('Quiz Title:', quizData.title);
      console.log('Number of Questions:', quizData.questions.length);
      console.log('First Question:', quizData.questions[0].question);
      console.log('Options:', quizData.questions[0].options);
      console.log('Correct Answer:', quizData.questions[0].correctAnswer);
      console.log('Explanation:', quizData.questions[0].explanation);
    } else {
      console.log('❌ Quiz Generation Test Failed:', quizResponse.status, quizResponse.statusText);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test fun facts generation
    const factsResponse = await fetch(`${API_BASE_URL}/chatgpt/generate-fun-facts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Apples',
        count: 3
      })
    });

    if (factsResponse.ok) {
      const factsData = await factsResponse.json();
      console.log('✅ Fun Facts Generation Test Passed!');
      console.log('Generated Facts:');
      factsData.facts.forEach((fact, index) => {
        console.log(`${index + 1}. ${fact}`);
      });
    } else {
      console.log('❌ Fun Facts Generation Test Failed:', factsResponse.status, factsResponse.statusText);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test health check
    const healthResponse = await fetch(`${API_BASE_URL}/chatgpt/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check Test Passed!');
      console.log('Status:', healthData.status);
      console.log('Message:', healthData.message);
    } else {
      console.log('❌ Health Check Test Failed:', healthResponse.status, healthResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure the API server is running on port 3001');
  }
}

testChatGptEndpoint();
