const dao = require("./dao");
const { StockAnalysis } = require("./model");
const fetchExt = require("./external");
const utils = require("../common/utils");

async function getOrFetchExt({ stockanalysis, stockId, src }) {
  const doc = stockanalysis || new StockAnalysis({ stockId });
  const hisKey = utils._getHistoryKey();
  const path = `${src}.${hisKey}`;
  console.log("svc:getOrFetchExt", { path, stockanalysis });

  if (doc.get(path)) return stockanalysis;
  else {
    // FETCH-EXT: (src: yf/rh/rhg)
    const data = await fetchExt.get(src, stockId);
    doc.set(path, data);
    await doc.save();
    return doc;
  }
}

module.exports = {
  ...dao,
  getOrFetchExt,
};
