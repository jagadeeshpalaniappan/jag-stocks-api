const svc = require("./service");

/**
 * Load stockanalysis and append to req.
 */
async function load(req, res, next) {
  try {
    // POPULATE:
    const { id } = req.params;
    // TX:
    req.stockanalysis = await svc.getByStockId(id);
    // RESP:
    return next();
  } catch (error) {
    next(error);
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
async function getOrFetchExt(req, res) {
  const { id: stockId, src } = req.params;
  const { rhgtoken } = req.headers;
  const stockanalysis = req.stockanalysis;
  const data = await svc.getOrFetchExt({
    stockanalysis,
    stockId,
    src,
    rhgtoken,
  });
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
    const stockanalysiss = await svc.getAll({ limit, skip });
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
    const deletedUser = await svc.remove(stockanalysis);
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
    const deletedUser = await svc.removeAll();
    // RESP:
    res.json({ message: `${deletedUser.deletedCount} records deleted` });
  } catch (error) {
    next(error);
  }
}

module.exports = { load, get, getOrFetchExt, getAll, remove, removeAll };
