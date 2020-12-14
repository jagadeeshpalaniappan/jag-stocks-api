var router = require("express").Router();

router.use("/", require("./rest/index"));
router.use("/graphql", require("./graphql/index"));

router.get("/tmp", (req, res) => {
  res.send("Welcome to 'stocks' REST api");
});

router.get("/tmp1", (req, res) => {
  res.send("Welcome to 'stocks' graphql api");
});

module.exports = router;
