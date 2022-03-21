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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
    var user, userActivity, activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, userId, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, isValidAddressInfo, isValidAddress, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction, activityCreate;

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
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        userId = user.user_id.replace('discord-', '');
                        _context.next = 12;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 12:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 19;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 19:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddressInfo = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 43;
                          break;
                        }

                        _context.prev = 21;
                        _context.next = 24;
                        return (0, _rclient.getInstance)().getAddressInfo(filteredMessage[2]);

                      case 24:
                        isValidAddressInfo = _context.sent;
                        _context.next = 43;
                        break;

                      case 27:
                        _context.prev = 27;
                        _context.t0 = _context["catch"](21);
                        //
                        console.log(_context.t0);

                        if (!(_context.t0.response && _context.t0.response.status === 500)) {
                          _context.next = 40;
                          break;
                        }

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 34;
                          break;
                        }

                        _context.next = 34;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 34:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 39;
                          break;
                        }

                        _context.next = 37;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 37:
                        _context.next = 39;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Withdraw')]
                        });

                      case 39:
                        return _context.abrupt("return");

                      case 40:
                        _context.next = 42;
                        return message.author.send('Runebase node offline');

                      case 42:
                        return _context.abrupt("return");

                      case 43:
                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 50;
                          break;
                        }

                        _context.next = 47;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 47:
                        isValidAddress = _context.sent;
                        _context.next = 65;
                        break;

                      case 50:
                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 56;
                          break;
                        }

                        _context.next = 53;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(filteredMessage[2]);

                      case 53:
                        isValidAddress = _context.sent;
                        _context.next = 65;
                        break;

                      case 56:
                        if (!(settings.coin.setting === 'Komodo')) {
                          _context.next = 62;
                          break;
                        }

                        _context.next = 59;
                        return (0, _rclient.getInstance)().utils.isKomodoAddress(filteredMessage[2]);

                      case 59:
                        isValidAddress = _context.sent;
                        _context.next = 65;
                        break;

                      case 62:
                        _context.next = 64;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(filteredMessage[2]);

                      case 64:
                        isValidAddress = _context.sent;

                      case 65:
                        if (isValidAddress) {
                          _context.next = 75;
                          break;
                        }

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 69;
                          break;
                        }

                        _context.next = 69;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 69:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 74;
                          break;
                        }

                        _context.next = 72;
                        return message.author.send({
                          embeds: [(0, _discord.invalidAddressMessage)(message)]
                        });

                      case 72:
                        _context.next = 74;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Withdraw')]
                        });

                      case 74:
                        return _context.abrupt("return");

                      case 75:
                        _context.next = 77;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 77:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 82;
                          break;
                        }

                        _context.next = 81;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 81:
                        addressExternal = _context.sent;

                      case 82:
                        _context.next = 84;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 84:
                        UserExternalAddressMnMAssociation = _context.sent;

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 89;
                          break;
                        }

                        _context.next = 88;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 88:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 89:
                        _context.next = 91;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 91:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 95;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          addressExternalId: addressExternal.id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount,
                          feeAmount: Number(fee),
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 95:
                        transaction = _context.sent;
                        _context.next = 98;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 98:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);

                        if (!(message.channel.type === 'DM')) {
                          _context.next = 103;
                          break;
                        }

                        _context.next = 103;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message, transaction)]
                        });

                      case 103:
                        if (!(message.channel.type === 'GUILD_TEXT')) {
                          _context.next = 108;
                          break;
                        }

                        _context.next = 106;
                        return message.author.send({
                          embeds: [(0, _discord.reviewMessage)(message, transaction)]
                        });

                      case 106:
                        _context.next = 108;
                        return message.channel.send({
                          embeds: [(0, _discord.warnDirectMessage)(userId, 'Withdraw')]
                        });

                      case 108:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 109:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[21, 27]]);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'withdraw',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("withdraw error: ".concat(err));

                        if (!(err.code && err.code === 50007)) {
                          _context2.next = 15;
                          break;
                        }

                        _context2.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord.cannotSendMessageUser)("Withdraw", message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 13:
                        _context2.next = 17;
                        break;

                      case 15:
                        _context2.next = 17;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Withdraw")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 17:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x9) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function withdrawDiscordCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawDiscordCreate = withdrawDiscordCreate;