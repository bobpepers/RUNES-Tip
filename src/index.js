/* eslint-disable import/first */
import {
  Client,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import _ from 'lodash';
import { Telegraf } from "telegraf";
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import PQueue from 'p-queue';
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import schedule from "node-schedule";
import helmet from "helmet";
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
import { consolidateKomodoFunds } from "./helpers/blockchain/komodo/consolidate";
import { consolidateRunebaseFunds } from "./helpers/blockchain/runebase/consolidate";
import { processWithdrawals } from "./services/processWithdrawals";
import {
  recoverDiscordReactdrops,
  recoverDiscordTrivia,
  recoverMatrixReactdrops,
} from './helpers/recover';
import logger from "./helpers/logger";
import { deployCommands } from './helpers/client/discord/deployCommands';

global.Olm = olm;

Object.freeze(Object.prototype);

config();

const checkCSRFRoute = (req) => {
  const hostmachine = req.headers.host.split(':')[0];
  if (
    (
      req.url === '/api/rpc/blocknotify'
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

  app.use(helmet());
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
    // const userId = socket.request.session.passport ? socket.request.session.passport.user : '';
    if (
      socket.request.user
      && (socket.request.user.role === 4
        || socket.request.user.role === 8)
    ) {
      socket.join('admin');
      // sockets[parseInt(userId, 10)] = socket;
    }
    // console.log(Object.keys(sockets).length);
    socket.on("disconnect", () => {
      // delete sockets[parseInt(userId, 10)];
    });
  });

  // Discord
  const discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
    ],
  });

  await discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

  // telegraf client
  const telegramClient = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  await telegramClient.launch();

  // gram.js
  const storeSession = new StoreSession("telegram_session");

  const telegramApiClient = new TelegramClient(
    storeSession,
    Number(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
    },
  );
  await telegramApiClient.start({
    botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
    onError: (err) => console.log(err),
  });
  await telegramApiClient.session.save();
  await telegramApiClient.connect();

  // matrix
  let matrixClient = sdk.createClient({
    baseUrl: `https://matrix.org`,
  });

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

  // Init Database
  await initDatabaseRecords(
    discordClient,
    telegramClient,
    matrixClient,
  );

  await deployCommands(
    process.env.DISCORD_CLIENT_TOKEN,
    discordClient.user.id,
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

    const scheduleRunebaseConsolidation = schedule.scheduleJob('*/1 * * * *', async () => {
      await queue.add(async () => {
        await consolidateRunebaseFunds();
      });
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

    await consolidateKomodoFunds();

    const scheduleKomodoConsolidation = schedule.scheduleJob('*/30 * * * *', async () => {
      await queue.add(async () => {
        await consolidateKomodoFunds();
      });
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

    const scheduleRunebaseConsolidation = schedule.scheduleJob('*/55 * * * *', async () => {
      await queue.add(async () => {
        await consolidateRunebaseFunds();
      });
    });
  }

  router(
    app,
    discordClient,
    telegramClient,
    telegramApiClient,
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
    telegramApiClient,
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

  const scheduleUpdateConversionRatesFiat = schedule.scheduleJob('0 */12 * * *', () => { // Update Fiat conversion rates every 12 hours
    updateConversionRatesFiat();
  });

  updateConversionRatesCrypto();
  const scheduleUpdateConversionRatesCrypto = schedule.scheduleJob('*/15 * * * *', () => { // Update price every 15 minutes
    updateConversionRatesCrypto();
  });

  updatePrice();
  const schedulePriceUpdate = schedule.scheduleJob('*/5 * * * *', () => { // Update price every 5 minutes
    updatePrice();
  });

  const scheduleWithdrawal = schedule.scheduleJob('*/2 * * * *', async () => { // Process a withdrawal every minute
    const autoWithdrawalSetting = await db.features.findOne({
      where: {
        name: 'autoWithdrawal',
      },
    });
    if (autoWithdrawalSetting.enabled) {
      await queue.add(async () => {
        await processWithdrawals(
          telegramClient,
          discordClient,
          matrixClient,
        );
      });
    }
  });

  app.use((err, req, res, next) => {
    if (err.message && err.message === "EMAIL_NOT_VERIFIED") {
      res.status(401).json({
        error: err.message,
        email: err.email,
      });
    } else if (
      (err.message && err === 'LOGIN_FAIL')
      || (err.message && err === 'AUTH_TOKEN_USED')
      || (err.message && err === 'EMAIL_ONLY_ALLOW_LOWER_CASE_INPUT')
    ) {
      res.status(401).json({
        error: err.message,
      });
    } else {
      res.status(500).json({
        error: err.message,
      });
    }
  });

  server.listen(port);
  console.log('server listening on:', port);
}());

process.on('unhandledRejection', async (err, p) => {
  logger.error(`Error Application Unhandled Rejection: ${err}`);
  console.log(err, '\nUnhandled Rejection at Promise\n', p, '\n--------------------------------');
  console.log(err.stack);
});

process.on('uncaughtException', async (err, p) => {
  logger.error(`Error Application Uncaught Exception: ${err}`);
  console.log(err, '\nUnhandled Exception at Promise\n', p, '\n--------------------------------');
  console.log(err.stack);
});
