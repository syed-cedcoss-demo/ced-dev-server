import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import process from 'node:process';
import { Server } from 'socket.io';

import cedDevServer from './src/app.js';
import { dbConnection } from './src/config/dbConnection.js';
import socket from './src/socket/socket.js';
import globalError from './src/validations/globalError.js';

// eslint-disable-next-line no-unused-vars

const app = express();
const httpServer = createServer(app);
dotenv.config();

// database connect
dbConnection();

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173']
  }
});

// socket instance
socket(io);

// our ced-dev-server
cedDevServer(app);

const port = process.env.PORT ?? 3002;
const server = httpServer.listen(port, () => {
  console.log(
    chalk.bgYellowBright.bold(
      `server started -  \n port: ${port} \n time: ${new Date().toString()}`
    )
  );
});

// global error handler
globalError(server);
