var mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URI;
console.log({ DB_URL });

mongoose.Promise = global.Promise;

let isDbInitialized = null; // Create cached connection variable

// Connecting to database
async function initDBConnection() {
  try {
    if (isDbInitialized) return;

    console.log("initDBConnection:start", { DB_URL });
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
    console.log("initDBConnection:end", { DB_URL });
  } catch (error) {
    const err = { errCode: "DB-INIT-ERR", error };
    console.error("initDBConnection:err", err);
    throw err;
  }
}

module.exports = { initDBConnection };
