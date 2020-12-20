// API: REST-API
const { check, validationResult } = require("express-validator");

const stockSvc = require("../../../modules/stock/service");

async function getStocks(req, res) {
  try {
    // VALIDATE:
    // POPULATE:
    const options = {};
    // TX:
    const { data, meta } = await stockSvc.getStocks(options);
    // RESP:
    res.json({ data, meta });
  } catch (error) {
    console.log("getStocks:err", error);
    res.status(500).json({ error });
  }
}

async function refreshStocks(req, res) {
  try {
    // VALIDATE:
    // POPULATE:
    const { stocks, forceUpdate } = req.query;
    const stockIds = stocks.split(","); //["AAPL"];
    const token = req.headers["rhtoken"];

    // TX:
    const stocksResp = await stockSvc.refreshStocks({
      stockIds,
      token,
      forceUpdate,
    });

    // RESP:
    res.json(stocksResp);
  } catch (error) {
    console.log("refreshStocks:err", error);
    res.status(500).json({ error });
  }
}

// GET: StockAnalysis from DB Cache (if possible)
// GET: StockAnalysis from EXT
async function getStockAnalysis(req, res) {
  try {
    // VALIDATE:
    // POPULATE:
    const token = req.headers["rhtoken"];
    const { stockIds: stockIdDups, forceUpdate } = req.body;
    const stockIds = [...new Set(stockIdDups)];
    console.log("getStockAnalysis:start", { stockIds, forceUpdate });

    // TX:
    const stocksResp = await stockSvc.getStockAnalysis({
      stockIds,
      token,
      forceUpdate,
    });

    // RESP:
    res.json(stocksResp);
  } catch (error) {
    console.log("getStockAnalysis:err", error);
    res.status(500).json({ error });
  }
}

// ---------------- ASYNC ----------------

// GET: fetchExtStockAnalysis
async function fetchExtStockAnalysis(req, res) {
  try {
    // VALIDATE:
    // POPULATE:
    const token = req.headers["rhtoken"];
    const { stockId, extSrc } = req.query;
    console.log("fetchExtStockAnalysis:start", { stockId, extSrc });

    // TX:
    const stocksResp = await stockSvc.fetchExtStockAnalysis({
      stockId,
      extSrc,
      token,
    });

    // RESP:
    res.json(stocksResp);
  } catch (error) {
    console.log("fetchExtStockAnalysis:err", error);
    res.status(500).json({ error });
  }
}

module.exports = {
  getStocks,
  refreshStocks,
  getStockAnalysis,
  fetchExtStockAnalysis,
};
