import appError from '../validations/appError.js';
import resetOTP from './resetOTP.js';

const startServices = () => {
  try {
    setInterval(() => {
      resetOTP();
    }, 1000 * 60 * 15);

    // if (process.env.NODE_ENV === 'development') {
    //   webhooksProcess();
    //   resetOTP();
    // } else {
    //   if (process.env.NODE_APP_INSTANCE === '0') {
    //     webhooksProcess();
    //     resetOTP();
    //   }
    //   if (process.env.NODE_APP_INSTANCE === undefined) {
    //     webhooksProcess();
    //     resetOTP();
    //   }
    // }
  } catch (error) {
    appError(error);
  }
};
export default startServices;
