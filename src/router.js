import PQueue from 'p-queue';
import walletNotify from './controllers/walletNotify';
import updatePrice from './helpers/updatePrice';

import {
  withdrawTelegramAdminFetch,
  withdrawTelegramAdminAccept,
  withdrawTelegramAdminDecline,
} from './controllers/admin';

import {
  fetchWalletBalance,
  fetchWalletDepositAddress,
  withdrawTelegramCreate,
  tipRunesToUser,
  rainRunesToUsers,
} from './controllers/wallet';

import {
  updateLastSeen,
  createUpdateUser,
} from './controllers/user';

import {
  fetchHelp,
} from './controllers/help';

import {
  fetchReferralCount,
  createReferral,
  fetchReferralTopTen,
} from './controllers/referral';

import fetchPriceInfo from './controllers/price';

import {
  fetchExchangeList,
} from './controllers/exchanges';

// const PQueue = require('p-queue');

const queue = new PQueue({ concurrency: 1 });

const schedule = require('node-schedule');

const appRoot = process.env.PWD;

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const runesGroup = process.env.TELEGRAM_RUNES_GROUP;
const adminTelegramId = 672239325;

const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { startSync } = require('./services/sync');

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 10000,
  limit: 4,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded - please wait 10 seconds'),
};

const bot = new Telegraf(telegramBotToken);
// bot.use(rateLimit(limitConfig));

