// Vercel detects Express apps from a root-level entrypoint that imports `express`.
require("express");

const createApp = require("./server/app");
const initializeApplication = require("./server/bootstrap");

module.exports = createApp({ ensureReady: initializeApplication });
