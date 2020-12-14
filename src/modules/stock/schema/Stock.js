var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
  stockId: String,
  name: String,
});

stockSchema.method("toJSON", function () {
  var { _id, ...rest } = this.toObject();
  return { id: _id, ...rest };
});

module.exports = mongoose.model("Stock", stockSchema, "Stocks");
