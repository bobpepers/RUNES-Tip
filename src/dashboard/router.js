import passport from 'passport';
import {
  signin,
  signup,
  verifyEmail,
  resendVerification,
  destroySession,
  isDashboardUserBanned,
} from './controllers/auth';

import { isAdmin } from './controllers/admin';

import { fetchFaucetBalance } from './controllers/faucet';
import { fetchLiability } from './controllers/liability';
import { fetchBalance } from './controllers/balance';
import {
  fetchBotSettings,
  updateBotSettings,
} from './controllers/bots';

import { insertIp } from './controllers/ip';

import {
  fetchServers,
  banServer,
} from './controllers/servers';

import {
  fetchErrors,
} from './controllers/errors';

import { fetchNodeStatus } from './controllers/status';

import {
  fetchWithdrawals,
  acceptWithdrawal,
  declineWithdrawal,
} from './controllers/withdrawals';

import { fetchActivity } from './controllers/activity';
import {
  fetchFeatures,
  addFeature,
  removeFeature,
  updateFeature,
} from './controllers/features';

import {
  fetchPriceCurrencies,
  addPriceCurrency,
  removePriceCurrency,
  updatePriceCurrency,
  updatePriceCurrencyPrices,
} from './controllers/priceCurrencies';

import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import { verifyMyCaptcha } from './controllers/recaptcha';

import {
  insertTrivia,
  removeTriviaQuestion,
  fetchTriviaQuestions,
  switchTriviaQuestion,
} from './controllers/trivia';

import {
  fetchDashboardUsers,
} from './controllers/dashboardUsers';

import {
  fetchDeposits,
  patchDeposits,
} from './controllers/deposits';

import {
  fetchChannels,
  banChannel,
} from './controllers/channels';

import {
  fetchBlockNumber,
} from './controllers/blockNumber';

import {
  startSyncBlocks,
} from './controllers/sync';

import {
  fetchUsers,
  banUser,
} from './controllers/users';
import passportService from './services/passport';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';

import {
  fetchUser,
} from './controllers/user';

// import storeIp from './helpers/storeIp';

const requireSignin = passport.authenticate('local', {
  session: true,
  failWithError: true,
});

const IsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauthenticated passed');
    next();
  } else {
    console.log('isAuthenticated not passed');
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

export const dashboardRouter = (
  app,
  io,
  discordClient,
  telegramClient,
  matrixClient,
) => {
  app.get(
    '/api/authenticated',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.json({ success: false });
      }
    },
    istfa,
  );

  app.post(
    '/api/signup',
    verifyMyCaptcha,
    insertIp,
    signup,
  );

  app.post(
    '/api/withdrawal/accept',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    (req, res, next) => {
      res.locals.discordClient = discordClient;
      res.locals.telegramClient = telegramClient;
      res.locals.matrixClient = matrixClient;
      next();
    },
    acceptWithdrawal,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.withdrawal) {
        res.json({
          withdrawal: res.locals.withdrawal,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/withdrawal/decline',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    (req, res, next) => {
      res.locals.discordClient = discordClient;
      res.locals.telegramClient = telegramClient;
      res.locals.matrixClient = matrixClient;
      next();
    },
    declineWithdrawal,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.withdrawal) {
        res.json({
          withdrawal: res.locals.withdrawal,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/ban/user',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    banUser,
    (req, res) => {
      if (res.locals.user) {
        res.json({
          user: res.locals.user,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/ban/channel',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    banChannel,
    (req, res) => {
      if (res.locals.channel) {
        res.json({
          channel: res.locals.channel,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/ban/server',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    banServer,
    (req, res) => {
      if (res.locals.server) {
        res.json({
          server: res.locals.server,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/pricecurrencies',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchPriceCurrencies,
    (req, res) => {
      if (res.locals.currencies) {
        res.json({
          currencies: res.locals.currencies,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );
  app.post(
    '/api/pricecurrencies/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    removePriceCurrency,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.currency) {
        res.json({
          currency: res.locals.currency,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/pricecurrencies/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    updatePriceCurrency,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.currency) {
        res.json({
          currency: res.locals.currency,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/pricecurrencies/add',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    addPriceCurrency,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.currency) {
        res.json({
          currency: res.locals.currency,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/pricecurrencies/updateprice',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    updatePriceCurrencyPrices,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.currency) {
        res.json({
          currency: true,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/feature/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    removeFeature,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.feature) {
        res.json({
          feature: res.locals.feature,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );
  app.post(
    '/api/feature/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    updateFeature,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.feature) {
        res.json({
          feature: res.locals.feature,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/feature/add',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    addFeature,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.feature) {
        res.json({
          feature: res.locals.feature,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/features',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchFeatures,
    (req, res) => {
      if (res.locals.features) {
        res.json({
          features: res.locals.features,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/bot/settings/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    updateBotSettings,
    (req, res) => {
      if (res.locals.settings) {
        res.json({
          settings: res.locals.settings,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/bot/settings',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchBotSettings,
    (req, res) => {
      if (res.locals.settings) {
        res.json({
          settings: res.locals.settings,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/channels',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchChannels,
    (req, res) => {
      if (
        res.locals.channels
        && res.locals.count >= 0
      ) {
        res.json({
          count: res.locals.count,
          channels: res.locals.channels,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.get(
    '/api/triviaquestions',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchTriviaQuestions,
    (req, res) => {
      if (res.locals.error) {
        console.log('found error');
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.trivia) {
        res.json({
          trivia: res.locals.trivia,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/trivia/switch',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    switchTriviaQuestion,
    (req, res) => {
      if (res.locals.error) {
        console.log('found error');
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.trivia) {
        res.json({
          trivia: res.locals.trivia,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/trivia/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    removeTriviaQuestion,
    (req, res) => {
      if (res.locals.error) {
        console.log('found error');
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.trivia) {
        res.json({
          trivia: res.locals.trivia,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/trivia/insert',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    insertTrivia,
    (req, res) => {
      if (res.locals.error) {
        console.log('found error');
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (res.locals.trivia) {
        res.json({
          trivia: res.locals.trivia,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.get(
    '/api/sync/blocks',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    startSyncBlocks,
    (req, res) => {
      if (res.locals.sync) {
        res.json({
          sync: res.locals.sync,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.get(
    '/api/blocknumber',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchBlockNumber,
    (req, res) => {
      console.log('after fetchblocknumber');
      if (res.locals.blockNumberNode && res.locals.blockNumberDb) {
        console.log('res.locals.blockNumberNode');
        console.log(res.locals.blockNumberNode);
        res.json({
          blockNumber: {
            node: res.locals.blockNumberNode,
            db: res.locals.blockNumberDb,
          },
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/activity',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchActivity,
    (req, res) => {
      if (res.locals.activity) {
        res.json({
          activity: res.locals.activity,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/withdrawals',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchWithdrawals,
    (req, res) => {
      if (
        res.locals.count
        && res.locals.withdrawals
      ) {
        res.json({
          count: res.locals.count,
          withdrawals: res.locals.withdrawals,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/deposits',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchDeposits,
    (req, res) => {
      if (
        res.locals.count
        && res.locals.deposits
      ) {
        res.json({
          count: res.locals.count,
          deposits: res.locals.deposits,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/deposits/patch',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    patchDeposits,
    (req, res) => {
      res.json({
        deposits: 'true',
      });
    },
  );

  app.get(
    '/api/user',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchUser,
    (req, res, next) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.user) {
        res.json(res.locals.user);
      }
    },
  );

  app.post(
    '/api/users',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchUsers,
    (req, res) => {
      if (
        res.locals.count
        && res.locals.users
      ) {
        res.json({
          count: res.locals.count,
          users: res.locals.users,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );
  app.post(
    '/api/dashboardusers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchDashboardUsers,
    (req, res) => {
      if (res.locals.dashboardusers) {
        res.json({
          dashboardusers: res.locals.dashboardusers,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/servers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchServers,
    (req, res) => {
      if (
        res.locals.servers
        && res.locals.count
      ) {
        res.json({
          count: res.locals.count,
          servers: res.locals.servers,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/errors',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchErrors,
    (req, res) => {
      if (res.locals.errors) {
        res.json({
          errors: res.locals.errors,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.get(
    '/api/status',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    fetchNodeStatus,
    (req, res) => {
      if (res.locals.status && res.locals.peers) {
        res.json({
          status: res.locals.status,
          peers: res.locals.peers,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.get(
    '/api/balance',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    fetchBalance,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.balance) {
        console.log(res.locals.balance);
        res.json({
          balance: res.locals.balance,
        });
      }
    },
  );

  app.get(
    '/api/faucet/balance',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    fetchFaucetBalance,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.balance) {
        console.log(res.locals.balance);
        res.json({
          balance: res.locals.balance,
        });
      }
    },
  );

  app.get(
    '/api/liability',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    fetchLiability,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.liability) {
        console.log(res.locals.liability);
        res.json({
          liability: res.locals.liability,
        });
      }
    },
  );

  app.post(
    '/api/signup/verify-email',
    insertIp,
    verifyEmail,
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: true,
          },
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.user) {
        res.json({
          firstname: res.locals.user.firstname,
          username: res.locals.user.username,
        });
      }
    },
  );

  app.post(
    '/api/resend-verify-code',
    // IsAuthenticated,
    insertIp,
    // rateLimiterMiddlewarePhone,
    // ensuretfa,
    // updateLastSeen,
    resendVerification,
  );

  app.post(
    '/api/signin',
    verifyMyCaptcha,
    // insertIp,
    requireSignin,
    isDashboardUserBanned,
    signin,
    (err, req, res, next) => {
      if (req.authErr === 'EMAIL_NOT_VERIFIED') {
        console.log('EMAIL_NOT_VERIFIED');
        req.session.destroy();
        res.status(401).send({
          error: req.authErr,
          email: res.locals.email,
        });
      } else if (req.authErr) {
        console.log(req.authErr);
        console.log('LOGIN_ERROR');
        req.session.destroy();
        res.status(401).send({
          error: 'LOGIN_ERROR',
        });
      } else {
        res.json({
          username: req.user.username,
        });
      }
      // console.log('Login Successful');
      // console.log(req.user.username);
    },
  );

  app.post(
    '/api/reset-password',
    verifyMyCaptcha,
    resetPassword,
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.resetPassword) {
        res.json({
          success: true,
        });
      }
    },
  );

  app.post(
    '/api/reset-password/verify',
    verifyResetPassword,
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.resetPasswordVerify) {
        res.json({
          success: true,
        });
      }
    },
  );

  app.post(
    '/api/reset-password/new',
    resetPasswordNew,
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.email && res.locals.username) {
        res.json({
          username: res.locals.username,
          email: res.locals.email,
        });
      }
    },
  );

  app.post(
    '/api/2fa/enable',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    enabletfa,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.tfa) {
        res.json({
          data: res.locals.tfa,
        });
      }
    },
  );

  app.post(
    '/api/2fa/disable',
    IsAuthenticated,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    disabletfa,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.success) {
        res.json({
          data: res.locals.tfa,
        });
      }
    },
  );

  app.post(
    '/api/2fa/unlock',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    unlocktfa,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.success) {
        res.json({
          success: true,
          tfaLocked: false,
        });
      }
    },
  );

  app.get(
    '/api/logout',
    insertIp,
    // storeIp,
    destroySession,
    (req, res) => {
      // io.emit('Activity', res.locals.activity);
      res.redirect("/");
    },
  );
};
