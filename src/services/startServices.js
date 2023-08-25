import { webhooksProcess } from '../utils/bigcomWebhooks.js';
import resetOTP from './resetOTP.js';

const startServices = () => {
  if (process.env.NODE_ENV === 'development') {
    webhooksProcess();
    resetOTP();
  } else {
    if (process.env.NODE_APP_INSTANCE === '0') {
      webhooksProcess();
      resetOTP();
    }
  }
};
export default startServices;
