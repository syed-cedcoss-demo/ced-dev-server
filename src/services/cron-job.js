import cron from 'node-cron';
import userModel from '../models/userModel.js';
import appError from '../validations/appError.js';

// OTP RESET
const otpReset = async () => {
  try {
    console.log('OTP RESET RUN : ', new Date().toString());
    const minsAgo = new Date(Date.now() - 1000 * 60 * 10);
    await userModel.updateMany({ createdAt: { $lte: minsAgo } }, { $unset: { otp: 1 } });
  } catch (error) {
    appError(error);
  }
};

// run every 5 minutes only on first instance nodejs cluster
cron.schedule('* 5 * * *', () => {
  console.log('running a task every minute');
  otpReset();
});
