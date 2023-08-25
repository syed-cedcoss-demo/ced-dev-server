import chalk from 'chalk';
import { logCreator } from './logCreator.js';

const appError = (err, res = null) => {
  try {
    console.log(chalk.bgRed.bold(err.message));
    console.log(chalk.bgYellow.bold(err.stack));
    logCreator(`error ==> ${err.message}, description==>${err.stack}`);
    if (res) {
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
          success: false,
          msg: err.message,
          data: {}
        });
      } else {
        res.status(500).json({
          success: false,
          msg: err.message,
          data: {},
          stack: err.stack
        });
      }
    }
  } catch (error) {
    console.log('failed to create Log', error);
  }
};

export default appError;
