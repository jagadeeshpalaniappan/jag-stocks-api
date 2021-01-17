const router = require("express").Router();
const validate = require("express-validation");
const ctrl = require("./controller");
const valdn = require("./validation");

router
  .route("/")
  /** GET /api/stockanalysiss - Get list of stockanalysiss */
  .get(ctrl.getAll)

  /** POST /api/stockanalysiss - Create new stockanalysis */
  .post(validate(valdn.create), ctrl.create)

  /** DELETE /api/stockanalysiss - Delete All stockanalysiss */
  .delete(ctrl.removeAll);

router
  .route("/:id")
  /** GET /api/stockanalysiss/:id - Get stockanalysis */
  .get(ctrl.get)

  /** PUT /api/stockanalysiss/:id - Update stockanalysis */
  .put(validate(valdn.update), ctrl.update)

  /** DELETE /api/stockanalysiss/:id - Delete stockanalysis */
  .delete(ctrl.remove);

/** Load stockanalysis when API with id route parameter is hit */
router.param("id", ctrl.load);

module.exports = router;
