const axios = require("axios");
async function getPage({ url, stockId }) {
  try {
    console.log("yf.getPage:start");
    const response = await axios.get(url);
    console.log("yf.getPage:end");
    return response.data;
  } catch (error) {
    console.log("yf.getPage:err");
    console.error(error);
  }
}

module.exports = { getPage };
