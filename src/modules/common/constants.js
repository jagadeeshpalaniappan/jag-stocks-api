const fetchStatus = {
  COMPLETED: "COMPLETED",
  NA: "NA",
  NO_TOKEN: "NO_TOKEN",
};

const mongoErrCodes = {
  DUPLICATE_KEY: 11000,
};

module.exports = { fetchStatus, mongoErrCodes };
