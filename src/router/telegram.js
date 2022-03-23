import { config } from "dotenv";
import { fetchHelp } from '../controllers/telegram/help';
import { fetchInfo } from '../controllers/telegram/info';
import { telegramFaucetClaim } from '../controllers/telegram/faucet';
import { fetchWalletBalance } from '../controllers/telegram/balance';
import { fetchWalletDepositAddress } from '../controllers/telegram/deposit';
import { withdrawTelegramCreate } from '../controllers/telegram/withdraw';
import { tipRunesToUser } from '../controllers/telegram/tip';
import { rainRunesToUsers } from '../controllers/telegram/rain';
import { telegramFlood } from '../controllers/telegram/flood';
import { executeTipFunction } from '../helpers/client/telegram/executeTips';
import { disallowDirectMessage } from '../helpers/client/telegram/disallowDirectMessage';

import {
  updateLastSeen,
  createUpdateUser,
} from '../controllers/telegram/user';

import {
  updateGroup,
} from '../controllers/telegram/group';

import {
  fetchReferralCount,
  createReferral,
  fetchReferralTopTen,
} from '../controllers/telegram/referral';

import fetchPriceInfo from '../controllers/telegram/price';

import getCoinSettings from '../config/settings';
import {
  telegramSettings,
  telegramWaterFaucetSettings,
} from '../controllers/telegram/settings';
import { isMaintenanceOrDisabled } from '../helpers/isMaintenanceOrDisabled';

import { myRateLimiter } from '../helpers/rateLimit';

const settings = getCoinSettings();

// import logger from "../helpers/logger";

config();
const { Api, TelegramClient } = require('telegram');
const { StoreSession } = require('telegram/sessions');

const storeSession = new StoreSession("telegram_session");

const telegramApiClient = new TelegramClient(
  storeSession,
  Number(process.env.TELEGRAM_API_ID),
  process.env.TELEGRAM_API_HASH,
  {
    connectionRetries: 5,
  },
);

const runesGroup = process.env.TELEGRAM_RUNES_GROUP;

