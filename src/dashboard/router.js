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
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import { verifyMyCaptcha } from './controllers/recaptcha';

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

// import storeIp from './helpers/storeIp';

// const requireAuth = passport.authenticate('jwt', { session: true, failWithError: true });
const requireSignin = passport.authenticate('local', { session: true, failWithError: true });

const IsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauthenticated');
    next();
  } else {
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

export const dashboardRouter = (app, io, discordClient, telegramClient) => {
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
    insertIp,
    (req, res, next) => {
      res.locals.discordClient = discordClient;
      res.locals.telegramClient = telegramClient;
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
    insertIp,
    (req, res, next) => {
      res.locals.discordClient = discordClient;
      res.locals.telegramClient = telegramClient;
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
    '/api/feature/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
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
    fetchChannels,
    (req, res) => {
      if (res.locals.channels) {
        res.json({
          channels: res.locals.channels,
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
    fetchWithdrawals,
    (req, res) => {
      if (res.locals.withdrawals) {
        res.json({
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
    fetchDeposits,
    (req, res) => {
      if (res.locals.deposits) {
        res.json({
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
    patchDeposits,
    (req, res) => {
      res.json({
        deposits: 'true',
      });
    },
  );

  app.post(
    '/api/users',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    fetchUsers,
    (req, res) => {
      if (res.locals.users) {
        res.json({
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
    fetchServers,
    (req, res) => {
      if (res.locals.servers) {
        res.json({
          servers: res.locals.servers,
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
      }
      // console.log(req);
      // console.log('Login Successful');
      // console.log(req.user.username);
      res.json({
        username: req.user.username,
      });
    },
  );

  app.post(
    '/api/reset-password',
    verifyMyCaptcha,
    resetPassword,
  );

  app.post(
    '/api/reset-password/verify',
    verifyResetPassword,
  );

  app.post(
    '/api/reset-password/new',
    resetPasswordNew,
  );

  app.post(
    '/api/2fa/enable',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    enabletfa,
  );

  app.post(
    '/api/2fa/disable',
    IsAuthenticated,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    disabletfa,
  );

  app.post(
    '/api/2fa/unlock',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    unlocktfa,
  );

  app.get(
    '/api/logout',
    insertIp,
    // storeIp,
    destroySession,
    (req, res) => {
      io.emit('Activity', res.locals.activity);
      res.redirect("/");
    },
  );
};
