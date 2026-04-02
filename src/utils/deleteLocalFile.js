const fs = require("fs/promises");
const path = require("path");

const uploadRoot = path.resolve(path.join(__dirname, "..", "..", "uploads"));

async function deleteLocalFile(filePath) {
  if (!filePath) {
    return;
  }

  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(uploadRoot)) {
    return;
  }

  try {
    await fs.unlink(resolvedPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

module.exports = deleteLocalFile;
