const yf = require("./yahoofin");
const rh = require("./rh");
const rhg = require("./rhg");

function get({ src, stockId, rhgtoken }) {
  if (src === "yf") {
    return yf.get({ stockId });
  } else if (src === "rh") {
    return rh.get({ stockId });
  } else if (src === "rhg") {
    return rhg.get({ stockId, token: rhgtoken });
  }
}

module.exports = { get };
