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

module.exports = {
  getStocks,
};
