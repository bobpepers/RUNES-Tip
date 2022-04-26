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
import { fetchUserInfo } from './controllers/userInfo';
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

import {
  fetchWithdrawalAddress,
  fetchWithdrawalAddresses,
} from './controllers/withdrawalAddresses';
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

import {
  fetchRain,
  fetchRains,
} from './controllers/rain';

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

const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

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
    use(banUser),
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
    use(banChannel),
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
    use(banServer),
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
    use(fetchPriceCurrencies),
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
    use(removePriceCurrency),
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
    use(updatePriceCurrency),
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
    use(addPriceCurrency),
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
    use(updatePriceCurrencyPrices),
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
    use(removeFeature),
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
    use(updateFeature),
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
    use(addFeature),
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
    use(fetchFeatures),
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
    use(updateBotSettings),
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
    use(fetchBotSettings),
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
    use(fetchChannels),
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
    use(fetchTriviaQuestions),
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
    use(switchTriviaQuestion),
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
    use(removeTriviaQuestion),
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
    use(insertTrivia),
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
    use(startSyncBlocks),
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
    use(fetchBlockNumber),
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
    use(fetchActivity),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.activity.length > 0
      ) {
        res.json({
          count: res.locals.count,
          activity: res.locals.activity,
        });
      } else if (
        res.locals.activity.length < 1
      ) {
        res.status(404).send({
          error: "No records found",
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
    use(fetchWithdrawals),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.withdrawals.length > 0
      ) {
        res.json({
          count: res.locals.count,
          withdrawals: res.locals.withdrawals,
        });
      } else if (
        res.locals.withdrawals.length < 1
      ) {
        res.status(404).send({
          error: "No withdrawal records found",
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
    use(fetchDeposits),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.deposits.length > 0
      ) {
        res.json({
          count: res.locals.count,
          deposits: res.locals.deposits,
        });
      } else if (
        res.locals.deposits.length < 1
      ) {
        res.status(404).send({
          error: "No deposit records found",
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
    use(patchDeposits),
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
    use(fetchUser),
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
    use(fetchUsers),
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
    '/api/rains',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchRains),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.rains
      ) {
        res.json({
          count: res.locals.count,
          rains: res.locals.rains,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/rain',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchRain),
    (req, res) => {
      if (
        res.locals.rain
      ) {
        res.json({
          rain: res.locals.rain,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/withdrawaladdresses',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddresses),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.withdrawalAddresses
      ) {
        res.json({
          count: res.locals.count,
          withdrawalAddresses: res.locals.withdrawalAddresses,
        });
      } else {
        res.status(401).send({
          error: "ERROR",
        });
      }
    },
  );

  app.post(
    '/api/withdrawaladdress',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddress),
    (req, res) => {
      if (
        res.locals.withdrawalAddress
      ) {
        res.json({
          withdrawalAddress: res.locals.withdrawalAddress,
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
    use(fetchDashboardUsers),
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
    use(fetchServers),
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
    '/api/userinfo',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUserInfo),
    (req, res) => {
      if (
        res.locals.user
      ) {
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
    '/api/errors',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchErrors),
    (req, res) => {
      if (
        res.locals.count
        && res.locals.errors.length > 0
      ) {
        res.json({
          count: res.locals.count,
          errors: res.locals.errors,
        });
      } else if (
        res.locals.errors.length < 1
      ) {
        res.status(404).send({
          error: "No records found",
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
    use(fetchNodeStatus),
    (req, res) => {
      if (
        res.locals.status
        && res.locals.peers
      ) {
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
    use(fetchBalance),
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
    use(fetchFaucetBalance),
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
    use(fetchLiability),
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
    use(verifyEmail),
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
    use(resendVerification),
  );

  app.post(
    '/api/signin',
    verifyMyCaptcha,
    // insertIp,
    requireSignin,
    isDashboardUserBanned,
    use(signin),
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
    use(resetPassword),
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
    use(verifyResetPassword),
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
    use(resetPasswordNew),
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
    use(enabletfa),
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
    use(disabletfa),
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
    use(unlocktfa),
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
    use(destroySession),
    (req, res) => {
      // io.emit('Activity', res.locals.activity);
      res.redirect("/");
    },
  );
};
