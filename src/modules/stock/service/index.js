const _get = require("lodash.get");
const stockDao = require("../dao");

const yfSvc = require("../../external/yahoofin");
const rhSvc = require("../../external/robinhood");
const rhgSvc = require("../../external/rhg");
const { _getHistoryKey } = require("../../common/utils");
const { fetchStatus } = require("../../common/constants");

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

function getNewStockIds({ stockIds, existingStockDocs }) {
  const existingStockIds = existingStockDocs.map(
    (stockDoc) => stockDoc.stockId
  );
  const existingStockIdsSet = new Set(existingStockIds);
  const newStockIds = stockIds.filter(
    (stockId) => !existingStockIdsSet.has(stockId)
  );
  return newStockIds;
}

function getFetchStockIdsAndUpdateDocs({
  stockIds,
  existingStockDocs,
  forceUpdate,
  hisKey,
}) {
  // forceUpdate: true (fetchAllRecs)
  let fetchStockIds = stockIds;
  let updateStockDocs = existingStockDocs;
  if (!forceUpdate) {
    // forceUpdate: false (fetchOnlyNewRecs)
    const histExistingStock = new Set();
    updateStockDocs = existingStockDocs.filter((stockDoc) => {
      const yf = _get(stockDoc, ["yf", hisKey]);
      const rh = _get(stockDoc, ["rh", hisKey]);
      const rhg = _get(stockDoc, ["rhg", hisKey]);
      const hasCurrMonHistory = yf && rh && rhg;
      if (hasCurrMonHistory) {
        histExistingStock.add(stockDoc.stockId);
      }
      return !hasCurrMonHistory;
    });

    fetchStockIds = stockIds.filter(
      (stockId) => !histExistingStock.has(stockId)
    );
  }
  return { fetchStockIds, updateStockDocs };
}

async function getExistingStocksHistory({ stockIds, hisKey, forceUpdate }) {
  console.log("stockDao.getExistingStocksHistory:start");
  const existingStockDocs = await stockDao.getStocksByStockIds({ stockIds });
  console.log("stockDao.getExistingStocksHistory::");
  const { fetchStockIds, updateStockDocs } = getFetchStockIdsAndUpdateDocs({
    stockIds,
    existingStockDocs,
    forceUpdate,
    hisKey,
  });
  const newStockIds = getNewStockIds({ stockIds, existingStockDocs });
  const resp = { fetchStockIds, updateStockDocs, newStockIds };
  console.log("stockDao.getExistingStocksHistory:end");
  return resp;
}

async function refreshStocks({ stockIds, token, forceUpdate }) {
  console.log("stockSvc.refreshStocks:start");
  const hisKey = _getHistoryKey();
  const {
    fetchStockIds,
    updateStockDocs,
    newStockIds,
  } = await getExistingStocksHistory({
    stockIds,
    hisKey,
    forceUpdate,
  });

  const stockMap = {};
  for (let i = 0; i < fetchStockIds.length; i++) {
    const stockId = fetchStockIds[i];
    const { yf, rh, rhg } = await fetchStocksExt({ stockId, token });
    stockMap[stockId] = { stockId, yf, rh, rhg };
  }

  if (fetchStockIds && fetchStockIds.length > 0) {
    // createOrUpdateStocks in DB
    await stockDao.createOrUpdateStocks({
      newStockIds,
      updateStockDocs,
      stockMap,
      hisKey,
    });
  }

  console.log("stockSvc.refreshStocks:end");
  return stockMap;
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
  console.log("stockSvc.getExtStocks:start");
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
    // createOrUpdateStocks in DB
    await stockDao.createOrUpdateStocks({
      newStockIds,
      updateStockIds,
      fetchedStockMap,
    });
  }

  console.log("stockSvc.refreshStocks:end");
  return fetchedStockMap;
}

module.exports = {
  getStocks,
  refreshStocks,
  getStockAnalysis,
};
