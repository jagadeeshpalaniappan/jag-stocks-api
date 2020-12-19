const _get = require("lodash.get");
const Stock = require("../schema/Stock");

async function getStocks(options) {
  console.log("stockDao.getStocks:start");
  const resp = await Stock.find({});
  console.log("stockDao.getStocks:end");
  return resp;
}

async function getStocksByStockIds({ stockIds }) {
  console.log("stockDao.getStocksByStockIds:start");
  const stockDocs = await Stock.find().where("stockId").in(stockIds).exec();
  console.log("stockDao.getStocksByStockIds:end");
  return stockDocs;
}

async function createStocks({ newStockIds, fetchedStockMap }) {
  console.log("stockDao.createStocks:start");
  const stocksSchema = newStockIds.map(
    (stockId) => new Stock(fetchedStockMap[stockId])
  );
  const resp = await Stock.create(stocksSchema);
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

async function createOrUpdateStocks({
  newStockIds,
  updateStockIds,
  fetchedStockMap,
}) {
  console.log("stockDao.createOrUpdateStocks:start");

  if (newStockIds.length > 0) {
    await createStocks({ newStockIds, fetchedStockMap });
  }

  if (updateStockIds.length > 0) {
    await updateStocks({ updateStockIds, fetchedStockMap });
  }

  console.log("stockDao.createOrUpdateStocks:end");
}

module.exports = {
  getStocks,
  createOrUpdateStocks,
  getStocksByStockIds,
};
