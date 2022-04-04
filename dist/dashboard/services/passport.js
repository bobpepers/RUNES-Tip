"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../../models"));

// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { sendVerificationEmail } from '../helpers/email';
(0, _dotenv.config)();
var localOptions = {
  passReqToCallback: true,
  usernameField: 'email'
};

_passport["default"].serializeUser( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, done) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // In serialize user you decide what to store in the session. Here I'm storing the user id only.
            done(null, user.id);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, done) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
            _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
                id: id
              }])
            }).then(function (user) {
              done(null, user);
            })["catch"](function (error) {
              done(error, null);
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

var localLogin = new _passportLocal["default"](localOptions, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, email, password, done) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
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

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());

_passport["default"].use(localLogin);