"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboardRouter = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _auth = require("./controllers/auth");

var _admin = require("./controllers/admin");

var _faucet = require("./controllers/faucet");

var _liability = require("./controllers/liability");

var _balance = require("./controllers/balance");

var _bots = require("./controllers/bots");

var _ip = require("./controllers/ip");

var _servers = require("./controllers/servers");

var _errors = require("./controllers/errors");

var _status = require("./controllers/status");

var _withdrawals = require("./controllers/withdrawals");

var _activity = require("./controllers/activity");

var _features = require("./controllers/features");

var _priceCurrencies = require("./controllers/priceCurrencies");

var _resetPassword = require("./controllers/resetPassword");

var _recaptcha = require("./controllers/recaptcha");

var _trivia = require("./controllers/trivia");

var _dashboardUsers = require("./controllers/dashboardUsers");

var _deposits = require("./controllers/deposits");

var _channels = require("./controllers/channels");

var _blockNumber = require("./controllers/blockNumber");

var _sync = require("./controllers/sync");

var _users = require("./controllers/users");

var _passport2 = _interopRequireDefault(require("./services/passport"));

var _tfa = require("./controllers/tfa");

var _user = require("./controllers/user");

// import storeIp from './helpers/storeIp';
var requireSignin = _passport["default"].authenticate('local', {
  session: true,
  failWithError: true
});

var IsAuthenticated = function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('isauthenticated passed');
    next();
  } else {
    console.log('isAuthenticated not passed');
    res.status(401).send({
      error: 'Unauthorized'
    });
  }
};

