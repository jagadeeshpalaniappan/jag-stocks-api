console.log("NODE_ENV", process.env.NODE_ENV);
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./src/app/db");
const express = require("./src/app/express");
const config = require("./src/app/config");
console.log("APP_CONFIG:");
console.log(config);

db.init();
express.init();

module.exports = express.app;
