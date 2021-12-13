import { config } from "dotenv";
import PQueue from 'p-queue';
import walletNotifyRunebase from '../helpers/runebase/walletNotify';
import walletNotifyPirate from '../helpers/pirate/walletNotify';

import { telegramIncomingDepositMessage } from '../messages/telegram';
import {
  discordIncomingDepositMessage,
} from '../messages/discord';

import logger from "../helpers/logger";
import { startRunebaseSync } from "../services/syncRunebase";
import { startPirateSync } from "../services/syncPirate";
import { discordRouter } from './discord';
import { telegramRouter } from './telegram';

const queue = new PQueue({
  concurrency: 1,
  timeout: 1000000000,
  // intervalCap: 1,
  // interval: 500,
});
config();

const localhostOnly = (req, res, next) => {
  const hostmachine = req.headers.host.split(':')[0];
  if (
    hostmachine !== 'localhost'
    && hostmachine !== '127.0.0.1'
  ) {
    return res.sendStatus(401);
  }
  next();
};

export const router = (
  app,
  discordClient,
  telegramClient,
  io,
  settings,
) => {
  app.post(
    '/api/chaininfo/block',
    localhostOnly,
    (req, res) => {
      console.log('new block found');
      if (settings.coin.setting === 'Runebase') {
        startRunebaseSync(discordClient, telegramClient);
      } else if (settings.coin.setting === 'Pirate') {
        startPirateSync(discordClient, telegramClient);
      } else {
        startRunebaseSync(discordClient, telegramClient);
      }
    },
  );
  if (settings.coin.setting === 'Pirate') {
    app.post(
      '/api/rpc/walletnotify',
      localhostOnly,
      walletNotifyPirate,
      async (req, res) => {
        if (res.locals.error) {
          console.log(res.locals.error);
        } else if (!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount) {
          if (res.locals.platform === 'telegram') {
            telegramClient.telegram.sendMessage(res.locals.userId, telegramIncomingDepositMessage(res));
          }
          if (res.locals.platform === 'discord') {
            const myClient = await discordClient.users.fetch(res.locals.userId, false);
            await myClient.send({ embeds: [discordIncomingDepositMessage(res)] });
          }
        }
      },
    );
  } else {
    app.post(
      '/api/rpc/walletnotify',
      localhostOnly,
      walletNotifyRunebase,
      async (req, res) => {
        if (res.locals.error) {
          console.log(res.locals.error);
        } else if (!res.locals.error && res.locals.transaction && res.locals.userId && res.locals.platform && res.locals.amount) {
          if (res.locals.platform === 'telegram') {
            telegramClient.telegram.sendMessage(res.locals.userId, telegramIncomingDepositMessage(res));
          }
          if (res.locals.platform === 'discord') {
            const myClient = await discordClient.users.fetch(res.locals.userId, false);
            await myClient.send({ embeds: [discordIncomingDepositMessage(res)] });
          }
        }
      },
    );
  }

  discordRouter(discordClient, queue, io, settings);
  telegramRouter(telegramClient, queue, io, settings);
};
