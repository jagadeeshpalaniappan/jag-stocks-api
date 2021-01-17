const mongoose = require("mongoose");

/**
 * StockAnalysis Schema
 */
const StockAnalysisSchema = new mongoose.Schema(
  {
    stockId: { type: String, required: true },
    name: String,
    history: {
      type: Map,
      of: Object,
    },
    yf: {
      type: Map,
      of: Object,
    },
    rh: {
      type: Map,
      of: Object,
    },
    rhg: {
      type: Map,
      of: Object,
    },
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
