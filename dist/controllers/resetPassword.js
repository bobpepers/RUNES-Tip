'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPasswordNew = exports.verifyResetPassword = exports.resetPassword = undefined;

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _email = require('../helpers/email');

var _token = require('../helpers/token');

var _generate = require('../helpers/generate');

var _timingSafeEqual = require('../helpers/timingSafeEqual');

var _timingSafeEqual2 = _interopRequireDefault(_timingSafeEqual);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Reset password
 */


var resetPassword = exports.resetPassword = function resetPassword(req, res, next) {
  var email = req.body.email;

  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{ email: email }])
  }).then(async function (user) {
    if (!user) {
      return res.status(422).send({ error: "email doesn't exists" });
    }
    var verificationToken = await (0, _generate.generateVerificationToken)(1);
    user.update({
      resetpassexpires: verificationToken.expires,
      resetpasstoken: verificationToken.token,
      resetpassused: false
    }).then(function (updatedUser) {
      (0, _email.sendResetPassword)(email, updatedUser.firstname, updatedUser.resetpasstoken);
      res.json({ success: true });
    }).catch(function (err) {
      next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
};

/**
 * Verify reset password
 */
var verifyResetPassword = exports.verifyResetPassword = function verifyResetPassword(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      token = _req$body.token;


  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{ email: email }])
  }).then(async function (user) {
    if (!user) {
      return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
    }

    if (user.resetpassused) {
      console.log('already used resetpass token1');
      return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
    }

    if (new Date() > user.resetpassexpires) {
      return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
    }
    console.log('timingSafeEqual(token, user.resetpasstoken)');
    console.log(token);
    console.log(user.resetpasstoken);
    console.log((0, _timingSafeEqual2.default)(token, user.resetpasstoken));

    if (!(0, _timingSafeEqual2.default)(token, user.resetpasstoken)) {
      return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
    }

    res.json({ success: true });
  }).catch(function (err) {
    next(err);
  });
};

/**
 * Reset password, new password
 */
var resetPasswordNew = exports.resetPasswordNew = function resetPasswordNew(req, res, next) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      newpassword = _req$body2.newpassword,
      token = _req$body2.token;


  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{ email: email }])
  }).then(async function (user) {
    if (!user) {
      return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
    }

    if (user.resetpassused) {
      console.log('already used resetpass token');
      return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
    }

    if (new Date() > user.resetpassexpires) {
      return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
    }

    if (!(0, _timingSafeEqual2.default)(token, user.resetpasstoken)) {
      return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
    }

    _bcryptNodejs2.default.genSalt(10, function (err, salt) {
      console.log(salt);
      if (err) {
        return next(err);
      }

      _bcryptNodejs2.default.hash(newpassword, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }

        user.update({
          password: hash,
          resetpassused: true
        }).then(function (updatedUser) {
          console.log(updatedUser);
          console.log('done updating user');
          var firstname = updatedUser.firstname,
              lastname = updatedUser.lastname,
              email = updatedUser.email;

          res.json({
            firstname: firstname, lastname: lastname, email: email
          });
        }).catch(function (err) {
          next(err);
        });
      });
    });
  }).catch(function (err) {
    next(err);
  });
};