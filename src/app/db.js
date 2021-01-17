const mongoose = require("mongoose");
const util = require("util");

// config should be imported before importing any other file
const config = require("./config");

const debug = require("debug")("jag-express-mongo-mvc-v2:index");

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;

mongoose.connection.on("error", () => {
  // eslint-disable-next-line no-console
  console.error("DB:CONNECTION-FAILED");
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

mongoose.connection.once("open", function () {
  // eslint-disable-next-line no-console
  console.log("DB:CONNECTED");
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

function init() {
  // mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
module.exports = { init };
