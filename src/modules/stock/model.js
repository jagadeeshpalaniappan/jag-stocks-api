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
    stockId: { type: String, required: true, index: true },
    quantity: Number,
    avgPrice: Number,
    buyStats: BuyStatsSchema,
    isResearch: Boolean,
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Foreign keys definitions
StockSchema.virtual("analysis", {
  ref: "StockAnalysis",
  localField: "stockId",
  foreignField: "stockId",
  justOne: true, // for many-to-1 relationships
});

const toJSON = function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
};
// StockSchema.method("toJSON", toJSON);

/**
 * @typedef Stock
 */
const Stock = mongoose.model("Stock", StockSchema, "mystocks");

module.exports = { StockSchema, BuyStatsSchema, Stock };
