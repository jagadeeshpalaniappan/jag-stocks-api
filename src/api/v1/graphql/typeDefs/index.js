let { gql } = require("apollo-server-express");

// common:
// const commonTypeDefs = require("./common");
const stockTypeDefs = require("./stock");
// const postTypeDefs = require("./post");
// const todoTypeDefs = require("./todo");

const baseTypeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    _: Int
  }
`;
const typeDefs = [
  baseTypeDefs,
  // commonTypeDefs,
  stockTypeDefs,
  // postTypeDefs,
  // todoTypeDefs,
];

// const resolvers = {
//   Query: {
//     hello: () => "Hello Jag!!!!!",
//     // ...commonResolvers.Query,
//     ...userResolvers.Query,
//   },
//   Mutation: {
//     // ...commonResolvers.Mutation,
//     // ...userResolvers.Mutation,
//   },
//   // User: userResolvers.User,
// };

module.exports = { typeDefs };
