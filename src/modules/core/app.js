const express = require('express');
const path = require('path');

const createServerApp = () => {
  const app = express();
  app.enable('trust proxy');
  return app;
};

module.exports = { createServerApp };
