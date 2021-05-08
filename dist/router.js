'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('./controllers/auth');

var _ip = require('./controllers/ip');

var _activity = require('./controllers/activity');

var _resetPassword = require('./controllers/resetPassword');

var _users = require('./controllers/users');

var _domain = require('./controllers/domain');

var _webslot = require('./controllers/webslot');

var _walletNotify = require('./controllers/walletNotify');

var _walletNotify2 = _interopRequireDefault(_walletNotify);

var _order = require('./controllers/order');

var _faucet = require('./controllers/faucet');

var _admin = require('./controllers/admin');

var _surf = require('./controllers/surf');

var _wallet = require('./controllers/wallet');

var _jackpot = require('./controllers/jackpot');

var _jackpot2 = _interopRequireDefault(_jackpot);

var _user = require('./controllers/user');

var _passport3 = require('./services/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _recaptcha = require('./helpers/recaptcha');

var _tfa = require('./controllers/tfa');

var _price = require('./controllers/price');

var _price2 = _interopRequireDefault(_price);

var _storeIp = require('./helpers/storeIp');

var _storeIp2 = _interopRequireDefault(_storeIp);

var _rateLimiter = require('./helpers/rateLimiter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rateLimit = require("express-rate-limit");

var _require = require('./services/sync'),
    startSync = _require.startSync;

var UserController = require('./controllers/user');

var requireAuth = _passport2.default.authenticate('jwt', { session: true, failWithError: true });
var requireSignin = _passport2.default.authenticate('local', { session: true, failWithError: true });

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

var router = function router(app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers) {
  app.post('/api/rpc/walletnotify', _walletNotify2.default, function (req, res) {
    console.log('afterWalletNotify');
    if (res.locals.error) {
      console.log('walletnotify...');
      console.log(res.locals.error);
    } else if (!res.locals.error && res.locals.transaction) {
      console.log(res.locals.transaction);
      console.log('wtf');
      if (res.locals.activity) {
        console.log('inside res');
        if (onlineUsers[res.locals.userId.toString()]) {
          onlineUsers[res.locals.userId.toString()].emit('insertTransaction', { transaction: res.locals.transaction });
        }
        io.emit('Activity', res.locals.activity);
      }
      console.log('end insert');
    }
  }); // Make sure this endpoint is only accessible by Runebase Node

  // app.get('/api', requireAuth, fetchUsers);

  app.get('/api/authenticated', function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json({ success: false });
    }
  }, _tfa.istfa);

  app.post('/api/signup', _recaptcha.verifyMyCaptcha, _ip.insertIp, _auth.signup);

  app.post('/api/admin/withdraw/accept', IsAuthenticated, _admin.isAdmin, _ip.insertIp, _admin.acceptWithdraw, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.transaction) {
      res.json({
        transaction: res.locals.transaction
      });
    }
  });

  app.post('/api/admin/withdraw/reject', IsAuthenticated, _admin.isAdmin, _ip.insertIp, _admin.rejectWithdraw, function (req, res) {
    console.log('123');
  });

  app.get('/api/admin/withdrawals', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminWithdrawals, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.withdrawals) {
      console.log(res.locals.withdrawals);
      res.json({
        withdrawals: res.locals.withdrawals
      });
    }
  });

  app.get('/api/admin/userlist', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminUserList, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.userlist) {
      console.log(res.locals.userlist);
      res.json({
        userlist: res.locals.userlist
      });
    }
  });

  app.post('/api/admin/user', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminUser, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.user) {
      console.log(res.locals.user);
      res.json({
        user: res.locals.user
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

  app.post('/api/resend-verify-code', _auth.resendVerification);

  app.post('/api/signin', function (req, res, next) {
    console.log('Click Login');
    next();
  }, _recaptcha.verifyMyCaptcha, _ip.insertIp, requireSignin, _auth.isUserBanned, _auth.signin, function (err, req, res, next) {
    if (req.authErr === 'EMAIL_NOT_VERIFIED') {
      req.session.destroy();
      res.status(401).send({
        error: req.authErr,
        email: res.locals.email
      });
    } else if (req.authErr) {
      req.session.destroy();
      res.status(401).send({
        error: 'LOGIN_ERROR'
      });
    }
  }, function (req, res, next) {
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    console.log('Login Successful');
    res.json({
      username: req.username
    });
  });

  app.post('/api/reset-password', _resetPassword.resetPassword);

  app.post('/api/reset-password/verify', _resetPassword.verifyResetPassword);

  app.post('/api/reset-password/new', _resetPassword.resetPasswordNew);

  app.post('/api/2fa/enable', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _tfa.enabletfa);

  app.post('/api/2fa/disable', IsAuthenticated, _tfa.ensuretfa, _tfa.disabletfa);

  app.post('/api/2fa/unlock', IsAuthenticated, _auth.isUserBanned, _tfa.unlocktfa);

  // app.post('/contact/send', verifyMyCaptcha, contactSend);
  app.post('/api/chaininfo/block', function (req, res) {
    startSync(io, onlineUsers);
  });

  app.get('/api/price', _price2.default, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.price) {
      res.json({
        price: res.locals.price
      });
    }
  });

  app.get('/api/domains', _domain.fetchDomains);

  app.get('/api/jackpots', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _jackpot2.default, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.jackpots) {
      res.json({
        jackpots: res.locals.jackpots
      });
    }
  });

  app.get('/api/orders/surf', _order.fetchSurfOrders);

  app.get('/api/logout', _ip.insertIp, _auth.destroySession, function (req, res) {
    io.emit('Activity', res.locals.activity);
    res.redirect("/");
  });

  app.get('/api/users/total', _users.fetchUserCount);

  app.get('/api/webslots', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _webslot.fetchWebslots);

  app.get('/api/faucetrecord', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _faucet.fetchFaucetRecord, function (req, res) {
    console.log('FAUCET RECORD');
    console.log(res.locals.faucetRecord);
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.faucetRecord) {
      res.json({
        faucetRecord: res.locals.faucetRecord
      });
    }
  });

  app.get('/api/faucetrolls', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _faucet.fetchFaucetRolls, function (req, res) {
    console.log('FAUCET RECORD');
    console.log(res.locals.faucetRolls);
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.faucetRolls) {
      res.json({
        faucetRolls: res.locals.faucetRolls
      });
    }
  });

  app.post('/api/faucetclaim', IsAuthenticated, _storeIp2.default, _auth.isUserBanned, _tfa.ensuretfa, _rateLimiter.rateLimiterMiddlewareFaucet, _recaptcha.verifyMyCaptcha, _faucet.claimFaucet, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.faucetRecord && res.locals.wallet && res.locals.faucetRoll) {
      res.json({
        jackpot_tickets: res.locals.jackpot_tickets,
        wallet: res.locals.wallet,
        faucetRecord: res.locals.faucetRecord,
        faucetRoll: res.locals.faucetRoll
      });
    }
  });

  app.get('/api/activity/all', _activity.fetchActivity, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      res.json({
        activity: res.locals.activity
      });
    }
  });

  app.post('/api/webslot/buy', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _webslot.buyWebslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.user && res.locals.wallet) {
      res.json({
        wallet: res.locals.wallet,
        webslot_amount: res.locals.user.webslot_amount,
        jackpot_tickets: res.locals.user.jackpot_tickets
      });
    }
  });

  app.post('/api/webslots/create', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _webslot.createWebslot, function (req, res, next) {
    if (req.authErr === 'INVALID_URL') {
      res.status(401).send({
        errorType: 'invalid_url',
        url: req.body.url
      });
    }
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    console.log(res.locals.webslot);
    console.log(res.locals.domain);
    console.log('sjj');
    if (res.locals.webslot) {
      res.json({
        webslot: res.locals.webslot,
        domain: res.locals.domain
      });
    }
  });

  app.post('/api/webslots/deactivate', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _webslot.deactivateWebslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.webslot) {
      res.json({
        webslot: res.locals.webslot
      });
    }
  });

  app.post('/api/surf/complete', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _rateLimiter.rateLimiterMiddlewareIp, _rateLimiter.rateLimiterMiddlewareUser, _recaptcha.isSurfCaptcha, _surf.surfComplete, function (req, res, next) {
    console.log('surf complete');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else {
      // console.log(res.locals.order);
      // console.log(res.locals.userWallet2);
      // console.log(res.locals.userWallet1);
      // console.log(res.locals.domain);
      // console.log(res.locals.webslot);

      // jackpot tickets for users.
      // res.locals.user2_jackpot_tickets
      // res.locals.user1_jackpot_tickets

      io.emit('Activity', res.locals.activity);

      if (res.locals.referredWallet1) {
        if (onlineUsers[res.locals.referredWallet1.userId.toString()]) {
          onlineUsers[res.locals.referredWallet1.userId.toString()].emit('updateWallet', {
            wallet: res.locals.referredWallet1
          });
        }
        io.emit('Activity', res.locals.referredActivity1);
      }
      if (res.locals.referredWallet2) {
        if (onlineUsers[res.locals.referredWallet2.userId.toString()]) {
          onlineUsers[res.locals.referredWallet2.userId.toString()].emit('updateWallet', {
            wallet: res.locals.referredWallet2
          });
        }
        io.emit('Activity', res.locals.referredActivity1);
      }

      if (onlineUsers[res.locals.userId2.toString()]) {
        onlineUsers[res.locals.userId2.toString()].emit('updateSurfComplete', {
          jackpot_tickets: res.locals.user2_jackpot_tickets,
          wallet: res.locals.userWallet2,
          order: res.locals.order,
          webslot: res.locals.webslot,
          domain: res.locals.domain
        });
      }

      sub.subscribe(expired_subKey, function () {
        pub.setex('surfVolume:', 999999999999999999, res.locals.lastStats.surf);
        pub.setex('surf:' + res.locals.lastStats.surf, 86400, res.locals.order.price);
      });

      res.json({
        wallet: res.locals.userWallet1,
        jackpot_tickets: res.locals.user1_jackpot_tickets,
        surfcount: res.locals.surfcount
      });
    }
  });

  app.get('/api/volume', function (req, res, next) {
    res.json(volumeInfo);
  });

  app.get('/api/surf/start', IsAuthenticated, _storeIp2.default, _auth.isUserBanned, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _surf.surfStart, function (req, res) {
    console.log('SURF STARTED');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      console.log('emit activity');
      io.emit('Activity', res.locals.activity);
    }
    console.log(res.locals.surfTicket);
    console.log('respons with surfTicket');
    res.json(res.locals.surfTicket);
  });

  app.get('/api/user', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _user.fetchUser, function (req, res, next) {
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

  // User Create Order
  app.post('/api/webslot/order/create', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _order.createWebslotOrder, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order && res.locals.wallet) {
      res.json({
        order: res.locals.order,
        wallet: res.locals.wallet
      });
    }
  });

  app.post('/api/webslot/order/cancel', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _order.cancelWebslotOrder, function (req, res) {
    console.log(req.body);
    console.log('yow');
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order) {
      res.json({
        order: res.locals.order
      });
    }
  });

  // User Request Withdrawal
  app.post('/api/withdraw', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _wallet.withdraw, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (!res.locals.error && res.locals.wallet && res.locals.transaction) {
      res.locals.transaction.txid = null;
      res.locals.transaction.blockId = null;
      res.json({
        wallet: res.locals.wallet,
        transaction: res.locals.transaction
      });
    }
  });
};

exports.default = router;