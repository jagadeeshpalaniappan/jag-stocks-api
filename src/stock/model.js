const mongoose = require("mongoose");

/**
 * Stock Schema
 */
const StockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    published: Boolean,
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
StockSchema.method({});

/**
 * Statics
 */
StockSchema.statics = {};

/**
 * @typedef Stock
 */
const Stock = mongoose.model("Stock", StockSchema);

module.exports = { StockSchema, Stock };
