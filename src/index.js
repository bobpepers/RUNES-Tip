/* eslint-disable import/first */
import { addExitCallback } from 'catch-exit';
import {
  Client,
  Intents,
} from "discord.js";
import _ from 'lodash';
import { Telegraf } from "telegraf";
import PQueue from 'p-queue';
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import schedule from "node-schedule";
import dotenv from 'dotenv';
import passport from 'passport';
import olm from '@matrix-org/olm';
import sdk from 'matrix-js-sdk';
import { router } from "./router";
import { dashboardRouter } from "./dashboard/router";
import { updatePrice } from "./helpers/updatePrice";
import { initDatabaseRecords } from "./helpers/initDatabaseRecords";
import db from "./models";
import getCoinSettings from './config/settings';
import { startKomodoSync } from "./services/syncKomodo";
import { startRunebaseSync } from "./services/syncRunebase";
import { startPirateSync } from "./services/syncPirate";
import { patchRunebaseDeposits } from "./helpers/blockchain/runebase/patcher";
import { patchPirateDeposits } from "./helpers/blockchain/pirate/patcher";
import { patchKomodoDeposits } from "./helpers/blockchain/komodo/patcher";
import { processWithdrawals } from "./services/processWithdrawals";
import {
  recoverDiscordReactdrops,
  recoverDiscordTrivia,
} from './helpers/recover';

global.Olm = olm;

const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./scratch');
const {
  LocalStorageCryptoStore,
} = require('matrix-js-sdk/lib/crypto/store/localStorage-crypto-store');

dotenv.config();
const settings = getCoinSettings();

const queue = new PQueue({
  concurrency: 1,
  timeout: 1000000000,
});

const socketIo = require("socket.io");
const redis = require('redis');

const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  path: '/socket.io',
  cookie: false,
});
const session = require('express-session');

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.set('trust proxy', 1);

const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);
const CONF = { db: 3 };
const pub = redis.createClient(CONF);

const sessionStore = new RedisStore({
  client: pub,
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  key: "connect.sid",
  resave: false,
  proxy: true,
  saveUninitialized: false,
  ephemeral: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb',
}));
app.use(bodyParser.json());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

const sockets = {};

io.on("connection", async (socket) => {
  const userId = socket.request.session.passport ? socket.request.session.passport.user : '';
  if (
    socket.request.user
    && (socket.request.user.role === 4
      || socket.request.user.role === 8)
  ) {
    // console.log('joined admin socket');
    // console.log(userId);
    socket.join('admin');
    sockets[userId] = socket;
  }
  // console.log(Object.keys(sockets).length);
  socket.on("disconnect", () => {
    delete sockets[userId];
    // console.log("Client disconnected");
    // console.log(userId);
  });
});

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
    Intents.FLAGS.GUILD_VOICE_STATES,
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

let matrixClient = sdk.createClient({
  baseUrl: `https://matrix.org`,
});

(async function () {
  let matrixLoginCredentials;
  await telegramClient.launch();
  await discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
  try {
    matrixLoginCredentials = await matrixClient.login("m.login.password", {
      user: process.env.MATRIX_USER,
      password: process.env.MATRIX_PASS,
    });
    matrixClient = sdk.createClient({
      baseUrl: `https://matrix.org`,
      accessToken: matrixLoginCredentials.access_token,
      sessionStore: new sdk.WebStorageSessionStore(localStorage),
      cryptoStore: new LocalStorageCryptoStore(localStorage),
      userId: matrixLoginCredentials.user_id,
      deviceId: matrixLoginCredentials.device_id,
      timelineSupport: true,
    });
  } catch (e) {
    console.log(e);
  }
  await initDatabaseRecords(
    discordClient,
    telegramClient,
  );

  await recoverDiscordReactdrops(
    discordClient,
    io,
    queue,
  );

  await recoverDiscordTrivia(
    discordClient,
    io,
    queue,
  );

  // patch deposits and sync
  if (settings.coin.setting === 'Runebase') {
    await startRunebaseSync(
      discordClient,
      telegramClient,
      matrixClient,
      queue,
    );

    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  } else if (settings.coin.setting === 'Pirate') {
    await startPirateSync(
      discordClient,
      telegramClient,
      matrixClient,
      queue,
    );

    await patchPirateDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchPirateDeposits();
    });
  } else if (settings.coin.setting === 'Komodo') {
    await startKomodoSync(
      discordClient,
      telegramClient,
      matrixClient,
      queue,
    );

    await patchKomodoDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchKomodoDeposits();
    });
  } else {
    await startRunebaseSync(
      discordClient,
      telegramClient,
      matrixClient,
      queue,
    );

    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  }

  router(
    app,
    discordClient,
    telegramClient,
    matrixClient,
    io,
    settings,
    queue,
  );

  dashboardRouter(
    app,
    io,
    discordClient,
    telegramClient,
    matrixClient,
  );

  server.listen(port);
}());

updatePrice();
const schedulePriceUpdate = schedule.scheduleJob('*/20 * * * *', () => { // Update price every 20 minutes
  updatePrice();
});

const scheduleWithdrawal = schedule.scheduleJob('*/5 * * * *', async () => { // Process a withdrawal every 5 minutes
  const autoWithdrawalSetting = await db.features.findOne({
    where: {
      name: 'autoWithdrawal',
    },
  });
  if (autoWithdrawalSetting.enabled) {
    processWithdrawals(
      telegramClient,
      discordClient,
      matrixClient,
    );
  }
});

// Handle olm library process unhandeled rejections
// addExitCallback((signal) => {
//   console.log('signal');
//   console.log(signal);
// });

// global.onerror = () => console.log("global onerror fired");

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection capture');
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('promise');
  console.log(promise);
});

process.on('uncaughtException', (e, origin) => {
  console.log('Unhandled Exception capture');
  console.log('uncaughtException: ', e.stack);
  console.log('origin');
  console.log(origin);
});
global.catch((err) => { /* ignore */ }); // mark error as handled
process.catch((err) => { /* ignore */ }); // mark error as handled

global.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection capture');
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('promise');
  console.log(promise);
});

global.on('uncaughtException', (e, origin) => {
  console.log('Unhandled Exception capture');
  console.log('uncaughtException: ', e.stack);
  console.log('origin');
  console.log(origin);
});

window.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection capture');
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('promise');
  console.log(promise);
});

window.on('uncaughtException', (e, origin) => {
  console.log('Unhandled Exception capture');
  console.log('uncaughtException: ', e.stack);
  console.log('origin');
  console.log(origin);
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

setInterval(() => {
  console.log('app still running');
}, 1000);

// const p = Promise.reject(new Error("err"));

// setTimeout(() => p.catch(() => {}), 86400);

console.log('server listening on:', port);
