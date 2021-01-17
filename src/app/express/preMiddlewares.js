const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
// const expressWinston = require("express-winston");
// const winstonInstance = require("../winston");
const config = require("../config");
const db = require("../db");

module.exports = (app) => {
  if (config.env === "development") {
    app.use(logger("dev"));
  }

  // parse body params and attache them to req.body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  // secure apps by setting various HTTP headers
  app.use(helmet());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // enable detailed API logging in dev env
  // if (config.env === "development") {
  //   expressWinston.requestWhitelist.push("body");
  //   expressWinston.responseWhitelist.push("body");
  //   app.use(
  //     expressWinston.logger({
  //       winstonInstance,
  //       meta: false, // optional: log meta data about request (defaults to true)
  //       msg:
  //         "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  //       colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  //     })
  //   );
  // }

  // SERVER-LESS-FN: INIT-DB forEveryReq
  if (config.isServerLess) app.use(db.initMiddleware());
};
