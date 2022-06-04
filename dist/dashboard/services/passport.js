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

var _email2 = require("../helpers/email");

var _generate = require("../helpers/generate");

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
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, email, password, done) {
    var user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('email')), _sequelize.Sequelize.fn('lower', email))])
            });

          case 2:
            user = _context4.sent;

            if (user) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", done({
              message: 'LOGIN_FAIL'
            }, false));

          case 5:
            if (user) {
              user.comparePassword(password, /*#__PURE__*/function () {
                var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err, isMatch) {
                  var verificationToken, updatedUser, username, _email, authtoken;

                  return _regenerator["default"].wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          if (isMatch) {
                            _context3.next = 2;
                            break;
                          }

                          return _context3.abrupt("return", done({
                            message: 'LOGIN_FAIL'
                          }, false));

                        case 2:
                          if (!(user.role < 1)) {
                            _context3.next = 15;
                            break;
                          }

                          if (!(user.authused === true)) {
                            _context3.next = 5;
                            break;
                          }

                          return _context3.abrupt("return", done({
                            message: 'AUTH_TOKEN_USED'
                          }, false));

                        case 5:
                          _context3.next = 7;
                          return (0, _generate.generateVerificationToken)(24);

                        case 7:
                          verificationToken = _context3.sent;
                          _context3.next = 10;
                          return user.update({
                            authexpires: verificationToken.tomorrow,
                            authtoken: verificationToken.authtoken
                          });

                        case 10:
                          updatedUser = _context3.sent;
                          username = updatedUser.username, _email = updatedUser.email, authtoken = updatedUser.authtoken;
                          (0, _email2.sendVerificationEmail)(username, _email, authtoken);
                          req.session.destroy();
                          return _context3.abrupt("return", done({
                            message: 'EMAIL_NOT_VERIFIED',
                            email: _email
                          }, false));

                        case 15:
                          req.session.tfa = user.tfa;
                          done(null, user);

                        case 17:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x9, _x10) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());

_passport["default"].use(localLogin);