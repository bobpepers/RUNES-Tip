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
import db from './models';
import logger from './helpers/logger';
import { patchDeposits } from './helpers/patcher';

// import drawReferralContest from './helpers/referralContest';

logger.info('logger loader');
const schedule = require('node-schedule');
const { startSync } = require('./services/sync');
const {
  Config,
  setRunebaseEnv,
  getRunebasePath,
  isMainnet,
  getRPCPassword,
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
//startSync();

//patchDeposits();
const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
  patchDeposits();
});

updatePrice();
// Update Price every 5 minutes
const schedulePriceUpdate = schedule.scheduleJob('*/10 * * * *', () => {
  updatePrice();
});

// drawReferralContest(sub, pub, expired_subKey);

// Run every 2 hours at 5 minute mark
// db.cronjob.findOne({
//  where: {
//    type: 'drawJackpot',
//    state: 'executing',
//  },
// }).then((exist) => {
//  const scheduleReferralContestDrawPatcher = schedule.scheduleJob(new Date(exist.expression), (fireDate) => {
//    console.log(`This job was supposed to run at ${fireDate}, but actually ran at ${new Date()}`);
//    drawReferralContest(sub, pub, expired_subKey);
//  });
// }).catch((error) => {
//  console.log(error);
// });

// const scheduleReferralContestDrawPatcher = schedule.scheduleJob('5 */2 * * *', () => {
//  drawReferralContest(sub, pub, expired_subKey);
// });

console.log('server listening on:', port);
