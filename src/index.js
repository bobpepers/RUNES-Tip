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

import { patchRunebaseDeposits } from './helpers/runebase/patcher';
import { patchPirateDeposits } from './helpers/pirate/patcher';

logger.info('logger loader');
const schedule = require('node-schedule');
const { startRunebaseSync } = require('./services/syncRunebase');
const { startPirateSync } = require('./services/syncPirate');
const { consolidatePirate } = require('./helpers/pirate/consolidate');

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

const {
  Client,
  Intents,
  GuildMemberManager,
  Options,
} = require('discord.js');
const { Telegraf } = require('telegraf');

const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
  ],
  // makeCache: Options.cacheWithLimits({
  //  GuildEmoji: 5000, // This is default
  // }),
});

const telegramClient = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

router(app, discordClient, telegramClient);

telegramClient.launch();
discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

server.listen(port);
// setRunebaseEnv('Mainnet', process.env.RUNEBASE_ENV_PATH);

(async function () {
  if (process.env.CURRENCY_NAME === 'Runebase') {
    await startRunebaseSync(discordClient, telegramClient);
    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  } else if (process.env.CURRENCY_NAME === 'Pirate') {
    await startPirateSync(discordClient, telegramClient);
    await patchPirateDeposits();
    await consolidatePirate();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchPirateDeposits();
    });
    const consolidatePirateCoins = schedule.scheduleJob('10 */1 * * *', () => {
      consolidatePirate();
    });
  } else {
    await startRunebaseSync(discordClient, telegramClient);
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
