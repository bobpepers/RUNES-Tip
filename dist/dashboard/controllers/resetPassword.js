"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyResetPassword = exports.resetPasswordNew = exports.resetPassword = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _email = require("../helpers/email");

var _generate = require("../helpers/generate");

var _timingSafeEqual = _interopRequireDefault(require("../helpers/timingSafeEqual"));

var _models = _interopRequireDefault(require("../../models"));

// import { tokenForUser } from '../helpers/token';
var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;
/**
 * Reset password
 */


var resetPassword = function resetPassword(req, res, next) {
  var email = req.body.email;

  _models["default"].user.findOne({
    where: (0, _defineProperty2["default"])({}, Op.or, [{
      email: email
    }])
  }).then( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user) {
      var verificationToken;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (user) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(422).send({
                error: "email doesn't exists"
              }));

            case 2:
              _context.next = 4;
              return (0, _generate.generateVerificationToken)(1);

            case 4:
              verificationToken = _context.sent;
              user.update({
                resetpassexpires: verificationToken.expires,
                resetpasstoken: verificationToken.token,
                resetpassused: false
              }).then(function (updatedUser) {
                (0, _email.sendResetPassword)(email, updatedUser.firstname, updatedUser.resetpasstoken);
                res.json({
                  success: true
                });
              })["catch"](function (err) {
                next(err);
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }())["catch"](function (err) {
    return next(err);
  });
};
/**
 * Verify reset password
 */


exports.resetPassword = resetPassword;

var verifyResetPassword = function verifyResetPassword(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      token = _req$body.token;

  _models["default"].user.findOne({
    where: (0, _defineProperty2["default"])({}, Op.or, [{
      email: email
    }])
  }).then( /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (user) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", res.status(422).send({
                error: {
                  message: "email doesn't exists",
                  resend: false
                }
              }));

            case 2:
              if (!user.resetpassused) {
                _context2.next = 5;
                break;
              }

              console.log('already used resetpass token1');
              return _context2.abrupt("return", res.status(422).send({
                error: {
                  message: "link already used, please request reset password again",
                  resend: true
                }
              }));

            case 5:
              if (!(new Date() > user.resetpassexpires)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", res.status(422).send({
                error: {
                  message: "link already expired, please request reset password again",
                  resend: true
                }
              }));

            case 7:
              console.log('timingSafeEqual(token, user.resetpasstoken)');
              console.log(token);
              console.log(user.resetpasstoken);
              console.log((0, _timingSafeEqual["default"])(token, user.resetpasstoken));

              if ((0, _timingSafeEqual["default"])(token, user.resetpasstoken)) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("return", res.status(422).send({
                error: {
                  message: "something has gone wrong, please request reset password again",
                  resend: true
                }
              }));

            case 13:
              res.json({
                success: true
              });

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }())["catch"](function (err) {
    next(err);
  });
};
/**
 * Reset password, new password
 */


exports.verifyResetPassword = verifyResetPassword;

var resetPasswordNew = function resetPasswordNew(req, res, next) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      newpassword = _req$body2.newpassword,
      token = _req$body2.token;

  _models["default"].user.findOne({
    where: (0, _defineProperty2["default"])({}, Op.or, [{
      email: email
    }])
  }).then( /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(user) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (user) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", res.status(422).send({
                error: {
                  message: "email doesn't exists",
                  resend: false
                }
              }));

            case 2:
              if (!user.resetpassused) {
                _context3.next = 5;
                break;
              }

              console.log('already used resetpass token');
              return _context3.abrupt("return", res.status(422).send({
                error: {
                  message: "link already used, please request reset password again",
                  resend: true
                }
              }));

            case 5:
              if (!(new Date() > user.resetpassexpires)) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", res.status(422).send({
                error: {
                  message: "link already expired, please request reset password again",
                  resend: true
                }
              }));

            case 7:
              if ((0, _timingSafeEqual["default"])(token, user.resetpasstoken)) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", res.status(422).send({
                error: {
                  message: "something has gone wrong, please request reset password again",
                  resend: true
                }
              }));

            case 9:
              _bcryptNodejs["default"].genSalt(10, function (err, salt) {
                console.log(salt);

                if (err) {
                  return next(err);
                }

                _bcryptNodejs["default"].hash(newpassword, salt, null, function (err, hash) {
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
                      firstname: firstname,
                      lastname: lastname,
                      email: email
                    });
                  })["catch"](function (err) {
                    next(err);
                  });
                });
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }())["catch"](function (err) {
    next(err);
  });
};

exports.resetPasswordNew = resetPasswordNew;