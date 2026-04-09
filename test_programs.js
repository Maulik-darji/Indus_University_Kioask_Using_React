// Test script to verify program data structure
const fs = require('fs');
const path = require('path');

// Read the Programs.js file
const programsPath = path.join(__dirname, 'src', 'pages', 'Programs.js');
const content = fs.readFileSync(programsPath, 'utf8');

// Extract the program data using a simple regex
const programDataMatch = content.match(/const defaultProgramData = {([\s\S]*?)};/);
if (programDataMatch) {
  console.log('Program data structure found successfully');
  console.log('Data length:', programDataMatch[1].length);
  
  // Check for specific programs
  const programs = ['Automobile Engineering', 'Civil Engineering', 'Computer Engineering'];
  programs.forEach(program => {
    if (content.includes(`'${program}': {`)) {
      console.log(`\u2713 Found data for: ${program}`);
    } else {
      console.log(`\u2717 Missing data for: ${program}`);
    }
  });
} else {
  console.log('Program data structure not found');
}
