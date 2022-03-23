import walletNotifyRunebase from '../helpers/blockchain/runebase/walletNotify';
import walletNotifyPirate from '../helpers/blockchain/pirate/walletNotify';
import walletNotifyKomodo from '../helpers/blockchain/komodo/walletNotify';

import { startRunebaseSync } from "../services/syncRunebase";
import { startPirateSync } from "../services/syncPirate";
import { startKomodoSync } from "../services/syncKomodo";

import { incomingDepositMessageHandler } from '../helpers/messageHandlers';

const localhostOnly = (
  req,
  res,
  next,
) => {
  const hostmachine = req.headers.host.split(':')[0];
  if (
    hostmachine !== 'localhost'
    && hostmachine !== '127.0.0.1'
  ) {
    return res.sendStatus(401);
  }
  next();
};

export const notifyRouter = (
  app,
  discordClient,
  telegramClient,
  matrixClient,
  settings,
  queue,
) => {
  app.post(
    '/api/chaininfo/block',
    localhostOnly,
    (req, res) => {
      if (settings.coin.setting === 'Runebase') {
        startRunebaseSync(
          discordClient,
          telegramClient,
          matrixClient,
          queue,
        );
      } else if (settings.coin.setting === 'Pirate') {
        startPirateSync(
          discordClient,
          telegramClient,
          matrixClient,
          queue,
        );
      } else if (settings.coin.setting === 'Komodo') {
        startKomodoSync(
          discordClient,
          telegramClient,
          matrixClient,
          queue,
        );
      } else {
        startRunebaseSync(
          discordClient,
          telegramClient,
          matrixClient,
          queue,
        );
      }
      res.sendStatus(200);
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
        } else if (!res.locals.error
          && res.locals.transaction
          && res.locals.userId
          && res.locals.platform
          && res.locals.amount
        ) {
          await incomingDepositMessageHandler(
            discordClient,
            telegramClient,
            matrixClient,
            res,
          );
        }
        res.sendStatus(200);
      },
    );
  } else if (settings.coin.setting === 'Komodo') {
    app.post(
      '/api/rpc/walletnotify',
      localhostOnly,
      walletNotifyKomodo,
      async (req, res) => {
        if (res.locals.error) {
          console.log(res.locals.error);
        } else if (!res.locals.error
          && res.locals.transaction
          && res.locals.userId
          && res.locals.platform
          && res.locals.amount
        ) {
          await incomingDepositMessageHandler(
            discordClient,
            telegramClient,
            matrixClient,
            res,
          );
        }
        res.sendStatus(200);
      },
    );
  } else if (settings.coin.setting === 'Runebase') {
    app.post(
      '/api/rpc/walletnotify',
      localhostOnly,
      walletNotifyRunebase,
      async (req, res) => {
        if (res.locals.error) {
          console.log(res.locals.error);
        } else if (!res.locals.error
          && res.locals.transaction
          && res.locals.userId
          && res.locals.platform
          && res.locals.amount
        ) {
          await incomingDepositMessageHandler(
            discordClient,
            telegramClient,
            matrixClient,
            res,
          );
        }
        res.sendStatus(200);
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
        } else if (!res.locals.error
          && res.locals.transaction
          && res.locals.userId
          && res.locals.platform
          && res.locals.amount
        ) {
          await incomingDepositMessageHandler(
            discordClient,
            telegramClient,
            matrixClient,
            res,
          );
        }
        res.sendStatus(200);
      },
    );
  }
};
