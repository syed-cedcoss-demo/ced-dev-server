import chalk from 'chalk';

const socket = (io) => {
  try {
    io.on('connection', (socket) => {
      console.log('connected', socket.id);
    });
  } catch (error) {
    console.log(chalk.bgRed(error?.message));
  }
};

export default socket;
