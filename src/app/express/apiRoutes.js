const express = require("express");
const stockRoutes = require("../../stock/routes");
// const stockAnalysisRoutes = require("../../stockAnalysis/routes");

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

router.get("/health-check", (req, res) => res.send("OK"));
router.use("/stocks", stockRoutes);
// router.use("/stockanalysis", stockAnalysisRoutes);

module.exports = router;
