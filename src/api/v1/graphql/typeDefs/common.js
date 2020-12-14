const { gql } = require("apollo-server-express");

const typeDefs = gql`
  input PaginationOptions {
    size: Int
    before: String
    after: String
  }

  type PageMetadata {
    totalSize: Int
    before: String
    after: String
  }
`;

module.exports = typeDefs;
