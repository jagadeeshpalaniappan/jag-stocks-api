const _get = require("lodash.get");
const MyStock = require("../schema/MyStock");

async function getStocks(options) {
  console.log("stockDao.getStocks:start");
  const resp = await MyStock.find({});
  console.log("stockDao.getStocks:end");
  return resp;
}

async function createStocks({ newStockIds, fetchedStockMap }) {
  console.log("stockDao.createStocks:start");
  const stocksSchema = newStockIds.map(
    (stockId) => new MyStock(fetchedStockMap[stockId])
  );
  const resp = await MyStock.create(stocksSchema);
  console.log("stockDao.createStocks:end");
  return resp;
}

async function updateStocks({ updateStockIds, fetchedStockMap }) {
  console.log("stockDao.updateStocks:start");

  const allPromises = updateStockIds.map((stockId) => {
    const stockDoc = fetchedStockMap[stockId];
    return stockDoc.save();
  });
  const resp = await Promise.all(allPromises);

  console.log("stockDao.updateStocks:end");
  return resp;
}

module.exports = {
  getStocks,
  createOrUpdateStocks,
  getStocksByStockIds,
  createOrUpdateStockAnalysis,
};
