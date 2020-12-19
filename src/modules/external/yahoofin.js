const _get = require("lodash.get");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { getPage } = require("./utils");

const { RH_HTML } = require("./utils");
const URL = "https://finance.yahoo.com/quote";

async function parsePage({ stockId, page }) {
  try {
    console.log("yf.parsePage:start");
    let res = {};
    const virtualConsole = new jsdom.VirtualConsole();
    const dom = new JSDOM(page, {
      runScripts: "dangerously",
      virtualConsole,
    });

    // get: rating
    const QuoteSummaryStore =
      dom.window.App.main.context.dispatcher.stores.QuoteSummaryStore;
    if (QuoteSummaryStore) {
      const {
        summaryDetail,
        financialData,
        recommendationTrend,
      } = QuoteSummaryStore;

      const dividendYieldRaw = _get(summaryDetail, "dividendYield.fmt");
      const dividendYield =
        dividendYieldRaw && dividendYieldRaw.length > 0
          ? Number(dividendYieldRaw.slice(0, dividendYieldRaw.length - 1))
          : "";

      res = {
        name: _get(QuoteSummaryStore, "price.shortName"),
        rating: _get(financialData, "recommendationMean.raw"),
        dividendYield,
        numberOfAnalystOpinions: _get(
          financialData,
          "numberOfAnalystOpinions.raw"
        ),
        targetLowPricev: _get(financialData, "targetLowPrice.raw"),
        targetHighPrice: _get(financialData, "targetHighPrice.raw"),
        trend: _get(recommendationTrend, "trend"),
        createdAt: Date.now(),
      };
    }
    // rep:
    console.log("yf.parsePage:end");
    return res;
  } catch (error) {
    console.log("yf.parsePage:err");
    console.error(error);
  }
}

async function get({ stockId }) {
  try {
    console.log("yf.get:start");
    const page = await getPage({ url: `${URL}/${stockId}`, stockId });
    const json = await parsePage({ stockId, page });
    console.log("yf.get:end");
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { get };
