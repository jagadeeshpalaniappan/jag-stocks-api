const router = require("express").Router();
const validate = require("express-validation");
const ctrl = require("./controller");
const valdn = require("./validation");

router
  .route("/")
  /** GET /api/stockanalysiss - Get list of stockanalysiss */
  .get(ctrl.getAll)

  /** DELETE /api/stockanalysiss - Delete All stockanalysiss */
  .delete(ctrl.removeAll);

/** DELETE /api/stockanalysiss/:id - Delete stockanalysis */
router.route("/:id").get(ctrl.get).delete(ctrl.remove);

router.route("/:id/:src").get(validate(valdn.getSrc), ctrl.getSrc);

/** Load stockanalysis when API with id route parameter is hit */
router.param("id", ctrl.load);

module.exports = router;
