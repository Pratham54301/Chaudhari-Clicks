const mongoose = require("mongoose");

async function connectDatabase(databaseUri) {
  const uri = databaseUri || "mongodb://127.0.0.1:27017/Chaudhari-clicks";

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  console.log(`MongoDB connected to ${mongoose.connection.name}.`);
}

module.exports = connectDatabase;
