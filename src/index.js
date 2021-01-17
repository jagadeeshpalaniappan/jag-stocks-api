console.log("NODE_ENV", process.env.NODE_ENV);
// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./app/db");
const express = require("./app/express");
const config = require("./app/config");

db.init();

// DO-NOT-RUN-EXPRESS-ON-SERVERLESS
if (!config.isServerLess) express.init();

module.exports = express.app;
