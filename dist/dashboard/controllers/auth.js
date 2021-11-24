"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.signup = exports.signin = exports.resendVerification = exports.isDashboardUserBanned = exports.destroySession = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _email = require("../helpers/email");

var _models = _interopRequireDefault(require("../../models"));

var _generate = require("../helpers/generate");

var _timingSafeEqual = _interopRequireDefault(require("../helpers/timingSafeEqual"));

var _require = require('sequelize'),
    Transaction = _require.Transaction,
    Op = _require.Op;
/**
 *
 * Is Dashboard User Banned?
 */


var isDashboardUserBanned = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
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
 *
 * Sign in
 */


exports.isDashboardUserBanned = isDashboardUserBanned;

var signin = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var ip, email;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            if (!(req.authErr === 'USER_NOT_EXIST')) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", next('USER_NOT_EXIST', false));

          case 3:
            // console.log(req.authErr);
            if (req.authErr === 'EMAIL_NOT_VERIFIED') {
              console.log('EMAIL_NOT_VERIFIED');
              email = req.user_email;
              res.locals.email = req.user_email;

              _models["default"].dashboardUser.findOne({
                where: (0, _defineProperty2["default"])({}, Op.or, [{
                  email: email.toLowerCase()
                }])
              }).then( /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user) {
                  var verificationToken;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return (0, _generate.generateVerificationToken)(24);

                        case 2:
                          verificationToken = _context2.sent;

                          if (!(user.authused === true)) {
                            _context2.next = 5;
                            break;
                          }

                          return _context2.abrupt("return", next(req.authErr, false));

                        case 5:
                          user.update({
                            authexpires: verificationToken.tomorrow,
                            authtoken: verificationToken.authtoken
                          }).then(function (updatedUser) {
                            var email = updatedUser.email,
                                authtoken = updatedUser.authtoken;
                            (0, _email.sendVerificationEmail)(email, authtoken);
                            console.log('EMAIL_SENT');
                            return next(req.authErr, false);
                          })["catch"](function (err) {
                            return next(err, false);
                          });

                        case 6:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x7) {
                  return _ref3.apply(this, arguments);
                };
              }())["catch"](function (err) {
                return next(err, false);
              });
            } else {
              // const activity = await db.activity.create({
              //  earnerId: req.user.id,
              //  type: 'login',
              //  ipId: res.locals.ip[0].id,
              // });
              // res.locals.activity = await db.activity.findOne({
              //  where: {
              //    id: activity.id,
              //  },
              //  attributes: [
              //    'createdAt',
              //    'type',
              //  ],
              // include: [
              //   {
              //     model: db.user,
              //    as: 'earner',
              //      required: false,
              //     attributes: ['username'],
              //   },
              // ],
              // });
              console.log(req.authErr);

              if (req.authErr === 'EMAIL_NOT_VERIFIED') {
                console.log('EMAIL_NOT_VERIFIED');
                req.session.destroy();
                res.status(401).send({
                  error: req.authErr,
                  email: res.locals.email
                });
              } else if (req.authErr) {
                console.log('LOGIN_ERROR');
                req.session.destroy();
                res.status(401).send({
                  error: 'LOGIN_ERROR'
                });
              } else {
                res.json({
                  username: req.user.username
                });
              }
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function signin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.signin = signin;

var destroySession = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var activity;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _models["default"].activity.create({
              earnerId: req.user.id,
              type: 'logout',
              ipId: res.locals.ip[0].id
            });

          case 2:
            activity = _context4.sent;
            _context4.next = 5;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              attributes: ['createdAt', 'type'],
              include: [{
                model: _models["default"].user,
                as: 'earner',
                required: false,
                attributes: ['username']
              }]
            });

          case 5:
            res.locals.activity = _context4.sent;
            req.logOut();
            req.session.destroy();
            next();

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function destroySession(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Sign up
 */


exports.destroySession = destroySession;

var signup = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$body$props, email, password, username, textCharacters, User;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body$props = req.body.props, email = _req$body$props.email, password = _req$body$props.password, username = _req$body$props.username;

            if (!(!email || !password || !username)) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(422).send({
              error: "all fields are required"
            }));

          case 3:
            textCharacters = new RegExp("^[a-zA-Z0-9]*$");

            if (textCharacters.test(username)) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", res.status(401).send({
              error: 'USERNAME_NO_SPACES_OR_SPECIAL_CHARACTERS_ALLOWED'
            }));

          case 6:
            _context6.next = 8;
            return _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, Op.or, [{
                username: username
              }, {
                email: email.toLowerCase()
              }])
            });

          case 8:
            User = _context6.sent;

            if (!(User && User.username.toLowerCase() === username.toLowerCase())) {
              _context6.next = 12;
              break;
            }

            console.log('already exists');
            return _context6.abrupt("return", res.status(401).send({
              error: 'USERNAME_ALREADY_EXIST'
            }));

          case 12:
            if (!(User && User.email.toLowerCase() === email.toLowerCase())) {
              _context6.next = 15;
              break;
            }

            console.log('e-mail already exists');
            return _context6.abrupt("return", res.status(401).send({
              error: 'EMAIL_ALREADY_EXIST'
            }));

          case 15:
            _context6.next = 17;
            return _models["default"].sequelize.transaction({
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var verificationToken, newUser;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _generate.generateVerificationToken)(24);

                      case 2:
                        verificationToken = _context5.sent;
                        _context5.next = 5;
                        return _models["default"].dashboardUser.create({
                          username: username,
                          password: password,
                          email: email.toLowerCase(),
                          authused: false,
                          authexpires: verificationToken.expires,
                          authtoken: verificationToken.token
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        newUser = _context5.sent;
                        t.afterCommit(function () {
                          (0, _email.sendVerificationEmail)(email.toLowerCase(), newUser.authtoken);
                          return res.json({
                            email: email.toLowerCase()
                          }); // next();
                        });

                      case 7:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x14) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function signup(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Resend verification code
 */


exports.signup = signup;

var resendVerification = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var email;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log('resend verification');
            email = req.body.email;

            _models["default"].dashboardUser.findOne({
              where: (0, _defineProperty2["default"])({}, Op.or, [{
                email: email.toLowerCase()
              }])
            }).then( /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(user) {
                var verificationToken;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return (0, _generate.generateVerificationToken)(24);

                      case 2:
                        verificationToken = _context7.sent;

                        if (!(user.authused === true)) {
                          _context7.next = 6;
                          break;
                        }

                        res.json({
                          success: false
                        });
                        return _context7.abrupt("return", next('Auth Already Used'));

                      case 6:
                        user.update({
                          authexpires: verificationToken.expires,
                          authtoken: verificationToken.token
                        }).then(function (updatedUser) {
                          var email = updatedUser.email,
                              authtoken = updatedUser.authtoken;
                          (0, _email.sendVerificationEmail)(email.toLowerCase(), authtoken);
                          res.json({
                            success: true
                          });
                        })["catch"](function (err) {
                          next(err);
                        });

                      case 7:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x18) {
                return _ref8.apply(this, arguments);
              };
            }())["catch"](function (err) {
              next(err);
            });

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function resendVerification(_x15, _x16, _x17) {
    return _ref7.apply(this, arguments);
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
    where: (0, _defineProperty2["default"])({}, Op.or, [{
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

    if (!(0, _timingSafeEqual["default"])(token, user.authtoken)) {
      throw new Error('INCORRECT_TOKEN');
    }

    user.update({
      authused: true,
      role: 1
    }).then( /*#__PURE__*/function () {
      var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(updatedUser) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                res.locals.user = updatedUser;
                next();

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      return function (_x19) {
        return _ref9.apply(this, arguments);
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