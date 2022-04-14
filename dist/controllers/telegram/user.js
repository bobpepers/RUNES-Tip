"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLastSeen = exports.createUpdateUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var createUpdateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx) {
    var userId, username, firstname, lastname, isNewUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            username = '';
            firstname = '';
            lastname = '';
            isNewUser = false;

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
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return");

          case 7:
            if (!(ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.from && ctx.update.callback_query.from.is_bot)) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return");

          case 9:
            if (userId) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return");

          case 11:
            _context3.next = 13;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var user, wallet, address, newAddress, addressAlreadyExist;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(userId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context2.sent;

                        if (!(!user && userId)) {
                          _context2.next = 7;
                          break;
                        }

                        _context2.next = 6;
                        return _models["default"].user.create({
                          user_id: "telegram-".concat(userId),
                          username: username,
                          firstname: firstname,
                          lastname: lastname
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        user = _context2.sent;

                      case 7:
                        if (!user) {
                          _context2.next = 35;
                          break;
                        }

                        if (!(user.firstname !== firstname || user.lastname !== lastname || user.username !== username)) {
                          _context2.next = 12;
                          break;
                        }

                        _context2.next = 11;
                        return user.update({
                          firstname: firstname,
                          lastname: lastname,
                          username: username
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 11:
                        user = _context2.sent;

                      case 12:
                        _context2.next = 14;
                        return _models["default"].wallet.findOne({
                          where: {
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        wallet = _context2.sent;

                        if (wallet) {
                          _context2.next = 20;
                          break;
                        }

                        _context2.next = 18;
                        return _models["default"].wallet.create({
                          userId: user.id,
                          available: 0,
                          locked: 0
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        wallet = _context2.sent;
                        isNewUser = true;

                      case 20:
                        if (!wallet) {
                          _context2.next = 35;
                          break;
                        }

                        _context2.next = 23;
                        return _models["default"].address.findOne({
                          where: {
                            walletId: wallet.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 23:
                        address = _context2.sent;

                        if (address) {
                          _context2.next = 35;
                          break;
                        }

                        _context2.next = 27;
                        return (0, _rclient.getInstance)().getNewAddress();

                      case 27:
                        newAddress = _context2.sent;
                        _context2.next = 30;
                        return _models["default"].address.findOne({
                          where: {
                            address: newAddress
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 30:
                        addressAlreadyExist = _context2.sent;

                        if (addressAlreadyExist) {
                          _context2.next = 35;
                          break;
                        }

                        _context2.next = 34;
                        return _models["default"].address.create({
                          address: newAddress,
                          walletId: wallet.id,
                          type: 'deposit',
                          confirmed: true
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 34:
                        address = _context2.sent;

                      case 35:
                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (!(isNewUser && settings.coin.setting !== 'Pirate')) {
                                    _context.next = 13;
                                    break;
                                  }

                                  _context.prev = 1;
                                  _context.t0 = ctx;
                                  _context.next = 5;
                                  return (0, _telegram.welcomeMessage)(user);

                                case 5:
                                  _context.t1 = _context.sent;
                                  _context.next = 8;
                                  return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

                                case 8:
                                  _context.next = 13;
                                  break;

                                case 10:
                                  _context.prev = 10;
                                  _context.t2 = _context["catch"](1);
                                  console.log(_context.t2);

                                case 13:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, null, [[1, 10]]);
                        })));

                      case 36:
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
              console.log(err);
            });

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function createUpdateUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUpdateUser = createUpdateUser;

var updateLastSeen = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(ctx) {
    var userId, chatId, updatedUser;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
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

            _context5.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                var user, group, active, updatedActive, _updatedActive;

                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(userId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 2:
                        user = _context4.sent;
                        _context4.next = 5;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(chatId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        group = _context4.sent;

                        if (!group) {
                          _context4.next = 19;
                          break;
                        }

                        if (!user) {
                          _context4.next = 19;
                          break;
                        }

                        _context4.next = 10;
                        return _models["default"].active.findOne({
                          where: {
                            userId: user.id,
                            groupId: group.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 10:
                        active = _context4.sent;

                        if (!active) {
                          _context4.next = 15;
                          break;
                        }

                        _context4.next = 14;
                        return active.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        updatedActive = _context4.sent;

                      case 15:
                        if (active) {
                          _context4.next = 19;
                          break;
                        }

                        _context4.next = 18;
                        return _models["default"].active.create({
                          groupId: group.id,
                          userId: user.id,
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        _updatedActive = _context4.sent;

                      case 19:
                        if (!user) {
                          _context4.next = 23;
                          break;
                        }

                        _context4.next = 22;
                        return user.update({
                          lastSeen: new Date(Date.now())
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 22:
                        updatedUser = _context4.sent;

                      case 23:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 24:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
            });

          case 4:
            return _context5.abrupt("return", updatedUser);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function updateLastSeen(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateLastSeen = updateLastSeen;