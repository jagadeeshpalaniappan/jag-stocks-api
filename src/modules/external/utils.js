const axios = require("axios");
async function getPage({ url }) {
  try {
    console.log("getPage:start");
    const response = await axios.get(url);
    console.log("getPage:end");
    return response.data;
  } catch (err) {
    console.log("getPage:err");
    console.error(err);
  }
}

module.exports = { getPage };
