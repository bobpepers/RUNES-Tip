"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToDiscordUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var tipRunesToDiscordUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, filteredMessage, userIdToTip, io) {
    var activity, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var amount, findUserToTip, wallet, updatedFindUserToTip, tipTransaction, userId, tempUserName, userIdTipped;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses'
                            }]
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context2.sent;

                        if (user) {
                          _context2.next = 10;
                          break;
                        }

                        _context2.next = 6;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context2.sent;
                        _context2.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord.userNotFoundMessage)(message, 'Tip')]
                        });

                      case 9:
                        return _context2.abrupt("return");

                      case 10:
                        amount = 0;

                        if (filteredMessage[2].toLowerCase() === 'all') {
                          amount = user.wallet.available;
                        } else {
                          amount = new _bignumber["default"](filteredMessage[2]).times(1e8).toNumber();
                        }

                        if (!(amount % 1 !== 0)) {
                          _context2.next = 19;
                          break;
                        }

                        _context2.next = 15;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activity = _context2.sent;
                        _context2.next = 18;
                        return message.channel.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Tip')]
                        });

                      case 18:
                        return _context2.abrupt("return");

                      case 19:
                        if (!(amount < Number(_settings["default"].min.discord.tip))) {
                          _context2.next = 26;
                          break;
                        }

                        _context2.next = 22;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        activity = _context2.sent;
                        _context2.next = 25;
                        return message.channel.send({
                          embeds: [(0, _discord.minimumMessage)(message, 'Tip')]
                        });

                      case 25:
                        return _context2.abrupt("return");

                      case 26:
                        if (!(amount > user.wallet.available)) {
                          _context2.next = 33;
                          break;
                        }

                        _context2.next = 29;
                        return _models["default"].activity.create({
                          type: 'tip_i',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activity = _context2.sent;
                        _context2.next = 32;
                        return message.channel.send({
                          embeds: [(0, _discord.insufficientBalanceMessage)(message, 'Tip')]
                        });

                      case 32:
                        return _context2.abrupt("return");

                      case 33:
                        _context2.next = 35;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(userIdToTip)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet',
                            include: [{
                              model: _models["default"].address,
                              as: 'addresses'
                            }]
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        findUserToTip = _context2.sent;

                        if (findUserToTip) {
                          _context2.next = 43;
                          break;
                        }

                        _context2.next = 39;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 39:
                        activity = _context2.sent;
                        _context2.next = 42;
                        return message.channel.send({
                          embeds: [_discord.unableToFindUserTipMessage]
                        });

                      case 42:
                        return _context2.abrupt("return");

                      case 43:
                        if (!(user.id === findUserToTip.id)) {
                          _context2.next = 50;
                          break;
                        }

                        _context2.next = 46;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        activity = _context2.sent;
                        _context2.next = 49;
                        return message.channel.send('cannot tip self');

                      case 49:
                        return _context2.abrupt("return");

                      case 50:
                        _context2.next = 52;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 52:
                        wallet = _context2.sent;
                        _context2.next = 55;
                        return findUserToTip.wallet.update({
                          available: findUserToTip.wallet.available + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 55:
                        updatedFindUserToTip = _context2.sent;
                        _context2.next = 58;
                        return _models["default"].tip.create({
                          userId: user.id,
                          userTippedId: findUserToTip.id,
                          amount: amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 58:
                        tipTransaction = _context2.sent;
                        console.log(updatedFindUserToTip);
                        console.log("updatedFindUserToTip");
                        _context2.next = 63;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'tip_s',
                          earnerId: findUserToTip.id,
                          spenderId: user.id,
                          earner_balance: updatedFindUserToTip.available + updatedFindUserToTip.locked,
                          spender_balance: wallet.available + wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 63:
                        activity = _context2.sent;
                        userId = user.user_id.replace('discord-', '');

                        if (findUserToTip.ignoreMe) {
                          tempUserName = findUserToTip.username;
                        } else {
                          userIdTipped = findUserToTip.user_id.replace('discord-', '');
                          tempUserName = "<@".concat(userIdTipped, ">");
                        }

                        _context2.next = 68;
                        return message.channel.send({
                          embeds: [(0, _discord.tipSuccessMessage)(userId, tempUserName, amount)]
                        });

                      case 68:
                        _logger["default"].info("Success tip Requested by: ".concat(user.user_id, "-").concat(user.username, " to ").concat(findUserToTip.user_id, "-").concat(findUserToTip.username, " with ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker));

                        t.afterCommit( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  console.log('Done');

                                case 1:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 70:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.channel.send("Something went wrong.");
            });

          case 2:
            _context3.next = 4;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }, {
                model: _models["default"].user,
                as: 'spender'
              }]
            });

          case 4:
            activity = _context3.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function tipRunesToDiscordUser(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToDiscordUser = tipRunesToDiscordUser;