const fs = require("fs/promises");
const path = require("path");

const uploadRoot = path.resolve(path.join(__dirname, "..", "..", "uploads"));

async function deleteLocalFile(filePath) {
  if (!filePath) return;
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(uploadRoot)) return;

  try {
    await fs.unlink(resolved);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

module.exports = deleteLocalFile;
