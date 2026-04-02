const dotenv = require("dotenv");
const connectDatabase = require("./server/config/db");
const createApp = require("./server/app");
const seedDefaults = require("./server/config/seedDefaults");

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT) || 3002;

async function startServer() {
  await connectDatabase(process.env.MONGODB_URI);
  await seedDefaults();

  const server = app.listen(port, () => {
    console.log(`Chaudhari Clicks is running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the existing process or change PORT in .env.`);
      process.exit(1);
    }

    console.error("Failed to start the HTTP server.", error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the application.", error);
  process.exit(1);
});