const router = (app) => {
  app.post('/api/chaininfo/block',
    (req, res) => {
      startSync();
    });

  app.post('/api/rpc/walletnotify',
    walletNotify,
    (req, res) => {
      console.log('afterWalletNotify');
      if (res.locals.error) {
        console.log('walletnotify...');
        console.log(res.locals.error);
      } else if (!res.locals.error && res.locals.transaction) {
        console.log(res.locals.transaction);
        console.log('wtf');
        console.log(runesGroup);
        bot.telegram.sendMessage(runesGroup, `incoming deposit detected
Balance will be reflected on the user wallet in 5 confirmations
https://explorer.runebase.io/tx/${res.locals.transaction[0].txid} 
        `);
        console.log('end insert');
      }
    });

  bot.hears('adminwithdrawals', (ctx) => {
    console.log('botf');
    if (ctx.update.message.from.id === adminTelegramId) {
      // console.log(ctx.from)
      console.log('botg hears admindrawrals');
      (async () => {
        const task = await withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
        await queue.add(() => task);
      })();
    }
  });

  bot.action(/acceptWithdrawal-+/, (ctx) => {
    const withdrawalId = ctx.match.input.substring(17);
    console.log(ctx);
    console.log(adminTelegramId);
    console.log(ctx.update.callback_query.from.id);
    if (ctx.update.callback_query.from.id === adminTelegramId) {
      // console.log(ctx.from)
      console.log('botg hears admindrawrals');

      (async () => {
        const task = await withdrawTelegramAdminAccept(bot, ctx, adminTelegramId, withdrawalId, runesGroup);
        await queue.add(() => task);
      })();
    }
  });

  // method that returns image of a cat

  bot.action(/declineWithdrawal-+/, (ctx) => {
    console.log(ctx);
    const withdrawalId = ctx.match.input.substring(18);
    if (ctx.update.callback_query.from.id === adminTelegramId) {
      // console.log(ctx.from)
      console.log('botg hears admindrawrals');
      (async () => {
        const task = await withdrawTelegramAdminDecline(bot, ctx, adminTelegramId, withdrawalId, runesGroup);
        await queue.add(() => task);
      })();
    }
  });

  bot.command('help', (ctx) => {
    (async () => {
      const task = await fetchHelp(ctx);
      await queue.add(() => task);
    })();
  });

  bot.command('price', (ctx) => {
    (async () => {
      const task = await fetchPriceInfo(ctx);
      await queue.add(() => task);
    })();
  });

  bot.action('Price', (ctx) => {
    console.log(ctx);
    (async () => {
      const task = await fetchPriceInfo(ctx);
      await queue.add(() => task);
    })();
  });

  bot.command('exchanges', (ctx) => {
    (async () => {
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  bot.action('Exchanges', (ctx) => {
    (async () => {
      const task = await fetchExchangeList(ctx);
      await queue.add(() => task);
    })();
  });

  bot.command('balance', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.action('Balance', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.command('tip', (ctx) => {
    const runesTipSplit = ctx.update.message.text.split(' ');
    console.log(runesTipSplit);
    console.log(ctx.update.message.chat);
    if (ctx.update.message.chat.id !== Number(runesGroup)) {
      ctx.reply('can only tip command in RUNES telegram group');
    }
    if (ctx.update.message.chat.id === Number(runesGroup)) {
      if (!runesTipSplit[1]) {
        ctx.reply('insufficient Arguments');
      }
      if (!runesTipSplit[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (runesTipSplit[1] && runesTipSplit[2]) {
        (async () => {
          const tipAmount = runesTipSplit[2];
          const tipTo = runesTipSplit[1];
          const task = await tipRunesToUser(ctx, tipTo, tipAmount, bot, runesGroup);
          await queue.add(() => task);
        })();
      }
    }
  });

  bot.command('rain', (ctx) => {
    const runesTipSplit = ctx.update.message.text.split(' ');
    console.log(runesTipSplit);
    if (ctx.update.message.chat.id !== Number(runesGroup)) {
      ctx.reply('can only rain command in RUNES telegram group');
    }
    if (ctx.update.message.chat.id === Number(runesGroup)) {
      if (!runesTipSplit[1]) {
        ctx.reply('invalid amount of arguments');
      }
      if (runesTipSplit[1]) {
        (async () => {
          const rainAmount = runesTipSplit[1];
          const task = await rainRunesToUsers(ctx, rainAmount, bot, runesGroup);
          await queue.add(() => task);
        })();
      }
    }
  });

  bot.command('deposit', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.action('Deposit', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.command('withdraw', (ctx) => {
    const runesTipSplit = ctx.update.message.text.split(' ');
    console.log(runesTipSplit);

    if (ctx.update.message.chat.type !== 'private' && ctx.update.message.chat.id !== Number(runesGroup)) {
      ctx.reply('can only request withdrawal in private or RUNES group');
    }
    if (ctx.update.message.chat.type === 'private' || ctx.update.message.chat.id === Number(runesGroup)) {
      if (!runesTipSplit[1]) {
        ctx.reply('insufficient Arguments');
      }
      if (!runesTipSplit[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (runesTipSplit[1] && runesTipSplit[2]) {
        (async () => {
          const withdrawalAddress = runesTipSplit[1];
          const withdrawalAmount = runesTipSplit[2];
          const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount);
          await queue.add(() => task);
        })();
      }
    }
  });

  bot.command('referral', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.message.from.id;
      const telegramUserName = ctx.update.message.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.action('Referral', (ctx) => {
    (async () => {
      const telegramUserId = ctx.update.callback_query.from.id;
      const telegramUserName = ctx.update.callback_query.from.username;
      const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
      await queue.add(() => task);
    })();
  });

  bot.command('top', (ctx) => {
    (async () => {
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  bot.action('ReferralTop', (ctx) => {
    (async () => {
      const task = await fetchReferralTopTen(ctx);
      await queue.add(() => task);
    })();
  });

  bot.command('runestip', (ctx) => {
    const runesTipSplit = ctx.update.message.text.split(' ');
    console.log(runesTipSplit);

    if (!runesTipSplit[1]) {
      (async () => {
        const task = await fetchHelp(ctx);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'price') {
      (async () => {
        const task = await fetchPriceInfo(ctx);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'exchanges') {
      (async () => {
        const task = await fetchExchangeList(ctx);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'help') {
      (async () => {
        const task = await fetchHelp(ctx);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'referral' && !runesTipSplit[2]) {
      (async () => {
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'referral' && runesTipSplit[2] === 'top') {
      (async () => {
        const task = await fetchReferralTopTen(ctx);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'balance') {
      (async () => {
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletBalance(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'deposit') {
      (async () => {
        const telegramUserId = ctx.update.message.from.id;
        const telegramUserName = ctx.update.message.from.username;
        const task = await fetchWalletDepositAddress(ctx, telegramUserId, telegramUserName);
        await queue.add(() => task);
      })();
    }
    if (runesTipSplit[1] === 'withdraw') {
      if (ctx.update.message.chat.type !== 'private' && ctx.update.message.chat.id !== Number(runesGroup)) {
        ctx.reply('can only request withdrawal in private or RUNES group');
      }
      if (ctx.update.message.chat.type === 'private' || ctx.update.message.chat.id === Number(runesGroup)) {
        if (!runesTipSplit[2]) {
          ctx.reply('insufficient Arguments');
        }
        if (!runesTipSplit[3]) {
          ctx.reply('insufficient Arguments');
        }
        if (runesTipSplit[2] && runesTipSplit[3]) {
          (async () => {
            const withdrawalAddress = runesTipSplit[2];
            const withdrawalAmount = runesTipSplit[3];
            const task = await withdrawTelegramCreate(ctx, withdrawalAddress, withdrawalAmount);
            await queue.add(() => task);
          })();
        }
      }
    }
    if (runesTipSplit[1] === 'tip') {
      console.log(ctx.update.message.chat);
      if (ctx.update.message.chat.id !== Number(runesGroup)) {
        ctx.reply('can only tip command in RUNES telegram group');
      }
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        if (!runesTipSplit[2]) {
          ctx.reply('insufficient Arguments');
        }
        if (!runesTipSplit[3]) {
          ctx.reply('insufficient Arguments');
        }
        if (runesTipSplit[2] && runesTipSplit[3]) {
          (async () => {
            const tipAmount = runesTipSplit[3];
            const tipTo = runesTipSplit[2];
            const task = await tipRunesToUser(ctx, tipTo, tipAmount, bot, runesGroup);
            await queue.add(() => task);
          })();
        }
      }
    }
    if (runesTipSplit[1] === 'rain') {
      if (ctx.update.message.chat.id !== Number(runesGroup)) {
        ctx.reply('can only rain command in RUNES telegram group');
      }
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        if (!runesTipSplit[2]) {
          ctx.reply('invalid amount of arguments');
        }
        if (runesTipSplit[2]) {
          (async () => {
            const rainAmount = runesTipSplit[2];
            const task = await rainRunesToUsers(ctx, rainAmount, bot, runesGroup);
            await queue.add(() => task);
          })();
        }
      }
    }
    if (runesTipSplit[1] === 'hodlrain') {
      (async () => {
        const task = await fetchWalletBalance(ctx);
        await queue.add(() => task);
      })();
    }
    console.log(ctx);
    console.log(ctx.update.message.entities);
    console.log(runesTipSplit);
    (async () => {
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
    })();
  });

  bot.on('new_chat_members', (ctx) => {
    (async () => {
      console.log(ctx);
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        console.log('test add');
        console.log(ctx.message);
        const task = await createUpdateUser(ctx);
        await queue.add(() => task);
        const taskReferred = await createReferral(ctx, bot, runesGroup);
        await queue.add(() => taskReferred);
      }
    })();
  });

  bot.on('text', (ctx) => {
    (async () => {
      const task = await createUpdateUser(ctx);
      await queue.add(() => task);
      console.log(ctx.update.message.chat.id);
      console.log(Number(runesGroup));
      if (ctx.update.message.chat.id === Number(runesGroup)) {
        const lastSeenTask = await updateLastSeen(ctx);
        await queue.add(() => lastSeenTask);
      }
    })();
  });
  bot.launch();
};

export default router;
