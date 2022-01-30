const Joi = require("joi");

// POST /api/stocks
const createStock = Joi.object({
  stockId: Joi.string().max(10).required(),
  quantity: Joi.number(),
  avgPrice: Joi.number(),
  buyStats: Joi.object(),
  isResearch: Joi.boolean(),
  userId: Joi.string().required(),
});

const create = {
  body: Joi.alternatives().try(createStock, Joi.array().items(createStock)),
  options: { contextRequest: true },
};

const CreateManySchema = Joi.array().items(create);

// UPDATE /api/stocks/:id
const update = {
  body: {
    title: Joi.string().min(3).max(30),
    description: Joi.string(),
    published: Joi.boolean(),
    userId: Joi.string().required(),
  },
  params: {
    id: Joi.string().required(),
  },
};

module.exports = { create, update };
