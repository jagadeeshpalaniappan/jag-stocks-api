const httpStatus = require("http-status");
const { StockAnalysis } = require("./model");
const APIError = require("../app/helpers/APIError");

/**
 * get: stockanalysis
 */
async function get(id) {
  // TX:
  const stockanalysis = await StockAnalysis.findById(id);

  // IF-ERR:
  if (!stockanalysis)
    throw new APIError("No such stockanalysis exists!", httpStatus.NOT_FOUND);

  return stockanalysis;
}

/**
 * Get stockanalysis list.
 * List the stockanalysiss in descending order of 'createdAt' timestamp.
 * @property {number} obj.skip - Number of stockanalysiss to be skipped.
 * @property {number} obj.limit - Limit number of stockanalysiss to be returned.
 * @returns {StockAnalysis[]}
 */
async function getAll({ limit, skip }) {
  return StockAnalysis.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec();
}

/**
 * Create new stockanalysis
 * @property {string} obj.title - The articlename of title.
 * @property {string} obj.description - The description of stockanalysis.
 * @property {string} obj.published - The published of stockanalysis.
 * @returns {StockAnalysis}
 */
async function create(obj) {
  const stockanalysis = new StockAnalysis(obj);
  const savedStockAnalysis = await stockanalysis.save();
  return savedStockAnalysis;
}

/**
 * Update existing stockanalysis
 * @property {string} obj.title - The articlename of title.
 * @property {string} obj.description - The description of stockanalysis.
 * @property {string} obj.published - The published of stockanalysis.
 * @returns {StockAnalysis}
 */
async function update(stockanalysis) {
  const savedStockAnalysis = await stockanalysis.save();
  return savedStockAnalysis;
}

/**
 * Delete stockanalysis.
 * @returns {StockAnalysis}
 */
async function remove(stockanalysis) {
  const deletedUser = await stockanalysis.remove();
  return deletedUser;
}
/**
 * Delete stockanalysis.
 * @returns {StockAnalysis}
 */
async function removeAll(stockanalysis) {
  const deletedUser = await StockAnalysis.deleteMany({});
  return deletedUser;
}

module.exports = { get, getAll, create, update, remove, removeAll };
