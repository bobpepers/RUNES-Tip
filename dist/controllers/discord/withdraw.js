"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawDiscordCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _discord = require("../../messages/discord");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */

/**
 * Create Withdrawal
 */
var withdrawDiscordCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, filteredMessage) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(filteredMessage);

            _logger["default"].info("Start Withdrawal Request: ".concat(message.author.id, "-").concat(message.author.username));

            _context2.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var amount, tipper, isValidAddress, user, wallet, transaction, activity, userId;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        amount = 0;

                        if (!(filteredMessage[3].toLowerCase() === 'all')) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 4;
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

                      case 4:
                        tipper = _context.sent;

                        if (tipper) {
                          amount = tipper.wallet.available;
                        } else {
                          amount = 0;
                        }

                        _context.next = 9;
                        break;

                      case 8:
                        amount = new _bignumber["default"](filteredMessage[3]).times(1e8).toNumber();

                      case 9:
                        if (!(amount < Number(_settings["default"].min.withdrawal))) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 12;
                        return message.author.send({
                          embeds: [(0, _discord.minimumWithdrawalMessage)(message)]
                        });

                      case 12:
                        if (!(amount % 1 !== 0)) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 15;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAmountMessage)(message, 'Withdraw')]
                        });

                      case 15:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(_settings["default"].coin.name === 'Runebase')) {
                          _context.next = 22;
                          break;
                        }

                        _context.next = 19;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 19:
                        isValidAddress = _context.sent;
                        _context.next = 31;
                        break;

                      case 22:
                        if (!(_settings["default"].coin.name === 'Pirate')) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 25;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(filteredMessage[2]);

                      case 25:
                        isValidAddress = _context.sent;
                        _context.next = 31;
                        break;

                      case 28:
                        _context.next = 30;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 30:
                        isValidAddress = _context.sent;

                      case 31:
                        if (isValidAddress) {
                          _context.next = 34;
                          break;
                        }

                        _context.next = 34;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 34:
                        if (!(amount >= Number(_settings["default"].min.withdrawal) && amount % 1 === 0 && isValidAddress)) {
                          _context.next = 66;
                          break;
                        }

                        _context.next = 37;
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

                      case 37:
                        user = _context.sent;

                        if (user) {
                          _context.next = 41;
                          break;
                        }

                        _context.next = 41;
                        return message.author.send({
                          embeds: [(0, _discord.userNotFoundMessage)(message, 'Withdraw')]
                        });

                      case 41:
                        console.log('5');

                        if (!user) {
                          _context.next = 66;
                          break;
                        }

                        if (!(amount > user.wallet.available)) {
                          _context.next = 46;
                          break;
                        }

                        _context.next = 46;
                        return message.author.send({
                          embeds: [(0, _discord.insufficientBalanceMessage)(message, 'Withdraw')]
                        });

                      case 46:
                        if (!(amount <= user.wallet.available)) {
                          _context.next = 66;
                          break;
                        }

                        _context.next = 49;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 49:
                        wallet = _context.sent;
                        console.log('6');
                        _context.next = 53;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 53:
                        transaction = _context.sent;
                        _context.next = 56;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 56:
                        activity = _context.sent;
                        userId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 61;
                          break;
                        }

                        _context.next = 61;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message)]
                        });

                      case 61:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 66;
                          break;
                        }

                        _context.next = 64;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Balance')]
                        });

                      case 64:
                        _context.next = 66;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message)]
                        });

                      case 66:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 67:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              message.author.send("Something went wrong.");
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function withdrawDiscordCreate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawDiscordCreate = withdrawDiscordCreate;