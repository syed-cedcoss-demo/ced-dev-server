import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Function to log messages to a file
export const logCreator = (message) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  let path =
    __dirname.replace('src/validations', 'public/logs/') +
    `${new Date().toString().substring(0, 10)}-log.log`;
  const platform = process.platform;
  if (platform === 'win32' || platform === 'win64') {
    path = path.replaceAll('/', '\\');
  }
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n\n`;

  try {
    fs.appendFile(path, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  } catch (error) {
    console.log('error', error);
  }
};
