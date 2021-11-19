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
// import logger from "./helpers/logger";

import { patchRunebaseDeposits } from "./helpers/runebase/patcher";
import { patchPirateDeposits } from "./helpers/pirate/patcher";
import { reactDropMessage } from "./messages/discord";
import { listenReactDrop } from "./controllers/discord/reactdrop";
import db from "./models";
import settings from "./config/settings";

import { startRunebaseSync } from "./services/syncRunebase";
import { startPirateSync } from "./services/syncPirate";
import { consolidatePirate } from "./helpers/pirate/consolidate";

const socketIo = require("socket.io");
const redis = require('redis');

const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const app = express();

const server = http.createServer(app);
const io = socketIo(server, { cookie: false });
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

const onlineUsers = {};

io.on("connection", async (socket) => {
  const userId = socket.request.session.passport ? socket.request.session.passport.user : '';

  // console.log(userId);
  // console.log(onlineUsers);
  // console.log(socket.request.user);
  if (socket.request.user.role === 4) {
    socket.join('admin');
  }
  if (userId !== '') {
    onlineUsers[userId] = socket;;
    // onlineUsers.reduce((a, b) => { if (a.indexOf(b) < 0)a.push(b); return a; }, []);
  }
  io.emit('Online', Object.keys(onlineUsers).length);
  // onlineUsers[userId].emit('Private', { msg: "private message" });
  console.log(Object.keys(onlineUsers).length);
  socket.on("disconnect", () => {
    // onlineUsers = onlineUsers.filter((item) => item !== userId);
    delete onlineUsers[userId];
    io.emit("Online", Object.keys(onlineUsers).length);
    console.log(Object.keys(onlineUsers).length);
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
dashboardRouter(app);

server.listen(port);

(async function () {
  await telegramClient.launch();
  await discordClient.login(process.env.DISCORD_CLIENT_TOKEN);
  if (settings.coin.name === 'Runebase') {
    await startRunebaseSync(discordClient, telegramClient);
    await patchRunebaseDeposits();

    const schedulePatchDeposits = schedule.scheduleJob('10 */1 * * *', () => {
      patchRunebaseDeposits();
    });
  } else if (settings.coin.name === 'Pirate') {
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
    await listenReactDrop(reactMessage, distance, runningReactDrop);
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
}());

updatePrice();
const schedulePriceUpdate = schedule.scheduleJob('*/10 * * * *', () => {
  updatePrice();
});

console.log('server listening on:', port);
