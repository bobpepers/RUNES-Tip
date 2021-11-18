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
  isAdmin,
  fetchAdminLiability,
} from './controllers/admin';

import {
  insertIp,
} from './controllers/ip';

import {
  fetchServers,
} from './controllers/servers';

import {
  fetchNodeStatus,
} from './controllers/status';

import {
  fetchWithdrawals,
} from './controllers/withdrawals';

import {
  fetchActivity,
} from './controllers/activity';

import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import {
  verifyMyCaptcha,
} from './controllers/recaptcha';

import {
  fetchDashboardUsers,
} from './controllers/dashboardUsers';
import {
  fetchDeposits,
} from './controllers/deposits';

import {
  fetchUsers,
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

export const dashboardRouter = (app) => {
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
    '/api/activity',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchActivity,
    (req, res) => {
      if (res.locals.activity) {
        res.json({
          activity: res.locals.activity,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.post(
    '/api/withdrawals',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchWithdrawals,
    (req, res) => {
      if (res.locals.withdrawals) {
        res.json({
          withdrawals: res.locals.withdrawals,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.post(
    '/api/deposits',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchDeposits,
    (req, res) => {
      if (res.locals.deposits) {
        res.json({
          deposits: res.locals.deposits,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.post(
    '/api/users',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchUsers,
    (req, res) => {
      if (res.locals.users) {
        res.json({
          users: res.locals.users,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );
  app.post(
    '/api/dashboardusers',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchDashboardUsers,
    (req, res) => {
      if (res.locals.dashboardusers) {
        res.json({
          dashboardusers: res.locals.dashboardusers,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.post(
    '/api/servers',
    IsAuthenticated,
    isAdmin,
    insertIp,
    fetchServers,
    (req, res) => {
      if (res.locals.servers) {
        res.json({
          servers: res.locals.servers,
        });
      } else {
        res.status(401).send({
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.get(
    '/api/status',
    IsAuthenticated,
    isAdmin,
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
          error: {
            message: "Error",
          },
        });
      }
    },
  );

  app.get(
    '/api/admin/liability',
    IsAuthenticated,
    // isAdmin,
    ensuretfa,
    fetchAdminLiability,
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
    isUserBanned,
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
    isUserBanned,
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
    isUserBanned,
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
