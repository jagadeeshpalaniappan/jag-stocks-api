// const commonResolvers = require("./common");
const stockResolvers = require("./stock");

const resolvers = {
  Query: {
    hello: () => "Hello Jag1!!!!!",
    ...stockResolvers.Query,
  },
  Mutation: {
    // ...commonResolvers.Mutation,
    // ...userResolvers.Mutation,
    // ...postResolvers.Mutation,
    // ...todoResolvers.Mutation,
  },
  // User: userResolvers.User,
  // Post: postResolvers.Post,
  // Todo: todoResolvers.Todo,
};

module.exports = { resolvers };
