require("dotenv").config();
const db = require("./modules/common/db");
const morgan = require("morgan");
const express = require("express");
const apiV1 = require("./api/v1/index");

// INIT:
db.initDBConnection();

// MIDDLEWARE:
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// API:
app.use("/api/v1", apiV1);
module.exports = app;
