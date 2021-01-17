const { StockAnalysis } = require("./model");
const dao = require("./dao");
const fetchExt = require("./external");
const utils = require("../modules/common/utils");

/**
 * Load stockanalysis and append to req.
 */
async function load(req, res, next) {
  try {
    // POPULATE:
    const { id } = req.params;
    // TX:
    req.stockanalysis = await dao.getByStockId(id);
    // RESP:
    return next();
  } catch (error) {
    next(error);
  }
}

async function getOrFetchExt(stockanalysis, stockId, src) {
  const doc = stockanalysis || new StockAnalysis({ stockId });
  const hisKey = utils._getHistoryKey();
  const path = `${src}.${hisKey}`;

  console.log("getOrFetchExt", { path, stockanalysis });

  if (doc.get(path)) return stockanalysis;
  else {
    // FETCH-EXT: (src: yf/rh/rhg)
    const data = await fetchExt.get(src, stockId);
    doc.set(path, data);
    await doc.save();
    return doc;
  }
}

/**
 * Get stockanalysis
 * @returns {StockAnalysis}
 */
function get(req, res) {
  return res.json(req.stockanalysis);
}

/**
 * Get stockanalysis
 * @returns {StockAnalysis}
 */
async function getSrc(req, res) {
  const { id: stockId, src } = req.params;
  const stockanalysis = req.stockanalysis;
  const data = await getOrFetchExt(stockanalysis, stockId, src);
  return res.json(data);
}

/**
 * Get stockanalysis list.
 * List the stockanalysiss in descending order of 'createdAt' timestamp.
 * @property {number} req.query.skip - Number of stockanalysiss to be skipped.
 * @property {number} req.query.limit - Limit number of stockanalysiss to be returned.
 * @returns {StockAnalysis[]}
 */
async function getAll(req, res, next) {
  try {
    // POPULATE:
    const { limit = 50, skip = 0 } = req.query;
    // TX:
    const stockanalysiss = await dao.getAll({ limit, skip });
    // RESP:
    res.json(stockanalysiss);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete stockanalysis.
 * @returns {StockAnalysis}
 */
async function remove(req, res, next) {
  try {
    // POPULATE:
    const stockanalysis = req.stockanalysis;
    // TX:
    const deletedUser = await dao.remove(stockanalysis);
    // RESP:
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete All stockanalysis.
 * @returns {StockAnalysis}
 */
async function removeAll(req, res, next) {
  try {
    // TX:
    const deletedUser = await dao.removeAll();
    // RESP:
    res.json({ message: `${deletedUser.deletedCount} records deleted` });
  } catch (error) {
    next(error);
  }
}

module.exports = { load, get, getSrc, getAll, remove, removeAll };
