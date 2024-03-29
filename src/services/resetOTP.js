import userModel from '../models/userModel.js';
import appError from '../validations/appError.js';

const resetOTP = async () => {
  try {
    console.log('OTP RESET RUN : ', new Date().toString());
    const minsAgo = new Date(Date.now() - 1000 * 60 * 10);
    await userModel.updateMany({ createdAt: { $lte: minsAgo } }, { $unset: { otp: 1 } });
  } catch (error) {
    appError(error);
  }
};
export default resetOTP;
