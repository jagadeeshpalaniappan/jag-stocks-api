const httpStatus = require("http-status");
const expressValidation = require("express-validation");
// const expressWinston = require("express-winston");
// const winstonInstance = require("../winston");
const APIError = require("../helpers/APIError");
const config = require("../config");

const convertToAPIError = (err) => {
  if (err instanceof expressValidation.ValidationError) {
    // convert: ValidationError to 'APIError'
    const messages = err.errors.reduce((res, error) => {
      res[error.field] = error.messages.join(". ");
      return res;
    }, {});
    return new APIError(JSON.stringify(messages), err.status, true);
  } else if (!(err instanceof APIError)) {
    // convert: any common Error to 'APIError'
    return new APIError(err.message, err.status, err.isPublic);
  }

  // no-convertion-reqd: already APIError
  return err;
};

module.exports = (app) => {
  // if error is not an instanceOf APIError, convert it.
  app.use((err, req, res, next) => {
    console.error("ERR1", err);
    const apiError = convertToAPIError(err);
    return next(apiError);
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    // console.error("ERR2: 404");
    const err = new APIError("API not found", httpStatus.NOT_FOUND);
    return next(err);
  });

  // log error in winston transports except when executing test suite
  // if (config.env !== "test") {
  //   app.use(
  //     expressWinston.errorLogger({
  //       winstonInstance,
  //     })
  //   );
  // }

  // error handler, send stacktrace only during development
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    return res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env === "development" ? err.stack : {},
    });
  });
};
