"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _models = _interopRequireDefault(require("../../models"));

// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { sendVerificationEmail } from '../helpers/email';
require('dotenv').config();

var _require = require("sequelize"),
    Op = _require.Op;

var localOptions = {
  passReqToCallback: true,
  usernameField: 'email'
};

_passport["default"].serializeUser(function (user, done) {
  // In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
});

_passport["default"].deserializeUser(function (id, done) {
  // Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
  _models["default"].dashboardUser.findOne({
    where: (0, _defineProperty2["default"])({}, Op.or, [{
      id: id
    }])
  }).then(function (user) {
    done(null, user);
  })["catch"](function (error) {
    done(error, null);
  });
});

var localLogin = new _passportLocal["default"](localOptions, function (req, email, password, done) {
  console.log(email);
  console.log(password);

  _models["default"].dashboardUser.findOne({
    where: (0, _defineProperty2["default"])({}, Op.or, [{
      email: email.toLowerCase()
    }])
  }).then(function (user) {
    if (!user) {
      req.authErr = 'USER_NOT_EXIST';
      return done(null, false, {
        message: 'USER_NOT_EXIST'
      });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (!isMatch) {
        console.log('password does not match');
        req.authErr = 'WRONG_PASSWORD';
        return done(null, false, {
          message: 'USER_NOT_EXIST'
        });
      }

      if (user.role < 1) {
        console.log('email is not verified');
        req.authErr = 'EMAIL_NOT_VERIFIED';
        return done('EMAIL_NOT_VERIFIED', false);
      }

      console.log('end locallogin');
      req.session.tfa = user.tfa;
      done(null, user);
    });
  })["catch"](function (error) {
    console.log('localLogin error services/passport');
    console.log(error);
    req.authErr = error;
    done(error, false);
  });
});

_passport["default"].use(localLogin);