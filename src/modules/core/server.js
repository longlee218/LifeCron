require('dotenv').config();
const { createServerApp } = require('./app');
const http = require('http');
const { log, error } = require('console');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { exit } = require('process');
const { createSchema } = require('./api/schema');
const path = require('path');
const fs = require('fs');


let httpServer = undefined;

const serverPort = process.env.PORT || 3000;

const createServer = async () => {
    const dirs = fs.readdirSync(path.join(__dirname, '../')).filter(folder => folder !== 'core');
    console.log(dirs);
    try {
        if (!httpServer) {
            const app = createServerApp();
            httpServer = http.createServer(app);

            const schema = createSchema();

            const apolloServer = new ApolloServer({
                schema: schema,
                plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
            });

            await apolloServer.start();

            apolloServer.applyMiddleware({ app });

            httpServer.listen(serverPort, () => {
                log(`🚀 Server ready at http://localhost:${serverPort}${apolloServer.graphqlPath}`);
            });

            httpServer.on('close', () => {
                httpServer = undefined;
            });
        } else {
            const schema = createSchema();
        }
    } catch (err) {
        error(err);
        exit(1);
    }
};
module.exports = { createServer };
