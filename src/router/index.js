import { config } from "dotenv";
import walletNotifyRunebase from '../helpers/runebase/walletNotify';
import walletNotifyPirate from '../helpers/pirate/walletNotify';

import { telegramIncomingDepositMessage } from '../messages/telegram';
import {
  discordIncomingDepositMessage,
} from '../messages/discord';

import settings from '../config/settings';

import logger from "../helpers/logger";

import { startRunebaseSync } from "../services/syncRunebase";
import { startPirateSync } from "../services/syncPirate";
import { discordRouter } from './discord';
import { telegramRouter } from './telegram';

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

export const router = (app, discordClient, telegramClient, io, telegrafGetChatMembers) => {
  app.post(
    '/api/chaininfo/block',
    localhostOnly,
    (req, res) => {
      console.log('new block found');
      if (settings.coin.name === 'Runebase') {
        startRunebaseSync(discordClient, telegramClient);
      } else if (settings.coin.name === 'Pirate') {
        startPirateSync(discordClient, telegramClient);
      } else {
        startRunebaseSync(discordClient, telegramClient);
      }
    },
  );
  if (settings.coin.name === 'Pirate') {
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

  discordRouter(discordClient, io);
  telegramRouter(telegramClient, io, telegrafGetChatMembers);
};
