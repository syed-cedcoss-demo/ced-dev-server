import { webhooksProcess } from '../utils/bigcomWebhooks.js';
import resetOTP from './resetOTP.js';

const startServices = () => {
  console.log('ggg', process.env.NODE_APP_INSTANCE);
  if (process.env.NODE_ENV === 'development') {
    webhooksProcess();
    resetOTP();
  } else {
    if (process.env.NODE_APP_INSTANCE === 0) {
      webhooksProcess();
      resetOTP();
    }
  }
};
export default startServices;
