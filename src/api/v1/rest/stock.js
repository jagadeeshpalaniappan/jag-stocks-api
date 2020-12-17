// API: REST-API

var router = require("express").Router();
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

module.exports = {
  getStocks,
  refreshStocks,
};
