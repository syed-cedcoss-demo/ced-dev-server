import Cronitor from 'cronitor';
import cron from 'node-cron';
import userModel from '../models/userModel.js';
import appError from '../validations/appError.js';
const cronitor = new Cronitor('638dd12afd754356ac399427569b0993');

cronitor.wraps(cron);
// OTP RESET AFTER EVERY 10 MIN
const otpReset = async () => {
  try {
    console.log('OTP RESET RUN : ', new Date().toString());
    const minsAgo = new Date(Date.now() - 1000 * 60 * 10);
    await userModel.updateMany({ createdAt: { $lte: minsAgo } }, { $unset: { otp: 1 } });
  } catch (error) {
    appError(error);
  }
};

// RUN EVERY 5 MINUTES ONLY ON FIRST INSTANCE NODEJS CLUSTER
const dbTask = cron.schedule('5 * * * *', () => {
  otpReset();
});

dbTask.start();

// create demo product
// createDemoProducts(1300);
