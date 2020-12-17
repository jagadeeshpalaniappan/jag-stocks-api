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

async function createStocks({ newStockIds, stockMap, hisKey }) {
  console.log("stockDao.createStocks:start");
  const stocksSchema = newStockIds.map((stockId) => {
    const { yf, rh, rhg } = stockMap[stockId];
    const newStock = {
      stockId,
      name: _get(yf, "name"),
      yf: {},
      rh: {},
      rhg: {},
    };
    if (yf) newStock.yf[hisKey] = yf;
    if (rh) newStock.rh[hisKey] = rh;
    if (rhg) newStock.rhg[hisKey] = rhg;
    return new Stock(newStock);
  });
  const resp = await Stock.create(stocksSchema);
  console.log("stockDao.createStocks:end");
  return resp;
}

async function updateStocks({ updateStockDocs, stockMap, hisKey }) {
  console.log("stockDao.updateStocks:start");
  const allPromises = updateStockDocs.map((stockDoc) => {
    const { yf, rh, rhg } = stockMap[stockDoc.stockId];
    if (yf) {
      stockDoc.yf[hisKey] = yf;
      stockDoc.markModified("yf");
    }
    if (rh) {
      stockDoc.rh[hisKey] = rh;
      stockDoc.markModified("rh");
    }
    if (rhg) {
      stockDoc.rhg[hisKey] = rhg;
      stockDoc.markModified("rhg");
    }
    return stockDoc.save();
  });
  const resp = await Promise.all(allPromises);
  console.log("stockDao.updateStocks:end");
  return resp;
}

async function createOrUpdateStocks({
  newStockIds,
  updateStockDocs,
  stockMap,
  hisKey,
}) {
  console.log("stockDao.createOrUpdateStocks:start");

  if (newStockIds.length > 0) {
    await createStocks({ newStockIds, stockMap, hisKey });
  }

  if (updateStockDocs.length > 0) {
    await updateStocks({ updateStockDocs, stockMap, hisKey });
  }

  console.log("stockDao.createOrUpdateStocks:end");
}

module.exports = {
  getStocks,
  createOrUpdateStocks,
  getStocksByStockIds,
};
