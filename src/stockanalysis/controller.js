const { StockAnalysis } = require("./model");
const dao = require("./dao");

/**
 * Load stockanalysis and append to req.
 */
async function load(req, res, next) {
  try {
    // POPULATE:
    const { id } = req.params;
    // TX:
    req.stockanalysis = await dao.get(id);
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
 * Create new stockanalysis
 * @property {string} req.body.articlename - The articlename of stockanalysis.
 * @property {string} req.body.mobileNumber - The mobileNumber of stockanalysis.
 * @returns {StockAnalysis}
 */
async function create(req, res, next) {
  try {
    // POPULATE:
    const { title, description, published, userId } = req.body;
    // TX:
    const savedStockAnalysis = await dao.create({
      title,
      description,
      published,
      userId,
    });
    // RESP:
    res.json(savedStockAnalysis);
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing stockanalysis
 * @property {string} req.body.articlename - The articlename of stockanalysis.
 * @property {string} req.body.mobileNumber - The mobileNumber of stockanalysis.
 * @returns {StockAnalysis}
 */
async function update(req, res, next) {
  try {
    // POPULATE:
    const { title, description, published } = req.body;
    const stockanalysis = req.stockanalysis;
    if (title) stockanalysis.title = title;
    if (description) stockanalysis.description = description;
    if (published) stockanalysis.published = published;

    // TX:
    const savedStockAnalysis = await dao.update(stockanalysis);
    // RESP:
    res.json(savedStockAnalysis);
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

module.exports = { load, get, getAll, create, update, remove, removeAll };
