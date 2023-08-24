import { webhooksProcess } from '../utils/bigcomWebhooks.js';
// import * as cronJob from './cron-job.js';
const startServices = () => {
  webhooksProcess();
  // cronJob();
};
export default startServices;
