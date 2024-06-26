const cron = require('cron');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { SRSPDAM, KADAM, LMDDAM } = require('./sqlLogic');

async function startServer() {
  try {
    // Start the Express server
    const server = await app.listen(config.port);
    logger.info(`Server listening on port ${config.port}`);

    // Handle process termination signals
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Closing server...');
      server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Error during startup:', error);
    process.exit(1);
  }
}

// Connect to MongoDB
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    // Start the server after MongoDB connection is established
    startServer();
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Schedule Cron Job
// const cronJob = new cron.CronJob('*/1 * * * *', async () => {
//   try {
//     logger.info('LMD Dam Cron job started.');
//     logger.info('Kadam Dam Cron job started.');
//     logger.info('SRSP Dam Cron job started.');

//     await LMDDAM();
//     await SRSPDAM();
//     await KADAM();

//     logger.info('LMD Dam Cron job executed successfully.');
//     logger.info('Kadam Dam Cron job executed successfully.');
//     logger.info('SRSP Dam  Cron job executed successfully.');

//   } catch (error) {
//     logger.error('Error in cron job:', error.message);
//   }
// });

// cronJob.start();


async function executeDamTasks() {
  try {
    logger.info('LMD Dam Dam data fatch started.');
    logger.info('Kadam Dam Dam data fatch started.');
    logger.info('SRSP Dam Dam data fatch started.');

    await LMDDAM();
    await SRSPDAM();
    await KADAM();

    logger.info('LMD Dam data fatch successfully.');
    logger.info('Kadam Dam data fatch successfully.');
    logger.info('SRSP Dam data fatch successfully.');

  } catch (error) {
    logger.error('Error in dam tasks:', error.message);
  }
}

// Schedule the tasks to run every minute (60000 milliseconds)
setInterval(executeDamTasks, 60000 * 5);

// Start the first execution immediately
executeDamTasks();