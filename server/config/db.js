const mongoose = require("mongoose");

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required. Add it to your .env file.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected to ${mongoose.connection.name}.`);
}

module.exports = connectDatabase;
