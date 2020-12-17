const { model, Schema } = require("mongoose");

var StockSchema = new Schema({
  stockId: String,
  name: String,
  yf: Object,
  rh: Object,
  rhg: Object,
  updatedAt: { type: Date, default: Date.now },
});

StockSchema.method("toJSON", function () {
  var { _id, ...rest } = this.toObject();
  return { id: _id, ...rest };
});

module.exports = model("Stock", StockSchema, "Stocks");
