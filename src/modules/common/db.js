var mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URL;
// console.log({ DB_URL });

mongoose.Promise = global.Promise;

let isDbInitialized = null; // Create cached connection variable

// Connecting to database
async function initDBConnection() {
  try {
    if (isDbInitialized) return;

    console.log("initDBConnection:start");
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("initDBConnection:end");
  } catch (error) {
    const err = { errCode: "DB-INIT-ERR", error };
    console.error("initDBConnection:err", err);
    throw err;
  }
}

module.exports = { initDBConnection };
