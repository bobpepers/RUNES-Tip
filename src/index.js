/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import router from './router';
import updatePrice from './helpers/updatePrice';
// import db from './models';
import logger from './helpers/logger';
import { patchRunebaseDeposits } from './helpers/runebasePatcher';
import { patchPirateDeposits } from './helpers/piratePatcher';

logger.info('logger loader');
const schedule = require('node-schedule');
const { startRunebaseSync } = require('./services/syncRunebase');
const { startPirateSync } = require('./services/syncPirate');
// const {
//  setblockchainNodeEnv,
// } = require('./services/runebaseConfig');

// const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const app = express();
// setblockchainNodeEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

const server = http.createServer(app);

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.set('trust proxy', 1);
// app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb',
}));
app.use(bodyParser.json());

router(app);

server.listen(port);
// setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

(async function () {
  if (process.env.CURRENCY_NAME === 'Runebase') {
    await startRunebaseSync();
    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  } else if (process.env.CURRENCY_NAME === 'Pirate') {
    // await startPirateSync();
    await patchPirateDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchPirateDeposits();
    });
  } else {
    await startRunebaseSync();
    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  }
}());

updatePrice();
const schedulePriceUpdate = schedule.scheduleJob('*/10 * * * *', () => {
  updatePrice();
});

console.log('server listening on:', port);
