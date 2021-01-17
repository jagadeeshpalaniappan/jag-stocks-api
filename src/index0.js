require("dotenv").config();
const db = require("./modules/common/db");
const morgan = require("morgan");
const express = require("express");
const apiV1 = require("./api/v1/index");

// INIT:
// db.initDBConnection();

// MIDDLEWARE:
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(async function (req, res, next) {
  console.log("middleware:start", req.originalUrl);
  // SERVER-LESS-FN: INIT-DB forEveryReq
  await db.initDBConnection();
  console.log("middleware:end");
  next();
});

// API:
app.use("/api/v1", apiV1);
module.exports = app;
