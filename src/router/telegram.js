import { config } from "dotenv";
import PQueue from 'p-queue';
import {
  withdrawTelegramAdminFetch,
  withdrawTelegramAdminAccept,
  withdrawTelegramAdminDecline,
} from '../controllers/admin';

import { fetchWalletBalance } from '../controllers/telegram/balance';
import { fetchWalletDepositAddress } from '../controllers/telegram/deposit';
import { withdrawTelegramCreate } from '../controllers/telegram/withdraw';
import { tipRunesToUser } from '../controllers/telegram/tip';
import { rainRunesToUsers } from '../controllers/telegram/rain';

import {
  updateLastSeen,
  createUpdateUser,
} from '../controllers/telegram/user';

import {
  updateGroup,
} from '../controllers/telegram/group';

import {
  fetchHelp,
} from '../controllers/telegram/help';

import {
  fetchReferralCount,
  createReferral,
  fetchReferralTopTen,
} from '../controllers/telegram/referral';

import fetchPriceInfo from '../controllers/telegram/price';

import {
  fetchExchangeList,
} from '../controllers/telegram/exchanges';
import settings from '../config/settings';

import logger from "../helpers/logger";

config();

const queue = new PQueue({ concurrency: 1 });

const runesGroup = process.env.TELEGRAM_RUNES_GROUP;

export const telegramRouter = (telegramClient, io) => {
  telegramClient.hears('adminwithdrawals', (ctx) => {
    if (ctx.update.message.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      // console.log(ctx.from)
      (async () => {
        const task = await withdrawTelegramAdminFetch(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID));
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.action(/acceptWithdrawal-+/, (ctx) => {
    const withdrawalId = ctx.match.input.substring(17);
    if (ctx.update.callback_query.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      (async () => {
        const task = await withdrawTelegramAdminAccept(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID), withdrawalId, runesGroup, discordClient);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.action(/declineWithdrawal-+/, (ctx) => {
    const withdrawalId = ctx.match.input.substring(18);
    if (ctx.update.callback_query.from.id === Number(process.env.TELEGRAM_ADMIN_ID)) {
      (async () => {
        const task = await withdrawTelegramAdminDecline(telegramClient, ctx, Number(process.env.TELEGRAM_ADMIN_ID), withdrawalId, runesGroup, discordClient);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('help', (ctx) => {
    (async () => {
      const task = await fetchHelp(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('price', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchPriceInfo(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Price', (ctx) => {
    console.log(ctx);
    (async () => {
      const task = await fetchPriceInfo(ctx, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('exchanges', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Exchanges', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('balance', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Balance', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('tip', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
    }
    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
    }
    if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const tipAmount = filteredMessageTelegram[2];
        const tipTo = filteredMessageTelegram[1];
        if (groupTask) {
          const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask);
          await queue.add(() => task);
        }
      })();
    }
  });

  telegramClient.command('rain', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('invalid amount of arguments');
    }
    if (filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const rainAmount = filteredMessageTelegram[1];
        const task = await rainRunesToUsers(ctx, rainAmount, telegramClient, runesGroup, io);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('deposit', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Deposit', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('withdraw', (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    if (!filteredMessageTelegram[1]) {
      ctx.reply('insufficient Arguments');
    }
    if (!filteredMessageTelegram[2]) {
      ctx.reply('insufficient Arguments');
    }
    if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const withdrawalAddress = filteredMessageTelegram[1];
        const withdrawalAmount = filteredMessageTelegram[2];
        const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount, io);
        await queue.add(() => task);
      })();
    }
  });

  telegramClient.command('referral', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('Referral', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  telegramClient.command('top', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.action('ReferralTop', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.command(settings.bot.command.telegram, (ctx) => {
    const filteredMessageTelegram = ctx.update.message.text.split(' ');
    console.log(filteredMessageTelegram);

    if (!filteredMessageTelegram[1]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchHelp(ctx, io);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'price') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchPriceInfo(ctx, io);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'exchanges') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchExchangeList(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'help') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchHelp(ctx, io);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2]) {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const task = await fetchReferralTopTen(ctx);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'balance') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName, io);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'deposit') {
      (async () => {
        const groupTask = await updateGroup(ctx);
        await queue.add(() => groupTask);
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName, io);
        await queue.add(() => task);
      })();
    }
    if (filteredMessageTelegram[1] === 'withdraw') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }
      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const withdrawalAddress = filteredMessageTelegram[2];
          const withdrawalAmount = filteredMessageTelegram[3];
          const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount, io);
          await queue.add(() => task);
        })();
      }
    }
    if (filteredMessageTelegram[1] === 'tip') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (!filteredMessageTelegram[3]) {
        ctx.reply('insufficient Arguments');
      }
      if (filteredMessageTelegram[2] && filteredMessageTelegram[3]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const tipAmount = filteredMessageTelegram[3];
          const tipTo = filteredMessageTelegram[2];
          if (groupTask) {
            const task = await tipRunesToUser(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask);
            await queue.add(() => task);
          }
        })();
      }
    }
    if (filteredMessageTelegram[1] === 'rain') {
      if (!filteredMessageTelegram[2]) {
        ctx.reply('invalid amount of arguments');
      }
      if (filteredMessageTelegram[2]) {
        (async () => {
          const groupTask = await updateGroup(ctx);
          await queue.add(() => groupTask);
          const rainAmount = filteredMessageTelegram[2];
          const task = await rainRunesToUsers(ctx, rainAmount, telegramClient, runesGroup, io);
          await queue.add(() => task);
        })();
      }
    }
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
    })();
  });

  telegramClient.on('new_chat_members', (ctx) => {
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      if (settings.coin.name === 'Runebase') {
        if (ctx.update.message.chat.id === Number(runesGroup)) {
          const taskReferred = await createReferral(ctx, telegramClient, runesGroup);
          await queue.add(() => taskReferred);
        }
      }
    })();
  });

  telegramClient.on('text', (ctx) => {
    console.log('found text');
    console.log(ctx.update);
    console.log(ctx.update.message);
    logger.info(`Chat - ${ctx.update.message.chat.id}: ${ctx.update.message.chat.title} : ${ctx.update.message.from.username}: ${ctx.update.message.text}`);
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      const lastSeenTask = await updateLastSeen(ctx);
      await queue.add(() => lastSeenTask);
    })();
  });
  telegramClient.on('message', (ctx) => {
    console.log('found message');
    console.log(ctx.update);
    console.log(ctx.update.message);
    logger.info(`Chat - ${ctx.update.message.chat.id}: ${ctx.update.message.chat.title} : ${ctx.update.message.from.username}: ${ctx.update.message.text}`);
    (async () => {
      const groupTask = await updateGroup(ctx);
      await queue.add(() => groupTask);
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      const lastSeenTask = await updateLastSeen(ctx);
      await queue.add(() => lastSeenTask);
    })();
  });
};
