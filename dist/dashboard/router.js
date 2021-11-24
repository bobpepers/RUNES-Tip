"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboardRouter = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _auth = require("./controllers/auth");

var _admin = require("./controllers/admin");

var _liability = require("./controllers/liability");

var _balance = require("./controllers/balance");

var _ip = require("./controllers/ip");

var _servers = require("./controllers/servers");

var _status = require("./controllers/status");

var _withdrawals = require("./controllers/withdrawals");

var _activity = require("./controllers/activity");

var _resetPassword = require("./controllers/resetPassword");

var _recaptcha = require("./controllers/recaptcha");

var _dashboardUsers = require("./controllers/dashboardUsers");

var _deposits = require("./controllers/deposits");

var _channels = require("./controllers/channels");

var _users = require("./controllers/users");

var _passport2 = _interopRequireDefault(require("./services/passport"));

var _tfa = require("./controllers/tfa");

// import storeIp from './helpers/storeIp';
// const requireAuth = passport.authenticate('jwt', { session: true, failWithError: true });
var requireSignin = _passport["default"].authenticate('local', {
  session: true,
  failWithError: true
});

var IsAuthenticated = function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('isauthenticated');
    next();
  } else {
    res.status(401).send({
      error: 'Unauthorized'
    });
  }
};

var dashboardRouter = function dashboardRouter(app, io) {
  app.get('/api/authenticated', function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json({
        success: false
      });
    }
  }, _tfa.istfa);
  app.post('/api/signup', _recaptcha.verifyMyCaptcha, _ip.insertIp, _auth.signup);
  app.post('/api/ban/user', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _users.banUser, function (req, res) {
    if (res.locals.user) {
      res.json({
        user: res.locals.user
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/ban/channel', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _channels.banChannel, function (req, res) {
    if (res.locals.channel) {
      res.json({
        channel: res.locals.channel
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/ban/server', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _servers.banServer, function (req, res) {
    if (res.locals.server) {
      res.json({
        server: res.locals.server
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/channels', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _channels.fetchChannels, function (req, res) {
    if (res.locals.channels) {
      res.json({
        channels: res.locals.channels
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/activity', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _activity.fetchActivity, function (req, res) {
    if (res.locals.activity) {
      res.json({
        activity: res.locals.activity
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/withdrawals', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _withdrawals.fetchWithdrawals, function (req, res) {
    if (res.locals.withdrawals) {
      res.json({
        withdrawals: res.locals.withdrawals
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/deposits', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _deposits.fetchDeposits, function (req, res) {
    if (res.locals.deposits) {
      res.json({
        deposits: res.locals.deposits
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/users', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _users.fetchUsers, function (req, res) {
    if (res.locals.users) {
      res.json({
        users: res.locals.users
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/dashboardusers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _dashboardUsers.fetchDashboardUsers, function (req, res) {
    if (res.locals.dashboardusers) {
      res.json({
        dashboardusers: res.locals.dashboardusers
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.post('/api/servers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _servers.fetchServers, function (req, res) {
    if (res.locals.servers) {
      res.json({
        servers: res.locals.servers
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.get('/api/status', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _status.fetchNodeStatus, function (req, res) {
    if (res.locals.status && res.locals.peers) {
      res.json({
        status: res.locals.status,
        peers: res.locals.peers
      });
    } else {
      res.status(401).send({
        error: {
          message: "Error"
        }
      });
    }
  });
  app.get('/api/balance', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _balance.fetchBalance, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }

    if (res.locals.balance) {
      console.log(res.locals.balance);
      res.json({
        balance: res.locals.balance
      });
    }
  });
  app.get('/api/liability', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _liability.fetchLiability, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }

    if (res.locals.liability) {
      console.log(res.locals.liability);
      res.json({
        liability: res.locals.liability
      });
    }
  });
  app.post('/api/signup/verify-email', _ip.insertIp, _auth.verifyEmail, function (req, res) {
    console.log(res.locals.error);

    if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: true
        }
      });
    }

    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }

    if (res.locals.user) {
      res.json({
        firstname: res.locals.user.firstname,
        username: res.locals.user.username
      });
    }
  });
  app.post('/api/resend-verify-code', // IsAuthenticated,
  _ip.insertIp, // rateLimiterMiddlewarePhone,
  // ensuretfa,
  // updateLastSeen,
  _auth.resendVerification);
  app.post('/api/signin', _recaptcha.verifyMyCaptcha, // insertIp,
  requireSignin, _auth.isDashboardUserBanned, _auth.signin, function (err, req, res, next) {
    if (req.authErr === 'EMAIL_NOT_VERIFIED') {
      console.log('EMAIL_NOT_VERIFIED');
      req.session.destroy();
      res.status(401).send({
        error: req.authErr,
        email: res.locals.email
      });
    } else if (req.authErr) {
      console.log(req.authErr);
      console.log('LOGIN_ERROR');
      req.session.destroy();
      res.status(401).send({
        error: 'LOGIN_ERROR'
      });
    } // console.log(req);
    // console.log('Login Successful');
    // console.log(req.user.username);


    res.json({
      username: req.user.username
    });
  });
  app.post('/api/reset-password', _recaptcha.verifyMyCaptcha, _resetPassword.resetPassword);
  app.post('/api/reset-password/verify', _resetPassword.verifyResetPassword);
  app.post('/api/reset-password/new', _resetPassword.resetPasswordNew);
  app.post('/api/2fa/enable', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  _tfa.enabletfa);
  app.post('/api/2fa/disable', IsAuthenticated, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  _tfa.disabletfa);
  app.post('/api/2fa/unlock', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  _tfa.unlocktfa);
  app.get('/api/logout', _ip.insertIp, // storeIp,
  _auth.destroySession, function (req, res) {
    io.emit('Activity', res.locals.activity);
    res.redirect("/");
  });
};

exports.dashboardRouter = dashboardRouter;