"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyResetPassword = exports.resetPasswordNew = exports.resetPassword = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _sequelize = require("sequelize");

var _email = require("../helpers/email");

var _generate = require("../helpers/generate");

var _timingSafeEqual = _interopRequireDefault(require("../helpers/timingSafeEqual"));

var _models = _interopRequireDefault(require("../../models"));

// import { tokenForUser } from '../helpers/token';

/**
 * Reset password
 */
var resetPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var email, user, verificationToken, updatedUser, successSend;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('resetPassword');
            email = req.body.email;
            _context.next = 4;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
                email: email
              }])
            });

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            throw new Error("email doesn't exists");

          case 7:
            if (!user) {
              _context.next = 21;
              break;
            }

            _context.next = 10;
            return (0, _generate.generateVerificationToken)(1);

          case 10:
            verificationToken = _context.sent;
            _context.next = 13;
            return user.update({
              resetpassexpires: verificationToken.expires,
              resetpasstoken: verificationToken.token,
              resetpassused: false
            });

          case 13:
            updatedUser = _context.sent;
            _context.next = 16;
            return (0, _email.sendResetPassword)(email, updatedUser.username, updatedUser.resetpasstoken);

          case 16:
            successSend = _context.sent;

            if (successSend) {
              _context.next = 19;
              break;
            }

            throw new Error("Failed to send email");

          case 19:
            res.locals.result = {
              success: true
            };
            return _context.abrupt("return", next());

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function resetPassword(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Verify reset password
 */


exports.resetPassword = resetPassword;

var verifyResetPassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$body, email, token, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, token = _req$body.token;
            _context2.next = 3;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
                email: email
              }])
            });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            throw new Error("email doesn't exists");

          case 6:
            if (!user) {
              _context2.next = 15;
              break;
            }

            if (!user.resetpassused) {
              _context2.next = 9;
              break;
            }

            throw new Error("link already used, please request reset password again");

          case 9:
            if (!(new Date() > user.resetpassexpires)) {
              _context2.next = 11;
              break;
            }

            throw new Error("link already expired, please request reset password again");

          case 11:
            if ((0, _timingSafeEqual["default"])(token, user.resetpasstoken)) {
              _context2.next = 13;
              break;
            }

            throw new Error("something has gone wrong, please request reset password again");

          case 13:
            res.locals.result = {
              success: true
            };
            return _context2.abrupt("return", next());

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function verifyResetPassword(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Reset password, new password
 */


exports.verifyResetPassword = verifyResetPassword;

var resetPasswordNew = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body2, email, newpassword, token, user;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, newpassword = _req$body2.newpassword, token = _req$body2.token;
            _context3.next = 3;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
                email: email
              }])
            });

          case 3:
            user = _context3.sent;

            if (user) {
              _context3.next = 6;
              break;
            }

            throw new Error("email doesn't exists");

          case 6:
            if (!user) {
              _context3.next = 14;
              break;
            }

            if (!user.resetpassused) {
              _context3.next = 9;
              break;
            }

            throw new Error("link already used, please request reset password again");

          case 9:
            if (!(new Date() > user.resetpassexpires)) {
              _context3.next = 11;
              break;
            }

            throw new Error("link already expired, please request reset password again");

          case 11:
            if ((0, _timingSafeEqual["default"])(token, user.resetpasstoken)) {
              _context3.next = 13;
              break;
            }

            throw new Error("something has gone wrong, please request reset password again");

          case 13:
            _bcryptNodejs["default"].genSalt(10, function (err, salt) {
              console.log(salt);

              if (err) {
                throw new Error(err);
              }

              _bcryptNodejs["default"].hash(newpassword, salt, null, function (err, hash) {
                if (err) {
                  throw new Error(err);
                }

                user.update({
                  password: hash,
                  resetpassused: true
                }).then(function (updatedUser) {
                  var username = updatedUser.username,
                      email = updatedUser.email; // res.locals.username = username;
                  // res.locals.email = email;

                  res.locals.result = {
                    username: username,
                    email: email
                  };
                  next();
                })["catch"](function (err) {
                  throw new Error(err);
                });
              });
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function resetPasswordNew(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.resetPasswordNew = resetPasswordNew;