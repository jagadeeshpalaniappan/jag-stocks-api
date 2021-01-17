const mongoose = require("mongoose");

const BuyStatsSchema = new mongoose.Schema({
  divident: String,
  yfRating: String,
  rhRating: String,
});

/**
 * Stock Schema
 */
const StockSchema = new mongoose.Schema(
  {
    stockId: { type: String, required: true },
    quantity: Number,
    avgPrice: Number,
    buyStats: BuyStatsSchema,
    isResearch: Boolean,
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * @typedef Stock
 */
const Stock = mongoose.model("Stock", StockSchema);

module.exports = { StockSchema, BuyStatsSchema, Stock };
