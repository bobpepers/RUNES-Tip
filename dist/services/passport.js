'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = require('passport-jwt');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { sendVerificationEmail } from '../helpers/email';

require('dotenv').config();

var _require = require("sequelize"),
    Op = _require.Op;

var localOptions = {
  passReqToCallback: true,
  usernameField: 'email'
};

_passport2.default.serializeUser(function (user, done) {
  // In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
  // Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{ id: id }])
  }).then(function (user) {
    done(null, user);
  }).catch(function (error) {
    done(error, null);
  });
});

var localLogin = new _passportLocal2.default(localOptions, function (req, email, password, done) {
  console.log(email);
  console.log(password);
  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{
      email: email.toLowerCase()
    }])
  }).then(function (user) {
    if (!user) {
      req.authErr = 'USER_NOT_EXIST';
      return done(null, false, { message: 'USER_NOT_EXIST' });
    }
    user.comparePassword(password, function (err, isMatch) {
      if (!isMatch) {
        console.log('password does not match');
        req.authErr = 'WRONG_PASSWORD';
        return done(null, false, { message: 'USER_NOT_EXIST' });
      }

      if (user.role < 1) {
        console.log('email is not verified');
        req.authErr = 'EMAIL_NOT_VERIFIED';
        console.log('123');
        return done('EMAIL_NOT_VERIFIED', false);
      }
      console.log('end locallogin');
      console.log('services/passport req.session.tfa called to true');
      req.session.tfa = user.tfa;
      done(null, user);
    });
  }).catch(function (error) {
    console.log('localLogin error services/passport');
    console.log(error);
    req.authErr = error;
    done(error, false);
  });
});

var jwtOptions = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};

var jwtLogin = new _passportJwt.Strategy(jwtOptions, function (payload, done) {
  console.log(payload);
  console.log('jwtLogin payload');
  _models2.default.user.findOne({
    where: _defineProperty({}, Op.or, [{ id: payload.sub }])
  }).then(function (exist) {
    if (exist) {
      console.log('jwt login exist');
      done(null, exist);
    } else {
      console.log('jwtLogin warning');
      done(null, false);
    }
  }).catch(function (error) {
    return done(error, false);
  });
});

_passport2.default.use(jwtLogin);
_passport2.default.use(localLogin);