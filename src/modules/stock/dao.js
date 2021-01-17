const httpStatus = require("http-status");
const APIError = require("../../app/helpers/APIError");
const { Stock } = require("./model");
const { mongoErrCodes } = require("../common/constants");

/**
 * get: stock
 */
async function getByStockId(stockId) {
  // TX:
  return Stock.findOne({ stockId });
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
async function create(stocks) {
  try {
    // POPULATE:
    const stockDocs = stocks.map((stock) => new Stock(stock));
    // TX:
    const data = await Stock.create(stockDocs);
    return data;
  } catch (error) {
    //duplicate key
    if (error && error.code === mongoErrCodes.DUPLICATE_KEY) {
      throw new APIError(
        `[${obj.stockId}] Stock Already exists! `,
        httpStatus.BAD_REQUEST,
        true
      );
    }
    throw error;
  }
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
