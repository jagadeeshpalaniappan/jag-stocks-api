const router = require("express").Router();
const validate = require("express-validation");
const ctrl = require("./controller");
const valdn = require("./validation");

router
  .route("/")
  /** GET /api/stocks - Get list of stocks */
  .get(ctrl.getAll)

  /** POST /api/stocks - Create new stock */
  .post(validate(valdn.create), ctrl.create)

  /** DELETE /api/stocks - Delete All stocks */
  .delete(ctrl.removeAll);

router
  .route("/:id")
  /** GET /api/stocks/:id - Get stock */
  .get(ctrl.get)

  /** PUT /api/stocks/:id - Update stock */
  .put(validate(valdn.update), ctrl.update)

  /** DELETE /api/stocks/:id - Delete stock */
  .delete(ctrl.remove);

/** Load stock when API with id route parameter is hit */
router.param("id", ctrl.load);

module.exports = router;
