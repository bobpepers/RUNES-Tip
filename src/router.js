import passport from 'passport';
import {
  signin,
  signup,
  verifyEmail,
  resendVerification,
  destroySession,
  isUserBanned,
} from './controllers/auth';

import {
  getPhoneCode,
  verifyPhoneCode,
} from './controllers/verifyPhone';

import {
  uploadIdentity,
} from './controllers/identity';

import {
  uploadAvatar,
} from './controllers/upload';

import {
  fetchReferralContests,
  fetchReferralRewards,
  fetchReferralWeekStats,
} from './controllers/referralContests';

import {
  insertIp,
  isIpBanned,
} from './controllers/ip';
import {
  fetchActivity,
  fetchRecentUserActivity,
} from './controllers/activity';
import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';
import {
  // fetchUsers,
  fetchUserCount,
} from './controllers/users';
import trustUser from './controllers/trust';
import blockUser from './controllers/blocked';

import walletNotify from './controllers/walletNotify';
import updatePrice from './helpers/updatePrice';

import {
  isAdmin,
  fetchAdminWithdrawals,
  acceptWithdraw,
  rejectWithdraw,
  fetchAdminUserList,
  fetchAdminUser,
  banAdminUser,
  fetchAdminCountries,
  addAdminCountries,
  addAdminCurrencies,
  fetchAdminCurrencies,
  addAdminPaymentMethod,
  fetchAdminPaymentMethod,
  fetchAdminPendingIdentity,
  acceptAdminPendingIdentity,
  rejectAdminPendingIdentity,
  updateAdminCurrency,
  updateAdminCountry,
  fetchAdminDeposits,
  fetchAdminTrades,
  fetchAdminPendingWithdrawals,
  fetchAdminPendingDisputes,
  fetchAdminPendingWithdrawalsCount,
  fetchAdminPendingIdentityCount,
  fetchAdminPendingDisputeCount,
  fetchAdminCurrentTrade,
  adminCompleteDispute,
  fetchAdminMargin,
  updateAdminMargin,
  updateAdminContestRewards,
  sendAdminMassMail,
  fetchAdminContestRewards,
  fetchAdminNodeBalance,
  fetchAdminLiability,
  withdrawTelegramAdminFetch,
  withdrawTelegramAdminAccept,
  withdrawTelegramAdminDecline,
} from './controllers/admin';

import {
  getLocation,
} from './controllers/location';

import {
  fetchWalletBalance,
  fetchWalletDepositAddress,
  withdrawTelegramCreate,
} from './controllers/wallet';
import {
  createMessage,
  createMessageDispute,
} from './controllers/messages';

import {
  fetchUser,
  fetchSpecificUser,
  updateBio,
  updateStoreStatus,
  updateLastSeen,
  createUpdateUser,
} from './controllers/user';

import {
  verifyMyCaptcha,
  isSurfCaptcha,
} from './helpers/recaptcha';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';
import fetchPriceInfo from './controllers/price';
import fetchPaymentMethods from './controllers/paymentMethods';
import fetchCurrencies from './controllers/currencies';
import fetchCountries from './controllers/countries';
import {
  addPostAd,
  fetchPostAd,
  fetchMyPostAd,
  deactivatePostAd,
} from './controllers/postAd';

import {
  updateFeedback,
  fetchAverageRating,
  removeFeedback,
} from './controllers/feedback';

import { endUnacceptedTrade } from './helpers/trade';

import storeIp from './helpers/storeIp';

import updateUserCountry from './helpers/updateUserCountry';

import {
  rateLimiterMiddlewareUser,
  rateLimiterMiddlewareIp,
  rateLimiterMiddlewarePhone,
} from './helpers/rateLimiter';

import {
  fetchHelp,
} from './controllers/help';

const isbot = require('isbot');
const schedule = require('node-schedule');

const path = require('path');
const multer = require('multer');
const { startSync } = require('./services/sync');

const appRoot = process.env.PWD;

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const runesGroup = process.env.TELEGRAM_RUNES_GROUP;
const adminTelegramId = 672239325;

const { Telegraf } = require('telegraf');

const bot = new Telegraf(telegramBotToken);

const router = (app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers) => {
  app.post('/api/chaininfo/block',
    (req, res) => {
      startSync(io, onlineUsers);
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
      withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
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
      withdrawTelegramAdminAccept(bot, ctx, adminTelegramId, withdrawalId, runesGroup);
    }
  });

  // method that returns image of a cat

  bot.action(/declineWithdrawal-+/, (ctx) => {
    console.log(ctx);
    const withdrawalId = ctx.match.input.substring(18);
    if (ctx.update.callback_query.from.id === adminTelegramId) {
      // console.log(ctx.from)
      console.log('botg hears admindrawrals');
      withdrawTelegramAdminDecline(bot, ctx, adminTelegramId, withdrawalId, runesGroup);
    }
  });

  bot.command('runestip', (ctx) => {
    const runesTipSplit = ctx.update.message.text.split(' ');
    console.log(runesTipSplit);
    if (runesTipSplit[1] === 'help') {
      fetchHelp(ctx);
    }
    if (runesTipSplit[1] === 'balance') {
      fetchWalletBalance(ctx);
    }
    if (runesTipSplit[1] === 'deposit') {
      fetchWalletDepositAddress(ctx);
    }
    if (runesTipSplit[1] === 'withdraw') {
      if (!runesTipSplit[2]) {
        ctx.reply('insufficient Arguments');
      }
      if (!runesTipSplit[3]) {
        ctx.reply('insufficient Arguments');
      }
      if (runesTipSplit[2] && runesTipSplit[3]) {
        withdrawTelegramCreate(ctx, runesTipSplit);
      }
    }
    if (runesTipSplit[1] === 'tip') {
      fetchWalletBalance(ctx);
    }
    if (runesTipSplit[1] === 'rain') {
      fetchWalletBalance(ctx);
    }
    if (runesTipSplit[1] === 'hodlrain') {
      fetchWalletBalance(ctx);
    }
    console.log(ctx);
    console.log(ctx.update.message.entities);
    console.log(runesTipSplit);
    createUpdateUser(ctx);
  });

  bot.on('text', (ctx) => {
    createUpdateUser(ctx);
  });
  bot.launch();
};

export default router;
