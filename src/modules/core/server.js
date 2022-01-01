const http = require('http');
const createApolloServer = require('./graphql');
const Environment = require('./environment');
const { createServerApp } = require('./app');
const { Logger } = require('./logger');
const { createSchema } = require('./api/schema');

let httpServer = undefined;
const startApollo = false;
const serverPort = Environment.getConfig().server.port;

const log = Logger("modules:core:server");
const createServer = async () => {
    try {
        if (!httpServer) {
            let url = `🚀 Server ready at http://127.0.0.1:${serverPort}`;
            const app = createServerApp();
            httpServer = http.createServer(app);
            if (startApollo) {
                const { schema, accountsGraphQL } = await createSchema();
                const graphqlServer = createApolloServer(schema, accountsGraphQL, httpServer);
                await graphqlServer.start();
                graphqlServer.applyMiddleware({ app });
                url = `🚀 Server ready at http://127.0.0.1:${serverPort}${graphqlServer.graphqlPath}`;
            }
            await new Promise(resolve => httpServer.listen({ port: serverPort }, resolve));
            log.info(url);
            httpServer.on('close', () => httpServer = undefined);
        }
    } catch (err) {
        log.error(err);
    }
};

module.exports = { createServer };
