'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.resendVerification = exports.signup = exports.destroySession = exports.signin = exports.isUserBanned = undefined;

var _email2 = require('../helpers/email');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _generate = require('../helpers/generate');

var _timingSafeEqual = require('../helpers/timingSafeEqual');

var _timingSafeEqual2 = _interopRequireDefault(_timingSafeEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crypto = require('crypto');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

/**
 *
 * Is User Banned?
 */


var isUserBanned = exports.isUserBanned = async function isUserBanned(req, res, next) {
  if (req.user.banned) {
    console.log('user is banned');
    req.logOut();
    req.session.destroy();
    res.status(401).send({
      error: 'USER_BANNED'
    });
  } else {
    next();
  }
};

/**
 *
 * Sign in
 */
var signin = exports.signin = async function signin(req, res, next) {
  var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (req.authErr === 'USER_NOT_EXIST') {
    return next('USER_NOT_EXIST', false);
  }
  console.log(req.authErr);
  if (req.authErr === 'EMAIL_NOT_VERIFIED') {
    console.log('EMAIL_NOT_VERIFIED');
    var email = req.user_email;
    res.locals.email = req.user_email;
    _models2.default.user.findOne({
      where: _defineProperty({}, Op.or, [{
        email: email.toLowerCase()
      }])
    }).then(async function (user) {
      var verificationToken = await (0, _generate.generateVerificationToken)(24);
      if (user.authused === true) {
        return next(req.authErr, false);
      }
      user.update({
        authexpires: verificationToken.tomorrow,
        authtoken: verificationToken.authtoken
      }).then(function (updatedUser) {
        console.log('55555');
        var firstname = updatedUser.firstname,
            email = updatedUser.email,
            authtoken = updatedUser.authtoken;

        (0, _email2.sendVerificationEmail)(email, firstname, authtoken);
        console.log('EMAIL_SENT');
        return next(req.authErr, false);
      }).catch(function (err) {
        return next(err, false);
      });
    }).catch(function (err) {
      return next(err, false);
    });
  } else {
    var firstname = req.firstname,
        lastname = req.lastname,
        _email = req.email;

    console.log('get wallet');
    _models2.default.wallet.findOne({
      where: {
        userId: req.user.id
      },
      include: [{
        model: _models2.default.address
      }]
    }).then(async function (wallet) {
      if (!wallet.addresses.length) {
        var address = await getInstance().getNewAddress();
        await _models2.default.address.create({
          address: address,
          walletId: wallet.id,
          type: 'deposit',
          confirmed: true
        });
      }
    }).catch(function (err) {
      console.log(err);
    });

    console.log(req.user.id);

    var activity = await _models2.default.activity.create({
      earnerId: req.user.id,
      type: 'login',
      ipId: res.locals.ip[0].id
    });
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: activity.id
      },
      attributes: ['createdAt', 'type'],
      include: [{
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }]
    });

    console.log('Login Successful');

    next();
  }
};

var destroySession = exports.destroySession = async function destroySession(req, res, next) {
  console.log('WTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSDWTSQDQDQSD');
  var activity = await _models2.default.activity.create({
    earnerId: req.user.id,
    type: 'logout',
    ipId: res.locals.ip[0].id
  });
  res.locals.activity = await _models2.default.activity.findOne({
    where: {
      id: activity.id
    },
    attributes: ['createdAt', 'type'],
    include: [{
      model: _models2.default.user,
      as: 'earner',
      required: false,
      attributes: ['username']
    }]
  });

  req.logOut();
  req.session.destroy();
  next();
};
/**
 * Sign up
 */
var signup = exports.signup = async function signup(req, res, next) {
  var _req$body$props = req.body.props,
      firstname = _req$body$props.firstname,
      lastname = _req$body$props.lastname,
      email = _req$body$props.email,
      password = _req$body$props.password,
      username = _req$body$props.username,
      referredby = _req$body$props.referredby;


  if (!firstname || !lastname || !email || !password || !username) {
    return res.status(422).send({ error: "all fields are required" });
  }

  var User = await _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{
      username: username
    }, {
      email: email.toLowerCase()
    }])
  });

  if (User && User.username.toLowerCase() === username.toLowerCase()) {
    console.log('already exists');
    return res.status(401).send({
      error: 'USERNAME_ALREADY_EXIST'
    });
  }
  if (User && User.email.toLowerCase() === email.toLowerCase()) {
    console.log('e-mail already exists');
    return res.status(401).send({
      error: 'EMAIL_ALREADY_EXIST'
    });
  }

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var verificationToken = await (0, _generate.generateVerificationToken)(24);
    console.log('verificationToken');
    console.log(verificationToken);
    console.log('verificationToken');
    var newUser = await _models2.default.user.create({
      username: username,
      password: password,
      email: email.toLowerCase(),
      firstname: firstname,
      lastname: lastname,
      authused: false,
      authexpires: verificationToken.expires,
      authtoken: verificationToken.token
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var newFaucet = await _models2.default.faucet.create({
      userId: newUser.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var referred = await _models2.default.user.findOne({
      where: {
        username: referredby
      }
    });

    if (referred) {
      console.log(referred);
      var referral = await _models2.default.Referrals.create({
        referrerID: newUser.id,
        referredById: referred.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    var newWallet = await _models2.default.wallet.create({
      userId: newUser.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.create({
      earnerId: newUser.id,
      type: 'register',
      ipId: res.locals.ip[0].id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      (0, _email2.sendVerificationEmail)(email.toLowerCase(), firstname, newUser.authtoken);
      console.log('commited');
      return res.json({
        firstname: firstname,
        lastname: lastname,
        email: email.toLowerCase()
      });
      // next();
    });
  });
};

/**
 * Resend verification code
 */
var resendVerification = exports.resendVerification = function resendVerification(req, res, next) {
  console.log('resend verification');
  var email = req.body.email;

  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{
      email: email.toLowerCase()
    }])
  }).then(async function (user) {
    var verificationToken = await (0, _generate.generateVerificationToken)(24);
    if (user.authused === true) {
      res.json({ success: false });
      return next('Auth Already Used');
    }
    user.update({
      authexpires: verificationToken.expires,
      authtoken: verificationToken.token
    }).then(function (updatedUser) {
      var firstname = updatedUser.firstname,
          email = updatedUser.email,
          authtoken = updatedUser.authtoken;

      (0, _email2.sendVerificationEmail)(email.toLowerCase(), firstname, authtoken);
      res.json({ success: true });
    }).catch(function (err) {
      next(err);
    });
  }).catch(function (err) {
    next(err);
  });
};

/**
 * Verify email
 */
var verifyEmail = exports.verifyEmail = function verifyEmail(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      token = _req$body.token;


  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{
      email: email.toLowerCase()
    }])
  }).then(function (user) {
    if (!user) {
      throw new Error('USER_NOT_EXIST');
    }
    if (user.authused > 0) {
      throw new Error('AUTH_TOKEN_ALREADY_USED');
    }
    if (new Date() > user.authexpires) {
      throw new Error('AUTH_TOKEN_EXPIRED');
    }
    if (!(0, _timingSafeEqual2.default)(token, user.authtoken)) {
      throw new Error('INCORRECT_TOKEN');
    }
    user.update({
      authused: true,
      role: 1
    }).then(async function (updatedUser) {
      res.locals.user = updatedUser;

      var activity = await _models2.default.activity.create({
        earnerId: updatedUser.id,
        type: 'registerVerified',
        ipId: res.locals.ip[0].id
      });
      next();
    }).catch(function (err) {
      res.locals.error = err.message;
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};