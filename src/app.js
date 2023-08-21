import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { serverStatus } from '../public/templates/info.js';
import security from './config/security.js';
import authRoute from './routes/authRoute.js';
import bigcomRoute from './routes/bigcomRoute.js';
import userRoute from './routes/userRoute.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cedDevServer = (app) => {
  // MIDDLEWARE
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: '1024px' }));
  app.use(cors());
  app.use(compression());

  // PRODUCTION ONLY CODE
  if (process.env.NODE_ENV === 'production') {
    security(app);
  }

  // PUBLIC PATH
  const basePath = __dirname?.split('/src')[0];
  app.use('/images', express.static(basePath + '/public/images'));
  app.use('/upload', express.static(basePath + '/public/uploads'));
  app.use('/logs', express.static(basePath + '/public/logs'));

  // APP ROUTES
  app.get('/', (req, res) => res.status(200).send(serverStatus()));
  app.use('/auth', authRoute);
  app.use('/user', userRoute);
  app.use('/big-com', bigcomRoute);

  // ROUTE NOT FOUND
  app.use('*', (req, res) => {
    res.status(404).send({ success: 'false', msg: `${req.originalUrl} not found`, data: {} });
  });
};
export default cedDevServer;