var dashboardRouter = function dashboardRouter(app, io, discordClient, telegramClient, matrixClient) {
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
  app.post('/api/withdrawal/accept', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _ip.insertIp, function (req, res, next) {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.matrixClient = matrixClient;
    next();
  }, _withdrawals.acceptWithdrawal, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.withdrawal) {
      res.json({
        withdrawal: res.locals.withdrawal
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/withdrawal/decline', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _ip.insertIp, function (req, res, next) {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.matrixClient = matrixClient;
    next();
  }, _withdrawals.declineWithdrawal, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.withdrawal) {
      res.json({
        withdrawal: res.locals.withdrawal
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/ban/user', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _users.banUser, function (req, res) {
    if (res.locals.user) {
      res.json({
        user: res.locals.user
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/ban/channel', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _channels.banChannel, function (req, res) {
    if (res.locals.channel) {
      res.json({
        channel: res.locals.channel
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/ban/server', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _servers.banServer, function (req, res) {
    if (res.locals.server) {
      res.json({
        server: res.locals.server
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/pricecurrencies', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _priceCurrencies.fetchPriceCurrencies, function (req, res) {
    if (res.locals.currencies) {
      res.json({
        currencies: res.locals.currencies
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/pricecurrencies/remove', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _priceCurrencies.removePriceCurrency, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.currency) {
      res.json({
        currency: res.locals.currency
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/pricecurrencies/update', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _priceCurrencies.updatePriceCurrency, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.currency) {
      res.json({
        currency: res.locals.currency
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/pricecurrencies/add', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _priceCurrencies.addPriceCurrency, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.currency) {
      res.json({
        currency: res.locals.currency
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/pricecurrencies/updateprice', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _priceCurrencies.updatePriceCurrencyPrices, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.currency) {
      res.json({
        currency: true
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/feature/remove', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _features.removeFeature, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.feature) {
      res.json({
        feature: res.locals.feature
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/feature/update', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _features.updateFeature, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.feature) {
      res.json({
        feature: res.locals.feature
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/feature/add', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _features.addFeature, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.feature) {
      res.json({
        feature: res.locals.feature
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/features', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _features.fetchFeatures, function (req, res) {
    if (res.locals.features) {
      res.json({
        features: res.locals.features
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/bot/settings/update', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _bots.updateBotSettings, function (req, res) {
    if (res.locals.settings) {
      res.json({
        settings: res.locals.settings
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/bot/settings', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _bots.fetchBotSettings, function (req, res) {
    if (res.locals.settings) {
      res.json({
        settings: res.locals.settings
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/channels', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _channels.fetchChannels, function (req, res) {
    if (res.locals.channels && res.locals.count >= 0) {
      res.json({
        count: res.locals.count,
        channels: res.locals.channels
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.get('/api/triviaquestions', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _trivia.fetchTriviaQuestions, function (req, res) {
    if (res.locals.error) {
      console.log('found error');
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.trivia) {
      res.json({
        trivia: res.locals.trivia
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/trivia/switch', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _trivia.switchTriviaQuestion, function (req, res) {
    if (res.locals.error) {
      console.log('found error');
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.trivia) {
      res.json({
        trivia: res.locals.trivia
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/trivia/remove', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _trivia.removeTriviaQuestion, function (req, res) {
    if (res.locals.error) {
      console.log('found error');
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.trivia) {
      res.json({
        trivia: res.locals.trivia
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/trivia/insert', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _trivia.insertTrivia, function (req, res) {
    if (res.locals.error) {
      console.log('found error');
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (res.locals.trivia) {
      res.json({
        trivia: res.locals.trivia
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.get('/api/sync/blocks', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _sync.startSyncBlocks, function (req, res) {
    if (res.locals.sync) {
      res.json({
        sync: res.locals.sync
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.get('/api/blocknumber', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _blockNumber.fetchBlockNumber, function (req, res) {
    console.log('after fetchblocknumber');

    if (res.locals.blockNumberNode && res.locals.blockNumberDb) {
      console.log('res.locals.blockNumberNode');
      console.log(res.locals.blockNumberNode);
      res.json({
        blockNumber: {
          node: res.locals.blockNumberNode,
          db: res.locals.blockNumberDb
        }
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/activity', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _activity.fetchActivity, function (req, res) {
    if (res.locals.activity) {
      res.json({
        activity: res.locals.activity
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/withdrawals', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _withdrawals.fetchWithdrawals, function (req, res) {
    if (res.locals.count && res.locals.withdrawals) {
      res.json({
        count: res.locals.count,
        withdrawals: res.locals.withdrawals
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/deposits', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _deposits.fetchDeposits, function (req, res) {
    if (res.locals.count && res.locals.deposits) {
      res.json({
        count: res.locals.count,
        deposits: res.locals.deposits
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/deposits/patch', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _deposits.patchDeposits, function (req, res) {
    res.json({
      deposits: 'true'
    });
  });
  app.get('/api/user', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _user.fetchUser, function (req, res, next) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.user) {
      res.json(res.locals.user);
    }
  });
  app.post('/api/users', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _users.fetchUsers, function (req, res) {
    if (res.locals.count && res.locals.users) {
      res.json({
        count: res.locals.count,
        users: res.locals.users
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/dashboardusers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _dashboardUsers.fetchDashboardUsers, function (req, res) {
    if (res.locals.dashboardusers) {
      res.json({
        dashboardusers: res.locals.dashboardusers
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/servers', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _servers.fetchServers, function (req, res) {
    if (res.locals.servers && res.locals.count) {
      res.json({
        count: res.locals.count,
        servers: res.locals.servers
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.post('/api/errors', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _errors.fetchErrors, function (req, res) {
    if (res.locals.errors) {
      res.json({
        errors: res.locals.errors
      });
    } else {
      res.status(401).send({
        error: "ERROR"
      });
    }
  });
  app.get('/api/status', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _ip.insertIp, _tfa.ensuretfa, _status.fetchNodeStatus, function (req, res) {
    if (res.locals.status && res.locals.peers) {
      res.json({
        status: res.locals.status,
        peers: res.locals.peers
      });
    } else {
      res.status(401).send({
        error: "ERROR"
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
  app.get('/api/faucet/balance', IsAuthenticated, _admin.isAdmin, _auth.isDashboardUserBanned, _tfa.ensuretfa, _faucet.fetchFaucetBalance, function (req, res) {
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
    } else {
      res.json({
        username: req.user.username
      });
    } // console.log('Login Successful');
    // console.log(req.user.username);

  });
  app.post('/api/reset-password', _recaptcha.verifyMyCaptcha, _resetPassword.resetPassword, function (req, res) {
    console.log(res.locals.error);

    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.resetPassword) {
      res.json({
        success: true
      });
    }
  });
  app.post('/api/reset-password/verify', _resetPassword.verifyResetPassword, function (req, res) {
    console.log(res.locals.error);

    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.resetPasswordVerify) {
      res.json({
        success: true
      });
    }
  });
  app.post('/api/reset-password/new', _resetPassword.resetPasswordNew, function (req, res) {
    console.log(res.locals.error);

    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.email && res.locals.username) {
      res.json({
        username: res.locals.username,
        email: res.locals.email
      });
    }
  });
  app.post('/api/2fa/enable', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  _tfa.enabletfa, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.tfa) {
      res.json({
        data: res.locals.tfa
      });
    }
  });
  app.post('/api/2fa/disable', IsAuthenticated, // storeIp,
  _tfa.ensuretfa, // updateLastSeen,
  _tfa.disabletfa, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.success) {
      res.json({
        data: res.locals.tfa
      });
    }
  });
  app.post('/api/2fa/unlock', IsAuthenticated, _auth.isDashboardUserBanned, // storeIp,
  _tfa.unlocktfa, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.success) {
      res.json({
        success: true,
        tfaLocked: false
      });
    }
  });
  app.get('/api/logout', _ip.insertIp, // storeIp,
  _auth.destroySession, function (req, res) {
    // io.emit('Activity', res.locals.activity);
    res.redirect("/");
  });
};

exports.dashboardRouter = dashboardRouter;