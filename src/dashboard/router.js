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
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import {
  verifyMyCaptcha,
} from './controllers/recaptcha';
import passportService from './services/passport';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';

// import storeIp from './helpers/storeIp';

const requireAuth = passport.authenticate('jwt', { session: true, failWithError: true });
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

  app.get(
    '/api/admin/liability',
    IsAuthenticated,
    isAdmin,
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
    // isUserBanned,
    signin,
    (err, req, res, next) => {
      console.log('123');
      console.log(req);
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
      console.log('Login Successful');
      res.json({
        username: req.username,
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
