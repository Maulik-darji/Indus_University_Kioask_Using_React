
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Using the new key provided
const apiKey = "AIzaSyC4N54xGAt5eBOeJwR-fzelhv4DR0WHv_A";
console.log('Testing with New Key:', apiKey);

async function testModels() {
  const models = [
    'gemini-3.1-flash',
    'gemini-3.1-flash-lite',
    'gemini-1.5-flash'
  ];

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelId of models) {
    try {
      console.log(`Testing model: ${modelId}...`);
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      console.log(`✅ Success with ${modelId}:`, response.text().substring(0, 50));
      process.exit(0);
    } catch (e) {
      console.log(`❌ Failed with ${modelId}:`, e.message);
    }
  }
  process.exit(1);
}

testModels();
