const fs = require('fs');
const path = require('path');

// Directory to search in
const directory = './app';
// Path to the .env file
const envFilePath = '.env';

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  console.error('.env file not found!');
  process.exit(1);
}

// Load the .env file into an object
const envVars = {};
fs.readFileSync(envFilePath, 'utf8')
  .split('\n')
  .forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });

// Function to get all files recursively in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to replace 'process.env.VAR_NAME' with the corresponding value
function replaceEnvUsage(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [key, value] of Object.entries(envVars)) {
    const regex = new RegExp(`process\\.env\\.${key}`, 'g');
    if (fileContent.match(regex)) {
      fileContent = fileContent.replace(regex, value);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Processed ${filePath}`);
  }
}

// Main function to search and replace process.env in files
function main() {
  const allFiles = getAllFiles(directory);

  allFiles.forEach((filePath) => {
    if (fs.readFileSync(filePath, 'utf8').includes('process.env')) {
      replaceEnvUsage(filePath);
    }
  });

  console.log('Replacement complete.');
}

// Execute the main function
main();
