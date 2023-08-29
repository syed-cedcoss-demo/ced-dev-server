import appError from '../validations/appError.js';
import resetOTP from './resetOTP.js';

const startServices = () => {
  try {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_APP_INSTANCE === '0' ||
      process.env.NODE_APP_INSTANCE === undefined
    ) {
      setInterval(() => {
        resetOTP();
      }, 1000 * 60 * 15);
    }
  } catch (error) {
    appError(error);
  }
};
export default startServices;
