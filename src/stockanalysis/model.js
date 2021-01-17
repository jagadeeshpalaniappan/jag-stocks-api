const mongoose = require("mongoose");

/**
 * StockAnalysis Schema
 */
const StockAnalysisSchema = new mongoose.Schema(
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
