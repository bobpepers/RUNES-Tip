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
import { patchDeposits } from './helpers/patcher';

logger.info('logger loader');
const schedule = require('node-schedule');
const { startSync } = require('./services/sync');
const {
  Config,
  setRunebaseEnv,
} = require('./services/rclientConfig');

// const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const app = express();
setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

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
  await startSync();
  await patchDeposits();
}());
// startSync();

// patchDeposits();
const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
  patchDeposits();
});

updatePrice();
// Update Price every 5 minutes
const schedulePriceUpdate = schedule.scheduleJob('*/10 * * * *', () => {
  updatePrice();
});

console.log('server listening on:', port);
