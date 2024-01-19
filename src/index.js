const cron = require('cron');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const {  SRSPDAM, KADAM, LMDDAM } = require('./sqlLogic');

const { handleMongoDBData } = require('../src/controllers/srsp.controller');
const { lmdMongoDBData} = require("../src/controllers/lmd.controller")
const { kadamMongoDBData} = require("../src/controllers/kadam.controller")

async function startServer() {
  try {
    // Connect to SQL Server and fetch data
    const result = await SRSPDAM();
    const kadanData = await KADAM()
    const lmd = await LMDDAM()

    // Connect to MongoDB and handle data

    // Define the cron job to run every 5 minutes
// const cronJob = new cron.CronJob('*/1 * * * *', async () => {
//   try {
    // Call the function to handle MongoDB data directly

    await handleMongoDBData(result);
    await lmdMongoDBData(lmd);
    await kadamMongoDBData(kadanData);

//     console.log('Cron job executed successfully.');
//   } catch (error) {
//     console.error('Error in cron job:', error);
//   }
// });

// Start the cron job
// cronJob.start();

  
    // await handleMongoDBData(result);
    // await lmdMongoDBData(lmd);
    // await kadamMongoDBData(kadanData);

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
mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    // Start the server after MongoDB connection is established
    startServer();
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
