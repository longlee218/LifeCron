const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

module.exports = (schema, accountsGraphQL, httpServer) => {
    return new ApolloServer({
        schema: schema,
        context: async (req, res) => ({
            ...(await accountsGraphQL.context(req)),
        }),
        formatError: (error) =>
            error.message === 'Not Authenticated'
                ? new AuthenticationError(error.message)
                : error,
        playground: false,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
}