export const telegramRouter = async (
  telegramClient,
  queue,
  io,
  settings,
) => {
  await telegramApiClient.start({
    botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
    onError: (err) => console.log(err),
  });
  await telegramApiClient.session.save();
  await telegramApiClient.connect();

  telegramClient.command('help', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(async () => {
      const task = await fetchHelp(ctx, io);
    });
  });

  const priceCallBack = async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(async () => {
      const task = await fetchPriceInfo(ctx, io);
    });
  };

  const faucetCallBack = async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(async () => {
      const task = await telegramFaucetClaim(ctx, io);
    });
  };

  const balanceCallBack = async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Balance',
    );
    if (limited) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(async () => {
      const task = await fetchWalletBalance(
        ctx,
        io,
      );
    });
  };

  const infoCallBack = async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(async () => {
      const task = await fetchInfo(
        ctx,
        io,
      );
    });
  };

  const depositCallBack = async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Deposit',
    );
    if (limited) return;
    const groupTask = await updateGroup(ctx);
    await queue.add(() => groupTask);
    await queue.add(async () => {
      const task = await fetchWalletDepositAddress(
        ctx,
        io,
      );
    });
  };

  telegramClient.command('balance', balanceCallBack);
  telegramClient.action('balance', balanceCallBack);
  telegramClient.command('info', infoCallBack);
  telegramClient.action('info', infoCallBack);
  telegramClient.command('faucet', faucetCallBack);
  telegramClient.action('faucet', faucetCallBack);
  telegramClient.command('price', priceCallBack);
  telegramClient.action('price', priceCallBack);
  telegramClient.action('deposit', depositCallBack);
  telegramClient.command('deposit', depositCallBack);

  // telegramClient.command('tip', async (ctx) => {
  //   const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
  //   if (maintenance.maintenance || !maintenance.enabled) return;
  //   const filteredMessageTelegram = ctx.update.message.text.split(' ');
  //   if (!filteredMessageTelegram[1]) {
  //     ctx.reply('insufficient Arguments');
  //   }
  //   if (!filteredMessageTelegram[2]) {
  //     ctx.reply('insufficient Arguments');
  //   }
  //   if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
  //     (async () => {
  //       const groupTask = await updateGroup(ctx);
  //       await queue.add(() => groupTask);
  //       const groupTaskId = groupTask && groupTask.id;
  //       const setting = await telegramSettings(ctx, 'tip', groupTaskId);
  //       await queue.add(() => setting);
  //       if (!setting) return;
  //       const tipAmount = filteredMessageTelegram[2];
  //       const tipTo = filteredMessageTelegram[1];
  //       if (groupTask) {
  //         const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask, setting);
  //         await queue.add(() => task);
  //       }
  //     })();
  //   }
  // });

  telegramClient.command('rain', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Rain',
    );
    if (limited) return;
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('invalid amount of arguments');
    }
    if (filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const groupTaskId = groupTask && groupTask.id;
        const setting = await telegramSettings(ctx, 'rain', groupTaskId);
        await queue.add(() => setting);
        if (!setting) return;
        const rainAmount = filteredMessageTelegram[1];
        const task = await rainRunesToUsers(
          ctx,
          rainAmount,
          telegramClient,
          runesGroup,
          io,
          setting,
        );
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('withdraw', async (ctx) => {
    const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
    if (maintenance.maintenance || !maintenance.enabled) return;
    const limited = await myRateLimiter(
      telegramClient,
      ctx,
      'telegram',
      'Withdraw',
    );
    if (limited) return;

    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
      return;
    }
    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
      return;
    }

    const groupTask = await updateGroup(ctx);
    const groupTaskId = groupTask && groupTask.id;
    const setting = await telegramSettings(
      ctx,
      'withdraw',
      groupTaskId,
    );
    await queue.add(() => setting);
    if (!setting) return;
    const withdrawalAddress = filteredMessageTelegram[1];
    const withdrawalAmount = filteredMessageTelegram[2];
    console.log('before withdrawal create');
    const task = await withdrawTelegramCreate(
      ctx,
      withdrawalAddress,
      withdrawalAmount,
      io,
      setting,
    );
    await queue.add(() => task);
  });

  if (settings.coin.setting === 'Runebase') {
    telegramClient.command('referral', async (ctx) => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    });

    telegramClient.action('Referral', async (ctx) => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    });

    telegramClient.command('top', async (ctx) => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    });

    telegramClient.action('ReferralTop', async (ctx) => {
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    });
  }

  telegramClient.on('new_chat_members', async (ctx) => {
    const groupTask = await updateGroup(ctx);
    await queue.add(() => groupTask);
    const task = await createUpdateUser(ctx);
    await queue.add(() => task);
    if (settings.coin.setting === 'Runebase') {
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        await queue.add(async () => {
          const task = await createReferral(
            ctx,
            telegramClient,
            runesGroup,
          );
        });
      }
    }
  });

  telegramClient.on('text', async (ctx) => {
    let lastSeen;
    await queue.add(async () => {
      await createUpdateUser(ctx);
      lastSeen = await updateLastSeen(ctx);
    });

    const preFilteredMessageTelegram = ctx.update.message.text.split(' ');
    const filteredMessageTelegram = preFilteredMessageTelegram.filter((el) => el !== '');
    const telegramUserId = ctx.update.message.from.id;
    const telegramUserName = ctx.update.message.from.username;

    if (filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram) {
      let disallow;
      const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
      if (maintenance.maintenance || !maintenance.enabled) return;
      const groupTask = await updateGroup(ctx);
      const groupTaskId = groupTask && groupTask.id;

      const faucetSetting = await telegramWaterFaucetSettings(
        groupTaskId,
      );
      if (!faucetSetting) return;

      if (!filteredMessageTelegram[1]) {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Help',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchHelp(ctx, io);
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'help') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Help',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchHelp(ctx, io);
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'price') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Price',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchPriceInfo(ctx, io);
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'info') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Info',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchInfo(
            ctx,
            io,
          );
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'faucet') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Faucet',
        );
        if (limited) return;
        await queue.add(async () => {
          const task = await telegramFaucetClaim(
            ctx,
            io,
          );
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'balance') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Balance',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchWalletBalance(
            ctx,
            io,
          );
        });
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'deposit') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Deposit',
        );
        if (limited) return;

        await queue.add(async () => {
          const task = await fetchWalletDepositAddress(
            ctx,
            io,
          );
        });
      }

      if (settings.coin.setting === 'Runebase') {
        if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
          await queue.add(async () => {
            const task = await fetchReferralCount(
              ctx,
              telegramUserId,
              telegramUserName,
            );
          });
        }
        if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
          await queue.add(async () => {
            const task = await fetchReferralTopTen(ctx);
          });
        }
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'flood') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Flood',
        );
        if (limited) return;
        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'flood',
            io,
          );
        });
        if (disallow) return;

        const setting = await telegramSettings(
          ctx,
          'flood',
          groupTaskId,
        );
        if (!setting) return;

        await executeTipFunction(
          telegramFlood,
          queue,
          filteredMessageTelegram[2],
          telegramClient,
          telegramApiClient,
          ctx,
          filteredMessageTelegram,
          io,
          groupTask,
          setting,
          faucetSetting,
        );
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'withdraw') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Withdraw',
        );
        if (limited) return;

        if (!filteredMessageTelegram[2]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        if (!filteredMessageTelegram[3]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        const setting = await telegramSettings(ctx, 'withdraw', groupTaskId);
        if (!setting) return;
        const withdrawalAddress = filteredMessageTelegram[2];
        const withdrawalAmount = filteredMessageTelegram[3];
        const task = await withdrawTelegramCreate(
          ctx,
          withdrawalAddress,
          withdrawalAmount,
          io,
          setting,
        );
        await queue.add(() => task);
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'tip') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Tip',
        );
        if (limited) return;

        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'tip',
            io,
          );
        });
        if (disallow) return;

        if (!filteredMessageTelegram[2]) {
          ctx.reply('insufficient Arguments');
          return;
        }
        if (!filteredMessageTelegram[3]) {
          ctx.reply('insufficient Arguments');
          return;
        }

        const setting = await telegramSettings(ctx, 'tip', groupTaskId);
        if (!setting) return;
        const tipAmount = filteredMessageTelegram[3];
        const tipTo = filteredMessageTelegram[2];
        if (groupTask) {
          const task = await tipRunesToUser(
            ctx,
            tipTo,
            tipAmount,
            telegramClient,
            runesGroup,
            io,
            groupTask,
            setting,
          );
          await queue.add(() => task);
        }
      }

      if (filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'rain') {
        const limited = await myRateLimiter(
          telegramClient,
          ctx,
          'telegram',
          'Rain',
        );
        if (limited) return;

        await queue.add(async () => {
          disallow = await disallowDirectMessage(
            ctx,
            lastSeen,
            'flood',
            io,
          );
        });
        if (disallow) return;

        if (!filteredMessageTelegram[2]) {
          await ctx.reply('invalid amount of arguments');
          return;
        }

        const setting = await telegramSettings(
          ctx,
          'rain',
          groupTaskId,
        );
        if (!setting) return;
        const rainAmount = filteredMessageTelegram[2];
        const task = await rainRunesToUsers(
          ctx,
          rainAmount,
          telegramClient,
          runesGroup,
          io,
          setting,
        );
        await queue.add(() => task);
      }
    }
  });
};
