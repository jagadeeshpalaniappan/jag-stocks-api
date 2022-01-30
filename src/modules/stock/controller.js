const httpStatus = require("http-status");
const APIError = require("../../app/helpers/APIError");
const svc = require("./service");

/**
 * Load stock and append to req.
 */
async function load(req, res, next) {
  try {
    // POPULATE:
    const { id } = req.params;
    // TX:
    const doc = await svc.getByStockId(id);
    // IF-ERR:
    if (!doc) throw new APIError("No such stock exists!", httpStatus.NOT_FOUND);
    req.stock = doc;
    // RESP:
    return next();
  } catch (error) {
    next(error);
  }
}

/**
 * Get stock
 * @returns {Stock}
 */
function get(req, res) {
  return res.json(req.stock);
}

/**
 * Get stock list.
 * List the stocks in descending order of 'createdAt' timestamp.
 * @property {number} req.query.skip - Number of stocks to be skipped.
 * @property {number} req.query.limit - Limit number of stocks to be returned.
 * @returns {Stock[]}
 */
async function getAll(req, res, next) {
  try {
    // POPULATE:
    const { limit = 1000, skip = 0 } = req.query;
    const populates = ["analysis"];
    // TX:
    const data = await svc.getAll({ limit, skip, populates });
    // RESP:
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new stock
 * @property {string} req.body.articlename - The articlename of stock.
 * @property {string} req.body.mobileNumber - The mobileNumber of stock.
 * @returns {Stock}
 */
async function create(req, res, next) {
  try {
    // POPULATE:
    const isMany = Array.isArray(req.body);
    const stocks = isMany ? req.body : [req.body];
    // TX:
    const savedStocks = await svc.create(stocks);
    // RESP:
    const data = isMany ? savedStocks : savedStocks[0];
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing stock
 * @property {string} req.body.articlename - The articlename of stock.
 * @property {string} req.body.mobileNumber - The mobileNumber of stock.
 * @returns {Stock}
 */
async function update(req, res, next) {
  try {
    // POPULATE:
    const { stockId, quantity, avgPrice, buyStats, isResearch, userId } =
      req.body;
    const stock = req.stock;
    if (stockId) stock.stockId = stockId;
    if (quantity) stock.quantity = quantity;
    if (avgPrice) stock.avgPrice = avgPrice;
    if (buyStats) stock.buyStats = buyStats;
    if (isResearch) stock.isResearch = isResearch;
    if (userId) stock.userId = userId;

    // TX:
    const savedStock = await svc.update(stock);
    // RESP:
    res.json(savedStock);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete stock.
 * @returns {Stock}
 */
async function remove(req, res, next) {
  try {
    // POPULATE:
    const stock = req.stock;
    // TX:
    const deletedUser = await svc.remove(stock);
    // RESP:
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete All stock.
 * @returns {Stock}
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

module.exports = { load, get, getAll, create, update, remove, removeAll };
