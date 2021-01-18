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
      doc.set(path, extData);
      await doc.save();
    }
    return doc;
  }
}

module.exports = {
  ...dao,
  getOrFetchExt,
};
