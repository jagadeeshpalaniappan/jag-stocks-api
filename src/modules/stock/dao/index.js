const Stock = require("../schema/Stock");

async function getStocks(options) {
  console.log("stockDao.getStocks:start");
  const resp = await Stock.find({});
  console.log("stockDao.getStocks:end");
  return resp;
}

module.exports = {
  getStocks,
};
