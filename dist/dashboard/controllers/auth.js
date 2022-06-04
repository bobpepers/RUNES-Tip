"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.signup = exports.signin = exports.resendVerification = exports.isDashboardUserBanned = exports.destroySession = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _email = require("../helpers/email");

var _models = _interopRequireDefault(require("../../models"));

var _generate = require("../helpers/generate");

var _timingSafeEqual = _interopRequireDefault(require("../helpers/timingSafeEqual"));

/**
 * Is Dashboard User Banned?
 */
var isDashboardUserBanned = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user.banned) {
              req.session.destroy(function (err) {
                res.status(401).send({
                  error: 'USER_BANNED'
                });
              });
            } else {
              next();
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isDashboardUserBanned(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Sign in
 */


exports.isDashboardUserBanned = isDashboardUserBanned;

var signin = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var ip, activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            _context2.next = 3;
            return _models["default"].activity.create({
              dashboardUserId: req.user.id,
              type: 'login_s' //  ipId: res.locals.ip[0].id,

            });

          case 3:
            activity = _context2.sent;
            _context2.next = 6;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              attributes: ['createdAt', 'type'],
              include: [{
                model: _models["default"].dashboardUser,
                as: 'dashboardUser',
                required: false,
                attributes: ['username']
              }]
            });

          case 6:
            res.locals.activity = _context2.sent;
            res.locals.result = req.user.username;
            return _context2.abrupt("return", next());

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function signin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.signin = signin;

var destroySession = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].activity.create({
              dashboardUserId: req.user.id,
              type: 'logout_s' //     ipId: res.locals.ip[0].id,

            });

          case 2:
            activity = _context3.sent;
            _context3.next = 5;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              attributes: ['createdAt', 'type'],
              include: [{
                model: _models["default"].dashboardUser,
                as: 'dashboardUser',
                required: false,
                attributes: ['username']
              }]
            });

          case 5:
            res.locals.activity = _context3.sent;
            req.session.destroy(function (err) {
              res.redirect('/');
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function destroySession(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Sign up
 */


exports.destroySession = destroySession;

var signup = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var _req$body$props, email, password, username, textCharacters, User, isUserNameEqual, isEmailEqual;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body$props = req.body.props, email = _req$body$props.email, password = _req$body$props.password, username = _req$body$props.username;

            if (!(!email || !password || !username)) {
              _context5.next = 3;
              break;
            }

            throw new Error("all fields are required");

          case 3:
            textCharacters = new RegExp("^[a-zA-Z0-9]*$");

            if (textCharacters.test(username)) {
              _context5.next = 6;
              break;
            }

            throw new Error("USERNAME_NO_SPACES_OR_SPECIAL_CHARACTERS_ALLOWED");

          case 6:
            _context5.next = 8;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('username')), _sequelize.Sequelize.fn('lower', username)), _sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('email')), _sequelize.Sequelize.fn('lower', email))])
            });

          case 8:
            User = _context5.sent;
            isUserNameEqual = User.username.localeCompare(username, undefined, {
              sensitivity: 'accent'
            });
            isEmailEqual = User.email.localeCompare(email, undefined, {
              sensitivity: 'accent'
            });

            if (!(isUserNameEqual === 0)) {
              _context5.next = 13;
              break;
            }

            throw new Error("USERNAME_ALREADY_EXIST");

          case 13:
            if (!(isEmailEqual === 0)) {
              _context5.next = 15;
              break;
            }

            throw new Error("EMAIL_ALREADY_EXIST");

          case 15:
            _context5.next = 17;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                var verificationToken, newUser;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return (0, _generate.generateVerificationToken)(24);

                      case 2:
                        verificationToken = _context4.sent;
                        _context4.next = 5;
                        return _models["default"].dashboardUser.create({
                          username: username,
                          password: password,
                          email: email,
                          authused: false,
                          authexpires: verificationToken.expires,
                          authtoken: verificationToken.token
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        newUser = _context4.sent;
                        t.afterCommit(function () {
                          (0, _email.sendVerificationEmail)(email, newUser.authtoken);
                          return res.json({
                            email: email
                          });
                        });

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x13) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function signup(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Resend verification code
 */


exports.signup = signup;

var resendVerification = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var email;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            email = req.body.email;

            _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('email')), _sequelize.Sequelize.fn('lower', email))])
            }).then( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(user) {
                var verificationToken;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return (0, _generate.generateVerificationToken)(24);

                      case 2:
                        verificationToken = _context6.sent;

                        if (!(user.authused === true)) {
                          _context6.next = 6;
                          break;
                        }

                        res.json({
                          success: false
                        });
                        return _context6.abrupt("return", next('Auth Already Used'));

                      case 6:
                        user.update({
                          authexpires: verificationToken.expires,
                          authtoken: verificationToken.token
                        }).then(function (updatedUser) {
                          var email = updatedUser.email,
                              authtoken = updatedUser.authtoken;
                          (0, _email.sendVerificationEmail)(email, authtoken);
                          res.json({
                            success: true
                          });
                        })["catch"](function (err) {
                          next(err);
                        });

                      case 7:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x17) {
                return _ref7.apply(this, arguments);
              };
            }())["catch"](function (err) {
              next(err);
            });

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function resendVerification(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Verify email
 */


exports.resendVerification = resendVerification;

var verifyEmail = function verifyEmail(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      token = _req$body.token;

  _models["default"].dashboardUser.findOne({
    where: (0, _defineProperty2["default"])({}, _sequelize.Op.or, [_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('email')), _sequelize.Sequelize.fn('lower', email))])
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

    if (!(0, _timingSafeEqual["default"])(token, user.authtoken)) {
      throw new Error('INCORRECT_TOKEN');
    }

    user.update({
      authused: true,
      role: 1
    }).then( /*#__PURE__*/function () {
      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(updatedUser) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                res.locals.user = updatedUser;
                next();

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      return function (_x18) {
        return _ref8.apply(this, arguments);
      };
    }())["catch"](function (err) {
      res.locals.error = err.message;
      next();
    });
  })["catch"](function (err) {
    res.locals.error = err.message;
    next();
  });
};

exports.verifyEmail = verifyEmail;