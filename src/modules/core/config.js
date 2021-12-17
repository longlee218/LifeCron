module.exports = {
    /**
     * Development Environment
     */
    development: {
        database: {
            connection: 'mongodb://localhost:27017/lifecron',
            client: 'mongodb',
        },
        server: {
            host: 'localhost',
            port: process.env.PORT || '3000',
            graphiql: true
        },
        logger: {
            debug: 'app*',
            console: {
                level: 'info'
            }
        }
    },

    /**
     * Test Environment
     */
    test: {
        database: {
            connection: 'mongodb://localhost:27017/lifecron-test',
            client: 'mongodb'
        },
        server: {
            host: 'localhost',
            port: process.env.PORT || '3000',
            graphiql: false
        },
        logger: {
            debug: '',
            console: {
                level: 'none'
            }
        }
    },

    /**
     * Production Environment
     */
    production: {
        database: {
            connection: 'mongodb://localhost:27017/lifecron-prod',
            client: 'mongodb'
        },
        server: {
            host: 'localhost',
            port: process.env.PORT || '3000',
            graphiql: false
        },
        logger: {
            debug: '',
            console: {
                level: 'debug'
            }
        }
    }
}