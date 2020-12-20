const axios = require("axios");
const _get = require("lodash.get");
const { fetchStatus } = require("../common/constants");

async function _getRhInfo({ stockId }) {
  try {
    console.log("rhg._getRhInfo:start", { stockId });
    const url = `https://api.robinhood.com/instruments/?active_instruments_only=false&symbol=${stockId}`;
    const response = await axios.get(url);
    console.log("rhg._getRhInfo:end", { stockId });
    return response.data;
  } catch (err) {
    console.log("rhg._getRhInfo:err", { stockId });
    console.error(err);
  }
}

async function _getRhGoldRating({ stockId, token }) {
  try {
    if (!token) return { fetchStatus: fetchStatus.NO_TOKEN };
    const rhInfo = await _getRhInfo({ stockId });
    const rhId = _get(rhInfo, "results[0].id");
    if (!rhId) return { fetchStatus: fetchStatus.NA };

    const options = {
      url: `https://api.robinhood.com/midlands/ratings/${rhId}/overview/`,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        authorization: `Bearer ${token}`,
      },
      method: "GET",
    };

    console.log("rhg._getRhGoldRating:start", { stockId });
    const response = await axios(options);
    console.log("rhg._getRhGoldRating:end", { stockId });
    return { ...response.data, fetchStatus: fetchStatus.COMPLETED };
  } catch (err) {
    const respStatus = _get(err, "response.status");
    console.log("rhg._getRhGoldRating:err", {
      stockId,
      respStatus,
    });
    // console.error(err); // DO-NOT-PRINT
    if (respStatus === 404) return { fetchStatus: fetchStatus.NA };
    if (respStatus === 401) return { fetchStatus: fetchStatus.NO_TOKEN };
  }
}

async function get({ stockId, token }) {
  try {
    console.log("rhg.get:start", { stockId });
    const json = await _getRhGoldRating({ stockId, token });
    console.log("rhg.get:end", { stockId });
    return json;
  } catch (err) {
    console.log("rhg.get:err", { stockId });
    console.error(err);
  }
}

module.exports = { get };
