const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Stock {
    id: ID
    stockId: String
    name: String
  }
  type StockPages {
    data: [Stock]
    meta: String
  }
  extend type Query {
    stocks: StockPages # **deprecated** (use with pagination)
    # users(options: UsersQueryOptions): UsersPage
    # user(id: ID!): User
  }
`;

module.exports = typeDefs;
