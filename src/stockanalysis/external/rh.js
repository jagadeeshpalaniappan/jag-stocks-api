const axios = require("axios");
const _get = require("lodash.get");
const { JSDOM } = require("jsdom");
const { getPage } = require("./utils");
const { fetchStatus } = require("../../modules/common/constants");

const URL = "https://robinhood.com/stocks";

function _getAnalystRating({ document, stockId }) {
  console.log("rh._getAnalystRating:start", { stockId });
  try {
    // get: rating
    const arContainer = document.querySelector("#analyst-ratings");
    let res = { fetchStatus: fetchStatus.NA };
    if (arContainer) {
      const ar = _get(arContainer, "children[1]");
      const nOfAnalysts = _get(
        ar,
        "children[0].children[0].children[1].textContent"
      );
      const buy = _get(ar, "children[1].children[0].children[1].textContent");
      const hold = _get(ar, "children[1].children[1].children[1].textContent");
      const sell = _get(ar, "children[1].children[2].children[1].textContent");

      // rep:
      res = {
        nOfAnalysts: Number(nOfAnalysts.split(" ")[1]),
        buy: Number(buy.slice(0, buy.length - 1)),
        sell: Number(sell.slice(0, sell.length - 1)),
        hold: Number(hold.slice(0, hold.length - 1)),
        createdAt: Date.now(),
        fetchStatus: fetchStatus.COMPLETED,
      };
    }

    console.log("rh._getAnalystRating:end", { stockId });
    return res;
  } catch (err) {
    console.log("rh._getAnalystRating:err", { stockId });
    console.error(err);
  }
}

async function parsePage({ stockId, page }) {
  try {
    console.log("rh.parsePage:start", { stockId });
    const dom = new JSDOM(page);
    const document = dom.window.document;

    // get: 'free' rating
    const res = _getAnalystRating({ document, stockId });

    console.log("rh.parsePage:end", { stockId });
    return res;
  } catch (err) {
    console.log("rh.parsePage:err", { stockId });
    console.error(err);
  }
}

async function get({ stockId }) {
  try {
    console.log("rh.get:start", { stockId });
    const page = await getPage({ url: `${URL}/${stockId}`, stockId });
    const json = await parsePage({ stockId, page });
    console.log("rh.get:end", { stockId });
    return json;
  } catch (err) {
    console.log("rh.get:err", { stockId });
    console.error(err);
  }
}

module.exports = { get };
