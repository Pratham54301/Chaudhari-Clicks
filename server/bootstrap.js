const connectDatabase = require("./config/db");
const seedDefaults = require("./config/seedDefaults");

let initializationPromise;

function initializeApplication() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDatabase(process.env.MONGODB_URI);
      await seedDefaults();
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

module.exports = initializeApplication;
