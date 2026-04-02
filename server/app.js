const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const apiRoutes = require("./routes");
const pageRoutes = require("./routes/pageRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

function createApp(options = {}) {
  const { ensureReady } = options;
  const app = express();
  const rootDir = path.join(__dirname, "..");
  const publicDir = path.join(rootDir, "public");
  const uploadDir = path.join(rootDir, "uploads");
  const isProduction = process.env.NODE_ENV === "production";

  fs.mkdirSync(uploadDir, { recursive: true });

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(
    session({
      name: "chaudhri-clicks-admin",
      secret: process.env.SESSION_SECRET || "change-me-before-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 8
      }
    })
  );

  if (typeof ensureReady === "function") {
    app.use((req, res, next) => {
      Promise.resolve(ensureReady())
        .then(() => next())
        .catch(next);
    });
  }

  app.use(
    express.static(publicDir, {
      index: false,
      maxAge: isProduction ? "7d" : 0
    })
  );
  app.use("/uploads", express.static(uploadDir));

  app.use("/api", apiRoutes);
  app.use(pageRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
