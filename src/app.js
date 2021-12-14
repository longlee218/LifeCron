const { server } = require('./modules/core');

Promise.resolve(server.createServer()).catch((error) => console.log(error));
