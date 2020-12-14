var mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
console.log({ DB_URL });

mongoose.Promise = global.Promise;

let isDbInitialized = null; // Create cached connection variable

// Connecting to database
async function initDBConnection() {
  try {
    if (isDbInitialized) return;
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
  } catch (error) {
    const err = { errCode: "DB-INIT-ERR", error };
    console.error(err);
    throw err;
  }
}

module.exports = { initDBConnection };
