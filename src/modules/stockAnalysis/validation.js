const Joi = require("joi");

// GET /api/stockanalysiss/:id
const getOrFetchExt = {
  params: {
    id: Joi.string().required(),
    src: Joi.string().valid("yf", "rh", "rhg").required(),
  },
};

module.exports = { getOrFetchExt };
