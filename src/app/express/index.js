const express = require("express");

const config = require("../config");

const apiRoutes = require("./apiRoutes");
// const gqlRoutes = require("../../api/v1/graphql");

const preMiddlewares = require("./preMiddlewares");
const postMiddlewares = require("./postMiddlewares");

const app = express();

// preMiddlewares: execute before "/api" routes
preMiddlewares(app);

app.get("/", (req, res) => res.send("Welcome to 'jag-stocks' api"));
// app.use("/graphql", gqlRoutes); // graphql: routes
app.use("/api", apiRoutes); // api: routes

// preMiddlewares: execute after "/api" routes
postMiddlewares(app);

// init: expressApp
function init() {
  console.log(`EXPRESS:INIT [NODE_ENV=${config.env}]`);
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `EXPRESS:INITIALIZED [PORT=${config.port}] [NODE_ENV=${config.env}]`
    );
  });
}
module.exports = { app, init };
