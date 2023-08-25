import cron from 'node-cron';
import { reActive } from './request.js';

// RUN EVERY 5 MINUTES ONLY ON FIRST INSTANCE NODEJS CLUSTER
const dbTask = cron.schedule('5 * * * *', () => {
  reActive();
});

dbTask.start();

// create demo product
// createDemoProducts(1);
