/* eslint-disable import/first */
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
import { config } from "dotenv";
import passport from 'passport';
import olm from '@matrix-org/olm';
import sdk from 'matrix-js-sdk';
import { LocalStorage } from "node-localstorage";
import connectRedis from 'connect-redis';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createClient as createRedisClient } from 'redis';
import socketIo from 'socket.io';
import { LocalStorageCryptoStore } from 'matrix-js-sdk/lib/crypto/store/localStorage-crypto-store';
import csurf from 'csurf';
import { router } from "./router";
import { dashboardRouter } from "./dashboard/router";
import { updatePrice } from "./helpers/price/updatePrice";
import { updateConversionRatesFiat, updateConversionRatesCrypto } from "./helpers/price/updateConversionRates";
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
  recoverMatrixReactdrops,
} from './helpers/recover';
import logger from "./helpers/logger";

global.Olm = olm;

config();

const checkCSRFRoute = (req) => {
  const hostmachine = req.headers.host.split(':')[0];
  if (
    (
      req.url === '/api/chaininfo/block'
      && (
        hostmachine === 'localhost'
        || hostmachine === '127.0.0.1'
      )
    )
    || (
      req.url === '/api/rpc/walletnotify'
      && (
        hostmachine === 'localhost'
        || hostmachine === '127.0.0.1'
      )
    )
  ) {
    return true;
  }
  return false;
};

const conditionalCSRF = function (
  req,
  res,
  next,
) {
  const shouldPass = checkCSRFRoute(req);
  if (shouldPass) {
    return next();
  }
  return csurf({
    cookie: {
      secure: true,
      maxAge: 3600,
    },
  })(
    req,
    res,
    next,
  );
};

(async function () {
  const localStorage = new LocalStorage('./scratch');
  const settings = getCoinSettings();
  const queue = new PQueue({
    concurrency: 1,
    timeout: 1000000000,
  });
  const port = process.env.PORT || 8080;
  const app = express();

  const server = http.createServer(app);
  const io = socketIo(server, {
    path: '/socket.io',
    cookie: false,
  });

  app.use(compression());
  app.use(morgan('combined'));
  app.use(cors());
  app.set('trust proxy', 1);

  const RedisStore = connectRedis(session);

  const redisClient = createRedisClient({
    database: 3,
    legacyMode: true,
  });

  await redisClient.connect();

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    key: "connect.sid",
    resave: false,
    proxy: true,
    saveUninitialized: false,
    ephemeral: false,
    store: new RedisStore({ client: redisClient }),
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

  app.use(conditionalCSRF);
  app.use((req, res, next) => {
    const shouldPass = checkCSRFRoute(req);
    if (shouldPass) {
      return next();
    }
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

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
      socket.join('admin');
      sockets[parseInt(userId, 10)] = socket;
    }
    // console.log(Object.keys(sockets).length);
    socket.on("disconnect", () => {
      delete sockets[parseInt(userId, 10)];
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

  await telegramClient.launch();
  await discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
  try {
    const matrixLoginCredentials = await matrixClient.login("m.login.password", {
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
    matrixClient,
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

  await recoverMatrixReactdrops(
    matrixClient,
    io,
    queue,
  );

  const scheduleUpdateConversionRatesFiat = schedule.scheduleJob('0 */8 * * *', () => { // Update Fiat conversion rates every 8 hours
    updateConversionRatesFiat();
  });

  updateConversionRatesCrypto();
  const scheduleUpdateConversionRatesCrypto = schedule.scheduleJob('*/10 * * * *', () => { // Update price every 10 minutes
    updateConversionRatesCrypto();
  });

  updatePrice();
  const schedulePriceUpdate = schedule.scheduleJob('*/5 * * * *', () => { // Update price every 5 minutes
    updatePrice();
  });

  const scheduleWithdrawal = schedule.scheduleJob('*/8 * * * *', async () => { // Process a withdrawal every 8 minutes
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

  server.listen(port);
  console.log('server listening on:', port);
}());

process.on('unhandledRejection', async (err, p) => {
  logger.error(`Error Application Unhandled Rejection: ${err}`);
  console.log(err, '\nUnhandled Rejection at Promise\n', p, '\n--------------------------------');
});

process.on('uncaughtException', async (err, p) => {
  logger.error(`Error Application Uncaught Exception: ${err}`);
  console.log(err, '\nUnhandled Exception at Promise\n', p, '\n--------------------------------');
});
