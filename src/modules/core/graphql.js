const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

module.exports = (schema, httpServer) => {
    return new ApolloServer({
        schema: schema,
        context: async (req, res) => ({
            req,
            res
        }),
        formatError: (error) =>
            error.message === 'Not Authenticated'
                ? new AuthenticationError(error.message)
                : error,
        playground: false,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
}