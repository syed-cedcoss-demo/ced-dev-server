import chalk from 'chalk';
import { serverDown } from '../services/email.js';
import { reActive } from '../services/request.js';

const globalError = (server) => {
  // if uncaughtException occurred
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(chalk.red(err.name, err.message));
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
      serverDown();
      // this is only for render host
      reActive();
    });
  });
};

export default globalError;
