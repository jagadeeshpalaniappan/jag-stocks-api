const axios = require("axios");
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

// ---------------- ASYNC ----------------

const JAG_STOCKS_API = "http://jag-stocks-api-v1.vercel.app";
// const JAG_STOCKS_API = "http://localhost:4000";

async function _proxyFetchExtStockAnalysis({ stockId, extSrc, token }) {
  try {
    console.log("rhg._proxyFetchExtStockAnalysis:start", { stockId });
    const url = `${JAG_STOCKS_API}/api/v1/fetchExtStockAnalysis`;
    const options = { params: { stockId, extSrc } };
    console.log("rhg._proxyFetchExtStockAnalysis:");
    console.log({ url, options });

    if (extSrc === "rhg") {
      options.headers = { rhtoken: token };
    }

    const response = await axios.get(url, options);
    console.log("rhg._proxyFetchExtStockAnalysis:end", { stockId });
    return response.data;
  } catch (err) {
    console.log("rhg._proxyFetchExtStockAnalysis:err", { stockId });
    console.error(err);
  }
}

async function getStockAnalysisAsync({ stockIds, token, forceUpdate }) {
  console.log("stockSvc.getStockAnalysisAsync:start");
  const hisKey = _getHistoryKey();
  const existingStockDocs = await stockDao.getStocksByStockIds({ stockIds });

  const { fetchedStockMap, updateStockMap, newStockIds } = getFetchExtDocs({
    stockIds,
    existingStockDocs,
    forceUpdate,
    hisKey,
  });

  const updateStockIds = Object.keys(updateStockMap);
  const fetchStockIds = [...updateStockIds, ...newStockIds];

  console.log("stockSvc.getStockAnalysisAsync:", { fetchStockIds });

  if (fetchStockIds && fetchStockIds.length > 0) {
    console.log("stockSvc.getStockAnalysisAsync:hasNewStocks", fetchStockIds);
    for (let i = 0; i < fetchStockIds.length; i++) {
      const stockId = fetchStockIds[i];
      // NO-AWAIT: FIRE & FORGET
      _proxyFetchExtStockAnalysis({ stockId, extSrc: "yf" });
      _proxyFetchExtStockAnalysis({ stockId, extSrc: "rh" });
      _proxyFetchExtStockAnalysis({ stockId, extSrc: "rhg", token });
    }
  } else {
    console.log("stockSvc.getStockAnalysisAsync:noNewStocks", stockIds);
  }
  console.log("stockSvc.getStockAnalysisAsync:end");
  return fetchStockIds;
}

async function fetchExtStockAnalysis({ stockId, extSrc, token }) {
  console.log("stockSvc.fetchExtStockAnalysis:start");
  const hisKey = _getHistoryKey();
  let yf, rh, rhg;

  if (extSrc === "yf") {
    yf = await yfSvc.get({ stockId });
  }

  if (extSrc === "rh") {
    rh = await rhSvc.get({ stockId });
  }

  if (extSrc === "rhg") {
    rhg = await rhgSvc.get({ stockId, token });
  }

  const stockDoc = await stockDao.createOrUpdateStockAnalysis({
    stockId,
    yf,
    rh,
    rhg,
    hisKey,
  });

  console.log("stockSvc.fetchExtStockAnalysis:end");
  return stockDoc;
}

module.exports = {
  getStocks,
  getStockAnalysis,
  getStockAnalysisAsync,
  fetchExtStockAnalysis,
};
