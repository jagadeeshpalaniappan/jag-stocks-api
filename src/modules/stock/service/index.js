const stockDao = require("../dao");

async function getStocks(options) {
  console.log("stockSvc.getStocks:start");
  const data = await stockDao.getStocks();
  const resp = {
    data,
    meta: { before: "123", after: "456" },
  };
  console.log("stockSvc.getStocks:end");
  return resp;
}

module.exports = {
  getStocks,
};
