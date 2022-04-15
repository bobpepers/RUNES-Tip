"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLastSeen = exports.generateUserWalletAndAddress = exports.createUpdateUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var generateUserWalletAndAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userInfo, t) {
    var newAccount, user, wallet, address, newAddress, addressAlreadyExist;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newAccount = false;
            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(userInfo.userId)
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 3:
            user = _context.sent;

            if (!(!user && userInfo.userId)) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return _models["default"].user.create({
              user_id: "telegram-".concat(userInfo.userId),
              username: userInfo.username,
              firstname: userInfo.firstname,
              lastname: userInfo.lastname
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 7:
            user = _context.sent;

          case 8:
            if (!user) {
              _context.next = 36;
              break;
            }

            if (!(user.firstname !== userInfo.firstname || user.lastname !== userInfo.lastname || user.username !== userInfo.username)) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return user.update({
              firstname: userInfo.firstname,
              lastnam: userInfo.lastname,
              username: userInfo.username
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 12:
            user = _context.sent;

          case 13:
            _context.next = 15;
            return _models["default"].wallet.findOne({
              where: {
                userId: user.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 15:
            wallet = _context.sent;

            if (wallet) {
              _context.next = 21;
              break;
            }

            _context.next = 19;
            return _models["default"].wallet.create({
              userId: user.id,
              available: 0,
              locked: 0
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 19:
            wallet = _context.sent;
            newAccount = true;

          case 21:
            if (!wallet) {
              _context.next = 36;
              break;
            }

            _context.next = 24;
            return _models["default"].address.findOne({
              where: {
                walletId: wallet.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 24:
            address = _context.sent;

            if (address) {
              _context.next = 36;
              break;
            }

            _context.next = 28;
            return (0, _rclient.getInstance)().getNewAddress();

          case 28:
            newAddress = _context.sent;
            _context.next = 31;
            return _models["default"].address.findOne({
              where: {
                address: newAddress
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 31:
            addressAlreadyExist = _context.sent;

            if (addressAlreadyExist) {
              _context.next = 36;
              break;
            }

            _context.next = 35;
            return _models["default"].address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 35:
            address = _context.sent;

          case 36:
            return _context.abrupt("return", [user, newAccount]);

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateUserWalletAndAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.generateUserWalletAndAddress = generateUserWalletAndAddress;

var createUpdateUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx) {
    var userId, username, firstname, lastname;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            username = '';
            firstname = '';
            lastname = '';

            if (ctx && ctx.update && ctx.update.message && ctx.update.message.from && ctx.update.message.from.id) {
              userId = ctx.update.message.from.id;
              username = ctx.update.message.from.username ? ctx.update.message.from.username : '';
              firstname = ctx.update.message.from.first_name ? ctx.update.message.from.first_name : '';
              lastname = ctx.update.message.from.last_name ? ctx.update.message.from.last_name : '';
            } else if (ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.from && ctx.update.callback_query.from.id) {
              userId = ctx.update.callback_query.from.id;
              username = ctx.update.callback_query.from.username ? ctx.update.callback_query.from.username : '';
              firstname = ctx.update.callback_query.from.first_name ? ctx.update.callback_query.from.first_name : '';
              lastname = ctx.update.callback_query.from.last_name ? ctx.update.callback_query.from.last_name : '';
            }

            if (!(ctx && ctx.update && ctx.update.message && ctx.update.message.from && ctx.update.message.from.is_bot)) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return");

          case 6:
            if (!(ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.from && ctx.update.callback_query.from.is_bot)) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return");

          case 8:
            if (userId) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return");

          case 10:
            _context4.next = 12;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                var myNewUserInfo, _yield$generateUserWa, _yield$generateUserWa2, newUser, newAccount;

                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        myNewUserInfo = {
                          userId: Number(userId),
                          username: username,
                          firstname: firstname,
                          lastname: lastname
                        };
                        _context3.next = 3;
                        return generateUserWalletAndAddress(myNewUserInfo, t);

                      case 3:
                        _yield$generateUserWa = _context3.sent;
                        _yield$generateUserWa2 = (0, _slicedToArray2["default"])(_yield$generateUserWa, 2);
                        newUser = _yield$generateUserWa2[0];
                        newAccount = _yield$generateUserWa2[1];
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  if (!(newAccount && settings.coin.setting !== 'Pirate' && settings.coin.setting !== 'Komodo')) {
                                    _context2.next = 13;
                                    break;
                                  }

                                  _context2.prev = 1;
                                  _context2.t0 = ctx;
                                  _context2.next = 5;
                                  return (0, _telegram.welcomeMessage)(newUser);

                                case 5:
                                  _context2.t1 = _context2.sent;
                                  _context2.next = 8;
                                  return _context2.t0.replyWithHTML.call(_context2.t0, _context2.t1);

                                case 8:
                                  _context2.next = 13;
                                  break;

                                case 10:
                                  _context2.prev = 10;
                                  _context2.t2 = _context2["catch"](1);
                                  console.log(_context2.t2);

                                case 13:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, null, [[1, 10]]);
                        })));

                      case 8:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createUpdateUser(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createUpdateUser = createUpdateUser;

var updateLastSeen = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ctx) {
    var userId, chatId, updatedUser;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (ctx && ctx.update && ctx.update.message && ctx.update.message.from && ctx.update.message.from.id) {
              userId = ctx.update.message.from.id;
            } else if (ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.from && ctx.update.callback_query.from.id) {
              userId = ctx.update.callback_query.from.id;
            }

            if (ctx && ctx.update && ctx.update.message && ctx.update.message.chat && ctx.update.message.chat.id) {
              chatId = ctx.update.message.chat.id;
            } else if (ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.message && ctx.update.callback_query.message.chat && ctx.update.callback_query.message.chat.id) {
              chatId = ctx.update.callback_query.message.chat.id;
            }

            _context6.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var user, group, active, updatedActive, _updatedActive;

                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(userId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context5.sent;
                        _context5.next = 5;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(chatId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        group = _context5.sent;

                        if (!group) {
                          _context5.next = 19;
                          break;
                        }

                        if (!user) {
                          _context5.next = 19;
                          break;
                        }

                        _context5.next = 10;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 10:
                        active = _context5.sent;

                        if (!active) {
                          _context5.next = 15;
                          break;
                        }

                        _context5.next = 14;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        updatedActive = _context5.sent;

                      case 15:
                        if (active) {
                          _context5.next = 19;
                          break;
                        }

                        _context5.next = 18;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        _updatedActive = _context5.sent;

                      case 19:
                        if (!user) {
                          _context5.next = 23;
                          break;
                        }

                        _context5.next = 22;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        updatedUser = _context5.sent;

                      case 23:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 24:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x6) {
                return _ref6.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
            });

          case 4:
            return _context6.abrupt("return", updatedUser);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function updateLastSeen(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateLastSeen = updateLastSeen;