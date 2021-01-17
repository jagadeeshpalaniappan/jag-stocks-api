const yf = require("./yahoofin");
const rh = require("./rh");
const rhg = require("./rhg");

function get(src, stockId) {
  if (src === "yf") {
    return yf.get({ stockId });
  } else if (src === "rh") {
    return rh.get({ stockId });
  } else if (src === "rhg") {
    return rhg.get({ stockId });
  }
}

module.exports = { get };
