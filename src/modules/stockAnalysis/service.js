const dao = require("./dao");
const { StockAnalysis } = require("./model");
const fetchExt = require("./external");
const utils = require("../common/utils");
const { fetchStatus } = require("../common/constants");

async function getOrFetchExt({ stockanalysis, stockId, src, rhgtoken }) {
  const doc = stockanalysis || new StockAnalysis({ stockId });
  const hisKey = utils._getHistoryKey();
  const path = `${src}.${hisKey}`;
  console.log("svc:getOrFetchExt", { path, stockanalysis });

  const dbData = doc.get(path);
  let validDbData = true;
  if (dbData && src === "rhg" && rhgtoken)
    validDbData = dbData.fetchStatus !== fetchStatus.NO_TOKEN;

  if (dbData && validDbData) return stockanalysis;
  else {
    // FETCH-EXT: (src: yf/rh/rhg)
    const extData = await fetchExt.get({ src, stockId, rhgtoken });
    if (extData) {
      // get: latestStock (fetchExt takes time, -docs might have updated in DB)
      // we need latest stock details from db
      const latestStockanalysis = await dao.getByStockId(stockId);
      const latestDoc = latestStockanalysis || new StockAnalysis({ stockId });
      latestDoc.set(path, extData);
      await latestDoc.save();
      return latestDoc;
    }
    return null;
  }
}

module.exports = {
  ...dao,
  getOrFetchExt,
};
