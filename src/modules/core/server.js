const http = require('http');
const fs = require('fs');
const path = require('path');
const createApolloServer = require('./graphql');
const Environment = require('./environment');
const { exit } = require('process');
const { createServerApp } = require('./app');
const { Logger } = require('./logger');
const { createSchema } = require('./api/schema');

let httpServer = undefined;
const serverPort = Environment.getConfig().server.port;

const log = Logger("modules:core:server");
const createServer = async () => {
    // Fractal object
    const modules = fs.readdirSync(path.join(__dirname, '../')).filter(folder => folder !== 'core');
    try {
        if (!httpServer) {
            const app = await createServerApp();
            httpServer = http.createServer(app);
            const { schema, accountsGraphQL } = await createSchema();
            const graphqlServer = createApolloServer(schema, accountsGraphQL, httpServer);
            await graphqlServer.start();
            graphqlServer.applyMiddleware({ app });

            await new Promise(resolve => httpServer.listen({ port: serverPort }, resolve));
            log.info(`🚀 Server ready at http://127.0.0.1:${serverPort}${graphqlServer.graphqlPath}`)
            httpServer.on('close', () => httpServer = undefined);
        }
    } catch (err) {
        log.error(err);
        exit(1);
    }
};

module.exports = { createServer };
