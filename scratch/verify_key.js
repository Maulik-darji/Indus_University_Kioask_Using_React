
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Keys found in your .env files
const keys = {
  ".env": "AIzaSyAgt_85LbP0zSBVKyCa2-pp65ajb5fptoA",
  ".env.local": "AIzaSyAgt_85LbP0zSBVKyCa2-pp65ajb5fptoA"
};

async function verify() {
  console.log("--- KEY COMPARISON ---");
  for (const [file, key] of Object.entries(keys)) {
    console.log(`\nChecking key in ${file}...`);
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      console.log(`✅ [${file}] IS PERFECT! Google accepted it.`);
    } catch (err) {
      console.log(`❌ [${file}] IS INVALID: ${err.message}`);
    }
  }
  process.exit(0);
}

verify();
