const httpStatus = require("http-status");
const { Stock } = require("./model");
const APIError = require("../app/helpers/APIError");

/**
 * get: stock
 */
async function getByStockId(stockId) {
  // TX:
  const stock = await Stock.findOne({ stockId });

  // IF-ERR:
  if (!stock) throw new APIError("No such stock exists!", httpStatus.NOT_FOUND);

  return stock;
}

/**
 * Get stock list.
 * List the stocks in descending order of 'createdAt' timestamp.
 * @property {number} obj.skip - Number of stocks to be skipped.
 * @property {number} obj.limit - Limit number of stocks to be returned.
 * @returns {Stock[]}
 */
async function getAll({ limit, skip, populates }) {
  const query = Stock.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit);
  for (const populate of populates) {
    query.populate(populate);
  }
  return query.exec();
}

/**
 * Create new stock
 * @property {string} obj.title - The articlename of title.
 * @property {string} obj.description - The description of stock.
 * @property {string} obj.published - The published of stock.
 * @returns {Stock}
 */
async function create(obj) {
  const stock = new Stock(obj);
  const savedStock = await stock.save();
  return savedStock;
}

/**
 * Update existing stock
 * @property {string} obj.title - The articlename of title.
 * @property {string} obj.description - The description of stock.
 * @property {string} obj.published - The published of stock.
 * @returns {Stock}
 */
async function update(stock) {
  const savedStock = await stock.save();
  return savedStock;
}

/**
 * Delete stock.
 * @returns {Stock}
 */
async function remove(stock) {
  const deletedUser = await stock.remove();
  return deletedUser;
}
/**
 * Delete stock.
 * @returns {Stock}
 */
async function removeAll(stock) {
  const deletedUser = await Stock.deleteMany({});
  return deletedUser;
}

module.exports = { getByStockId, getAll, create, update, remove, removeAll };
