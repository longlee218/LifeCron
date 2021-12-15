const express = require('express');

const createServerApp = async () => {
  const app = express();
  app.enable('trust proxy');
  return app;
};

module.exports = { createServerApp };
