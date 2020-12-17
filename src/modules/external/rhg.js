const axios = require("axios");
const _get = require("lodash.get");

async function _getRhInfo({ stockId }) {
  try {
    console.log("yf._getRhInfo:start");
    const url = `https://api.robinhood.com/instruments/?active_instruments_only=false&symbol=${stockId}`;
    const response = await axios.get(url);
    console.log("yf._getRhInfo:end");
    return response.data;
  } catch (error) {
    console.log("yf._getRhInfo:err");
    console.error(error);
  }
}

async function _getRhGoldRating({ stockId, token }) {
  try {
    if (!token) return;
    const rhInfo = await _getRhInfo({ stockId });
    const rhId = _get(rhInfo, "results[0].id");
    if (!rhId) return;

    const options = {
      url: `https://api.robinhood.com/midlands/ratings/${rhId}/overview/`,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        authorization: `Bearer ${token}`,
      },
      method: "GET",
    };

    console.log("yf._getRhGoldRating:start", options);
    const response = await axios(options);
    console.log("yf._getRhGoldRating:end");
    return response.data;
  } catch (error) {
    console.log("yf._getRhGoldRating:err");
    console.error(error);
  }
}

async function get({ stockId, token }) {
  try {
    console.log("rh.get:start");
    const json = await _getRhGoldRating({ stockId, token });
    console.log("rh.get:end");
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { get };
