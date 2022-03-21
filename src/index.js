/* eslint-disable import/first */
import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
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
import { patchRunebaseDeposits } from "./helpers/blockchain/runebase/patcher";
import { patchPirateDeposits } from "./helpers/blockchain/pirate/patcher";
import { patchKomodoDeposits } from "./helpers/blockchain/komodo/patcher";
import {
  reactDropMessage,
  triviaMessageDiscord,
} from "./messages/discord";
import { listenReactDrop } from "./controllers/discord/reactdrop";
import { listenTrivia } from "./controllers/discord/trivia";
import db from "./models";
import getCoinSettings from './config/settings';
import { startKomodoSync } from "./services/syncKomodo";
import { startRunebaseSync } from "./services/syncRunebase";
import { startPirateSync } from "./services/syncPirate";
import { processWithdrawals } from "./services/processWithdrawals";

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

  // recover reactdrops
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
    await listenReactDrop(
      reactMessage,
      distance,
      runningReactDrop,
      io,
      queue,
    );
    // eslint-disable-next-line no-loop-func
    const updateMessage = setInterval(async () => {
      now = new Date().getTime();
      distance = countDownDate - now;
      await reactMessage.edit({
        embeds: [
          reactDropMessage(
            runningReactDrop.id,
            distance,
            actualUserId,
            runningReactDrop.emoji,
            runningReactDrop.amount,
          ),
        ],
      });
      if (distance < 0) {
        clearInterval(updateMessage);
      }
    }, 10000);
  }

  // Recover Trivia
  const allRunningTrivia = await db.trivia.findAll({
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
      {
        model: db.triviaquestion,
        as: 'triviaquestion',
        include: [
          {
            model: db.triviaanswer,
            as: 'triviaanswers',
          },
        ],
      },
    ],
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const runningTrivia of allRunningTrivia) {
    const actualChannelId = runningTrivia.channel.channelId.replace('discord-', '');
    const actualGroupId = runningTrivia.group.groupId.replace('discord-', '');
    const actualUserId = runningTrivia.user.user_id.replace('discord-', '');

    // eslint-disable-next-line no-await-in-loop
    const triviaMessage = await discordClient.guilds.cache.get(actualGroupId)
      .channels.cache.get(actualChannelId)
      .messages.fetch(runningTrivia.discordMessageId);

    // eslint-disable-next-line no-await-in-loop
    const countDownDate = await runningTrivia.ends.getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    const row = new MessageActionRow();
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const answers = _.shuffle(runningTrivia.triviaquestion.triviaanswers);
    let answerString = '';
    let positionAlphabet = 0;
    // console.log(answers);
    // eslint-disable-next-line no-restricted-syntax
    for (const answer of answers) {
      row.addComponents(
        new MessageButton()
          .setCustomId(answer.answer)
          .setLabel(alphabet[parseInt(positionAlphabet, 10)])
          .setStyle('PRIMARY'),
      );
      answerString += `${alphabet[parseInt(positionAlphabet, 10)]}. ${answer.answer}\n`;
      positionAlphabet += 1;
    }
    // eslint-disable-next-line no-await-in-loop
    await triviaMessage.edit({
      embeds: [
        triviaMessageDiscord(
          runningTrivia.id,
          distance,
          actualUserId,
          runningTrivia.triviaquestion.question,
          answerString,
          runningTrivia.amount,
          runningTrivia.userCount,
        ),
      ],
      components: [row],
    });
    // eslint-disable-next-line no-loop-func
    const updateMessage = setInterval(async () => {
      now = new Date().getTime();
      distance = countDownDate - now;
      await triviaMessage.edit({
        embeds: [
          triviaMessageDiscord(
            runningTrivia.id,
            distance,
            actualUserId,
            runningTrivia.triviaquestion.question,
            answerString,
            runningTrivia.amount,
            runningTrivia.userCount,
          ),
        ],
      });
      if (distance < 0) {
        clearInterval(updateMessage);
      }
    }, 10000);
    console.log('recover trivia');
    // eslint-disable-next-line no-await-in-loop
    listenTrivia(
      triviaMessage,
      distance,
      runningTrivia,
      io,
      queue,
      updateMessage,
      answerString,
    );
  }

  /// //////////////

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
process.on('unhandledRejection', (reason, promise) => {
  // log error to database
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

console.log('server listening on:', port);
