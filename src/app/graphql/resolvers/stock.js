// const xss = require("xss");  // TODO:
const stockSvc = require("../../../../modules/stock/service");

async function stocks(root, args, session) {
  const { options } = args || {};

  // VALIDATE:
  // POPULATE:
  // const options = {};

  // TX:
  const { data, meta } = await stockSvc.getStocks(options);
  // RESP:
  return { data, meta };
}

const resolvers = {
  Query: { stocks },
  // Mutation: {
  //   createUser,
  //   updateUser,
  //   deleteUser,
  // },
  // User: {
  //   posts,
  //   todos,
  // },
};

module.exports = resolvers;
