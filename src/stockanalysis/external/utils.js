const axios = require("axios");
async function getPage({ url, stockId }) {
  try {
    console.log("getPage:start", { stockId });
    const response = await axios.get(url);
    console.log("getPage:end", { stockId });
    return response.data;
  } catch (err) {
    console.log("getPage:err", { stockId });
    console.error(err);
  }
}

module.exports = { getPage };
