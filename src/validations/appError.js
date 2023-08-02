import chalk from 'chalk';
import { logCreator } from './logCreator.js';

const appError = (err, res = null) => {
  console.log(chalk.bgRed.bold(err.message));
  logCreator(`error ==> ${err.message}, description==>${err.stack}`);
  if (res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({
        success: false,
        msg: 'Internal server error',
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
};

export default appError;
