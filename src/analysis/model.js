const mongoose = require("mongoose");

/**
 * StockAnalysis Schema
 */
const StockAnalysisSchema = new mongoose.Schema(
  {
    stockId: { type: String, required: true },
    name: String,
    yf: Object,
    rh: Object,
    rhg: Object,
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
StockAnalysisSchema.method({});

/**
 * Statics
 */
StockAnalysisSchema.statics = {};

/**
 * @typedef StockAnalysis
 */
const StockAnalysis = mongoose.model("StockAnalysis", StockAnalysisSchema);

module.exports = { StockAnalysisSchema, StockAnalysis };
