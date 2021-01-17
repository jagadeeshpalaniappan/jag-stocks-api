const { model, Schema } = require("mongoose");

var MyStockSchema = new Schema({
  stockId: String,
  quantity: Number,
  avgPrice: String,
  buyDivident: String,
  buyYfRating: String,
  buyRhRating: String, // TODO: chnage to schema/Obj
  updatedAt: { type: Date, default: Date.now },
});

MyStockSchema.method("toJSON", function () {
  var { _id, ...rest } = this.toObject();
  return { id: _id, ...rest };
});

module.exports = model("MyStock", MyStockSchema, "MyStocks");
