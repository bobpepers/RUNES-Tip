"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawDiscordCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _discord = require("../../messages/discord");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _userWalletExist = require("../../helpers/discord/userWalletExist");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var withdrawDiscordCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
    var user, activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].info("Start Withdrawal Request: ".concat(message.author.id, "-").concat(message.author.username));

            _context2.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, isValidAddress, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction, userId;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        activity = _yield$userWalletExis2[1];

                        if (user) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return");

                      case 8:
                        _context.next = 10;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 10:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 17;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context.abrupt("return");

                      case 17:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 24;
                          break;
                        }

                        _context.next = 21;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 21:
                        isValidAddress = _context.sent;
                        _context.next = 33;
                        break;

                      case 24:
                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 30;
                          break;
                        }

                        _context.next = 27;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(filteredMessage[2]);

                      case 27:
                        isValidAddress = _context.sent;
                        _context.next = 33;
                        break;

                      case 30:
                        _context.next = 32;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 32:
                        isValidAddress = _context.sent;

                      case 33:
                        if (isValidAddress) {
                          _context.next = 37;
                          break;
                        }

                        _context.next = 36;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 36:
                        return _context.abrupt("return");

                      case 37:
                        _context.next = 39;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 39:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 46;
                          break;
                        }

                        console.log('notfound');
                        console.log(filteredMessage[2]);
                        _context.next = 45;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 45:
                        addressExternal = _context.sent;

                      case 46:
                        console.log('after');
                        _context.next = 49;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 49:
                        UserExternalAddressMnMAssociation = _context.sent;
                        console.log('after2');

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 55;
                          break;
                        }

                        _context.next = 54;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 54:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 55:
                        _context.next = 57;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 57:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 61;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          addressExternalId: addressExternal.id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount,
                          feeAmount: Number(fee)
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 61:
                        transaction = _context.sent;
                        _context.next = 64;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 64:
                        activity = _context.sent;
                        userId = user.user_id.replace('discord-', '');

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 69;
                          break;
                        }

                        _context.next = 69;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message)]
                        });

                      case 69:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 74;
                          break;
                        }

                        _context.next = 72;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Balance')]
                        });

                      case 72:
                        _context.next = 74;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message)]
                        });

                      case 74:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 75:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              message.author.send("Something went wrong.");
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function withdrawDiscordCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawDiscordCreate = withdrawDiscordCreate;