const fs = require('fs');
const eslint = require('eslint');

async function main() {
  const cli = new eslint.ESLint();
  const results = await cli.lintFiles(['src/pages/Programs.js']);
  const formatter = await cli.loadFormatter('stylish');
  const resultText = formatter.format(results);
  console.log(resultText);
}
main();
