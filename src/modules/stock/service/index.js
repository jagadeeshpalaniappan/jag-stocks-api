const _get = require("lodash.get");
const stockDao = require("../dao");

const yfSvc = require("../../external/yahoofin");
const rhSvc = require("../../external/rh");
const rhgSvc = require("../../external/rhg");
const { _getHistoryKey } = require("../../common/utils");
const { fetchStatus } = require("../../common/constants");

async function getStocks(options) {
  console.log("stockSvc.getStocks:start");
  const data = await stockDao.getStocks();
  const resp = {
    data,
    meta: { before: "TMP", after: "TMP" },
  };
  console.log("stockSvc.getStocks:end");
  return resp;
}

async function fetchStocksExt({ stockId, token }) {
  console.log("stockSvc.fetchStocksExt:start");
  const allPromises = [
    yfSvc.get({ stockId }),
    rhSvc.get({ stockId, token }),
    rhgSvc.get({ stockId, token }),
  ];
  const [yf, rh, rhg] = await Promise.all(allPromises);
  console.log("stockSvc.fetchStocksExt:end");
  return { yf, rh, rhg };
}

function getFetchExtDocs({ stockIds, existingStockDocs, forceUpdate, hisKey }) {
  // forceUpdate: true (fetchAllRecs)
  let fetchedStockMap = {};
  let updateStockMap = {};

  // forceUpdate: false (fetchOnlyNewRecs)
  for (const stockDoc of existingStockDocs) {
    const yf = _get(stockDoc, ["yf", hisKey, "fetchStatus"]);
    const rh = _get(stockDoc, ["rh", hisKey, "fetchStatus"]);
    const rhg = _get(stockDoc, ["rhg", hisKey, "fetchStatus"]);
    const hasYf = yf === fetchStatus.COMPLETED || yf === fetchStatus.NA;
    const hasRh = rh === fetchStatus.COMPLETED || rh === fetchStatus.NA;
    const hasRhg = rhg === fetchStatus.COMPLETED || rhg === fetchStatus.NA;
    const hasCurrMonHistory = hasYf && hasRh && hasRhg;
    if (hasCurrMonHistory && !forceUpdate) {
      fetchedStockMap[stockDoc.stockId] = stockDoc;
    } else {
      updateStockMap[stockDoc.stockId] = stockDoc;
    }
  }

  const newStockIds = [];

  for (const stockId of stockIds) {
    if (!updateStockMap[stockId] && !fetchedStockMap[stockId]) {
      newStockIds.push(stockId);
    }
  }

  return { fetchedStockMap, updateStockMap, newStockIds };
}

async function getStockAnalysis({ stockIds, token, forceUpdate }) {
  console.log("stockSvc.getStockAnalysis:start");
  const existingStockDocs = await stockDao.getStocksByStockIds({ stockIds });

  const hisKey = _getHistoryKey();
  const { fetchedStockMap, updateStockMap, newStockIds } = getFetchExtDocs({
    stockIds,
    existingStockDocs,
    forceUpdate,
    hisKey,
  });

  const updateStockIds = Object.keys(updateStockMap);
  const fetchStockIds = [...updateStockIds, ...newStockIds];

  console.log("stockSvc.getStockAnalysis:", { fetchStockIds });

  for (let i = 0; i < fetchStockIds.length; i++) {
    const stockId = fetchStockIds[i];
    const { yf, rh, rhg } = await fetchStocksExt({ stockId, token });

    const newStock = {
      stockId,
      name: _get(yf, "name"),
      yf: {},
      rh: {},
      rhg: {},
    };

    const isUpdateDoc = !!updateStockMap[stockId];
    const stockDoc = isUpdateDoc ? updateStockMap[stockId] : newStock;
    if (yf) {
      stockDoc.yf = { ...stockDoc.yf, [hisKey]: yf };
    }
    if (rh) {
      stockDoc.rh = { ...stockDoc.rh, [hisKey]: rh };
    }
    if (rhg) {
      stockDoc.rhg = { ...stockDoc.rhg, [hisKey]: rhg };
    }

    fetchedStockMap[stockId] = stockDoc;
  }

  if (fetchStockIds && fetchStockIds.length > 0) {
    console.log("stockSvc.getStockAnalysis:hasNewStocks", fetchStockIds);
    // createOrUpdateStocks in DB
    await stockDao.createOrUpdateStocks({
      newStockIds,
      updateStockIds,
      fetchedStockMap,
    });
  } else {
    console.log("stockSvc.getStockAnalysis:noNewStocks", stockIds);
  }

  console.log("stockSvc.getStockAnalysis:end");
  return fetchedStockMap;
}

module.exports = {
  getStocks,
  getStockAnalysis,
};
