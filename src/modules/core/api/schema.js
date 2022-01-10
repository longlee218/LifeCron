const { gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { authenticateAccountJSJWT } = require('../../auth');
const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const createSchema = async () => {
    const authenticate = await authenticateAccountJSJWT();
    const schema = makeExecutableSchema({
        typeDefs: mergeTypeDefs([typeDefs, authenticate.typeDefs]),
        resolvers: mergeResolvers([authenticate.resolvers, resolvers]),
    });
    return { schema, accountsGraphQL: authenticate };
}

module.exports = { createSchema };
