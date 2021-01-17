const { StockAnalysis } = require("./model");
const dao = require("./dao");
const fetchExt = require("./external");

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

async function getOrFetchExt(stockanalysisDoc, stockId, src) {
  const stockanalysis = stockanalysisDoc || new StockAnalysis({ stockId });
  const { yf, rh, rhg } = stockanalysis || {};

  if (src === "yf") {
    if (yf) return yf;
    else {
      // FETCH-EXT: YF
      stockanalysis.yf = await fetchExt.get("yf", stockId);
      stockanalysis.save();
      return yf;
    }
  } else if (src === "rh") {
    if (rh) return rh;
    else {
      // FETCH-EXT: rh
      stockanalysis.rh = await fetchExt.get("rh", stockId);
      stockanalysis.save();
      return rh;
    }
  } else if (src === "rhg") {
    if (rhg) return rhg;
    else {
      // FETCH-EXT: rhg
      stockanalysis.rhg = await fetchExt.get("rhg", stockId);
      stockanalysis.save();
      return rhg;
    }
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
