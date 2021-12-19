/* eslint-disable import/first */
import {
  Client,
  Intents,
} from "discord.js";
import { Telegraf } from "telegraf";

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import schedule from "node-schedule";

require('dotenv').config();

import passport from 'passport';
import { router } from "./router";
import { dashboardRouter } from "./dashboard/router";

import { updatePrice } from "./helpers/updatePrice";
import { initDatabaseRecords } from "./helpers/initDatabaseRecords";

// import logger from "./helpers/logger";

import { patchRunebaseDeposits } from "./helpers/runebase/patcher";
import { patchPirateDeposits } from "./helpers/pirate/patcher";
import { reactDropMessage } from "./messages/discord";
import { listenReactDrop } from "./controllers/discord/reactdrop";
import db from "./models";
import getCoinSettings from './config/settings';

const settings = getCoinSettings();

import { startRunebaseSync } from "./services/syncRunebase";
import { startPirateSync } from "./services/syncPirate";
import { processWithdrawals } from "./services/processWithdrawals";

import { consolidatePirate } from "./helpers/pirate/consolidate";

const telegrafGetChatMembers = require('telegraf-getchatmembers');

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
    console.log('joined admin socket');
    socket.join('admin');
    sockets[userId] = socket;
  }
  console.log(Object.keys(sockets).length);
  socket.on("disconnect", () => {
    delete sockets[userId];
    console.log("Client disconnected");
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
telegramClient.use(telegrafGetChatMembers);

router(
  app,
  discordClient,
  telegramClient,
  io,
  settings,
);
dashboardRouter(app, io, discordClient, telegramClient);

server.listen(port);

(async function () {
  await telegramClient.launch();
  await discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
  await initDatabaseRecords();

  // recover reactdrops here listenReactDrop = async (reactMessage, distance, reactDrop)
  const allRunningReactDrops = await db.reactdrop.findAll({
    where: {
      ended: false,
    },
    include: [
      {
        model: db.group,
        as: 'group',
      },
      {
        model: db.channel,
        as: 'channel',
      },
      {
        model: db.user,
        as: 'user',
      },
    ],
  });
  // eslint-disable-next-line no-restricted-syntax
  for (const runningReactDrop of allRunningReactDrops) {
    const actualChannelId = runningReactDrop.channel.channelId.replace('discord-', '');
    const actualGroupId = runningReactDrop.group.groupId.replace('discord-', '');
    const actualUserId = runningReactDrop.user.user_id.replace('discord-', '');

    // eslint-disable-next-line no-await-in-loop
    const reactMessage = await discordClient.guilds.cache.get(actualGroupId)
      .channels.cache.get(actualChannelId)
      .messages.fetch(runningReactDrop.discordMessageId);
    // eslint-disable-next-line no-await-in-loop
    const countDownDate = await runningReactDrop.ends.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    console.log('recover listenReactDrop');
    // eslint-disable-next-line no-await-in-loop
    await listenReactDrop(reactMessage, distance, runningReactDrop, io);
    // eslint-disable-next-line no-loop-func
    const updateMessage = setInterval(async () => {
      now = new Date().getTime();
      distance = countDownDate - now;
      await reactMessage.edit({ embeds: [reactDropMessage(distance, actualUserId, runningReactDrop.emoji, runningReactDrop.amount)] });
      if (distance < 0) {
        clearInterval(updateMessage);
      }
    }, 5000);
  }

  // patch deposits and sync
  if (settings.coin.setting === 'Runebase') {
    await startRunebaseSync(discordClient, telegramClient);
    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  } else if (settings.coin.setting === 'Pirate') {
    await startPirateSync(discordClient, telegramClient);

    await patchPirateDeposits();
    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchPirateDeposits();
    });

    // We're using buildin consolidation function pirate node offers
    // await consolidatePirate();
    // const consolidatePirateCoins = schedule.scheduleJob('10 */1 * * *', () => {
    //  consolidatePirate();
    // });
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

const scheduleWithdrawal = schedule.scheduleJob('*/2 * * * *', async () => { // Process a withdrawal every 2 minutes
  const autoWithdrawalSetting = await db.features.findOne({
    where: {
      name: 'autoWithdrawal',
    },
  });
  if (autoWithdrawalSetting.enabled) {
    processWithdrawals(telegramClient, discordClient);
  }
});

console.log('server listening on:', port);
