const Joi = require("joi");

// POST /api/stocks
const create = {
  body: {
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string(),
    published: Joi.boolean(),
    userId: Joi.string().required(),
  },
};

// UPDATE /api/stocks/:id
const update = {
  body: {
    title: Joi.string().min(3).max(30),
    description: Joi.string(),
    published: Joi.boolean(),
    userId: Joi.string().required(),
  },
  params: {
    id: Joi.string().hex().required(),
  },
};

module.exports = { create, update };
