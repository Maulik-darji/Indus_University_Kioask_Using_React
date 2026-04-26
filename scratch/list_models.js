
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyC4N54xGAt5eBOeJwR-fzelhv4DR0WHv_A";

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There isn't a direct listModels in the JS SDK? 
    // Actually, we can use fetch to the models endpoint.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

listModels();
