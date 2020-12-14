// API: REST-API

var router = require("express").Router();
const { getStocks } = require("./stock");

// -------------------- USER  --------------------
// /api/v1/users
router.get("/stocks", getStocks); // GET-ALL
// router.get("/users/:id", getUser); // GET
// router.post("/users", createUser); // CREATE
// router.put("/users/:id", updateUser); // UPDATE:
// router.delete("/users", deleteAllUser); // DELETE-ALL
// router.delete("/users/:id", deleteUser); // DELETE:

module.exports = router;
