const http = require('http');
// const fs = require('fs');
// const path = require('path');
const createApolloServer = require('./graphql');
const { createServerApp } = require('./app');
const { Logger } = require('./logger');
const { exit } = require('process');
const { createSchema } = require('./api/schema');
const Environment = require('./environment');

let httpServer = undefined;
const serverPort = Environment.getConfig().server.port;
const log = Logger("modules:core:server");

const createServer = async () => {
    // const dirs = fs.readdirSync(path.join(__dirname, '../')).filter(folder => folder !== 'core');
    try {
        if (!httpServer) {

            // Start app with express server
            const app = await createServerApp();

            // Start http server with express server
            httpServer = http.createServer(app);

            // Start apollo server
            const schema = createSchema();
            const graphqlServer = createApolloServer(schema, httpServer);
            await graphqlServer.start();
            graphqlServer.applyMiddleware({ app });


            httpServer.listen(serverPort, () => log.error(`🚀 Server ready at ${serverPort}${graphqlServer.graphqlPath}`));
            httpServer.on('close', () => httpServer = undefined);
        }
    } catch (err) {
        log.error(err);
        exit(1);
    }
};

module.exports = { createServer };
