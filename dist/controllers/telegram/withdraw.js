"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawTelegramCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/client/telegram/validateAmount");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _validateWithdrawalAddress = require("../../helpers/blockchain/validateWithdrawalAddress");

var _disallowWithdrawToSelf = require("../../helpers/withdraw/disallowWithdrawToSelf");

var _createOrUseExternalWithdrawAddress = require("../../helpers/withdraw/createOrUseExternalWithdrawAddress");

var _extractWithdrawMemo = require("../../helpers/withdraw/extractWithdrawMemo");

var _settings = _interopRequireDefault(require("../../config/settings"));

/* eslint-disable no-await-in-loop */

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var withdrawTelegramCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue) {
    var activity;
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, _yield$validateWithdr, _yield$validateWithdr2, isInvalidAddress, isNodeOffline, failWithdrawalActivity, isMyAddressActivity, memo, addressExternal, wallet, fee, transaction, activityCreate;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, filteredMessage[1].toLowerCase());

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
                        _context.next = 11;
                        return (0, _validateAmount.validateAmount)(ctx, t, filteredMessage[3], user, setting, filteredMessage[1].toLowerCase());

                      case 11:
                        _yield$validateAmount = _context.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context.next = 19;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 19:
                        _context.next = 21;
                        return (0, _validateWithdrawalAddress.validateWithdrawalAddress)(filteredMessage[2], user, t);

                      case 21:
                        _yield$validateWithdr = _context.sent;
                        _yield$validateWithdr2 = (0, _slicedToArray2["default"])(_yield$validateWithdr, 3);
                        isInvalidAddress = _yield$validateWithdr2[0];
                        isNodeOffline = _yield$validateWithdr2[1];
                        failWithdrawalActivity = _yield$validateWithdr2[2];

                        if (!isNodeOffline) {
                          _context.next = 35;
                          break;
                        }

                        _context.t0 = ctx.telegram;
                        _context.t1 = ctx.update.message.from.id;
                        _context.next = 31;
                        return (0, _telegram.nodeIsOfflineMessage)();

                      case 31:
                        _context.t2 = _context.sent;
                        _context.t3 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 35;
                        return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                      case 35:
                        if (!isInvalidAddress) {
                          _context.next = 44;
                          break;
                        }

                        _context.t4 = ctx.telegram;
                        _context.t5 = ctx.update.message.from.id;
                        _context.next = 40;
                        return (0, _telegram.invalidAddressMessage)();

                      case 40:
                        _context.t6 = _context.sent;
                        _context.t7 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 44;
                        return _context.t4.sendMessage.call(_context.t4, _context.t5, _context.t6, _context.t7);

                      case 44:
                        if (!(isInvalidAddress || isNodeOffline)) {
                          _context.next = 52;
                          break;
                        }

                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 52;
                          break;
                        }

                        _context.t8 = ctx;
                        _context.next = 49;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 49:
                        _context.t9 = _context.sent;
                        _context.next = 52;
                        return _context.t8.replyWithHTML.call(_context.t8, _context.t9);

                      case 52:
                        if (!failWithdrawalActivity) {
                          _context.next = 55;
                          break;
                        }

                        activity.unshift(failWithdrawalActivity);
                        return _context.abrupt("return");

                      case 55:
                        _context.next = 57;
                        return (0, _disallowWithdrawToSelf.disallowWithdrawToSelf)(filteredMessage[2], user, t);

                      case 57:
                        isMyAddressActivity = _context.sent;

                        if (!isMyAddressActivity) {
                          _context.next = 76;
                          break;
                        }

                        _context.t10 = ctx.telegram;
                        _context.t11 = ctx.update.message.from.id;
                        _context.next = 63;
                        return (0, _telegram.unableToWithdrawToSelfMessage)(ctx);

                      case 63:
                        _context.t12 = _context.sent;
                        _context.t13 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 67;
                        return _context.t10.sendMessage.call(_context.t10, _context.t11, _context.t12, _context.t13);

                      case 67:
                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 74;
                          break;
                        }

                        _context.t14 = ctx;
                        _context.next = 71;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 71:
                        _context.t15 = _context.sent;
                        _context.next = 74;
                        return _context.t14.replyWithHTML.call(_context.t14, _context.t15);

                      case 74:
                        activity.unshift(isMyAddressActivity);
                        return _context.abrupt("return");

                      case 76:
                        memo = null;

                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 89;
                          break;
                        }

                        _context.next = 80;
                        return (0, _extractWithdrawMemo.extractWithdrawMemo)(ctx.update.message.text, filteredMessage);

                      case 80:
                        memo = _context.sent;

                        if (!(memo.length > 512)) {
                          _context.next = 89;
                          break;
                        }

                        _context.t16 = ctx;
                        _context.next = 85;
                        return (0, _telegram.telegramTransactionMemoTooLongMessage)(ctx, memo.length);

                      case 85:
                        _context.t17 = _context.sent;
                        _context.next = 88;
                        return _context.t16.replyWithHTML.call(_context.t16, _context.t17);

                      case 88:
                        return _context.abrupt("return");

                      case 89:
                        _context.next = 91;
                        return (0, _createOrUseExternalWithdrawAddress.createOrUseExternalWithdrawAddress)(filteredMessage[2], user, t);

                      case 91:
                        addressExternal = _context.sent;
                        _context.next = 94;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 94:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 98;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          addressExternalId: addressExternal.id,
                          phase: 'review',
                          type: 'send',
                          to_from: filteredMessage[2],
                          amount: amount,
                          feeAmount: Number(fee),
                          userId: user.id,
                          memo: memo
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 98:
                        transaction = _context.sent;
                        _context.next = 101;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 101:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);
                        _context.t18 = ctx.telegram;
                        _context.t19 = ctx.update.message.from.id;
                        _context.next = 107;
                        return (0, _telegram.reviewMessage)(user, transaction);

                      case 107:
                        _context.t20 = _context.sent;
                        _context.t21 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 111;
                        return _context.t18.sendMessage.call(_context.t18, _context.t19, _context.t20, _context.t21);

                      case 111:
                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 118;
                          break;
                        }

                        _context.t22 = ctx;
                        _context.next = 115;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 115:
                        _context.t23 = _context.sent;
                        _context.next = 118;
                        return _context.t22.replyWithHTML.call(_context.t22, _context.t23);

                      case 118:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 119:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x10) {
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
                          type: 'Withdraw',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Telegram: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("withdraw error: ".concat(err));

                        if (!(err && err.response && err.response.error_code && err.response.error_code === 403)) {
                          _context2.next = 25;
                          break;
                        }

                        _context2.prev = 11;
                        _context2.t1 = ctx;
                        _context2.next = 15;
                        return (0, _telegram.unableToDirectMessageErrorMessage)(ctx, 'Withdraw');

                      case 15:
                        _context2.t2 = _context2.sent;
                        _context2.next = 18;
                        return _context2.t1.replyWithHTML.call(_context2.t1, _context2.t2);

                      case 18:
                        _context2.next = 23;
                        break;

                      case 20:
                        _context2.prev = 20;
                        _context2.t3 = _context2["catch"](11);
                        console.log(_context2.t3);

                      case 23:
                        _context2.next = 37;
                        break;

                      case 25:
                        _context2.prev = 25;
                        _context2.t4 = ctx;
                        _context2.next = 29;
                        return (0, _telegram.errorMessage)('Withdraw');

                      case 29:
                        _context2.t5 = _context2.sent;
                        _context2.next = 32;
                        return _context2.t4.replyWithHTML.call(_context2.t4, _context2.t5);

                      case 32:
                        _context2.next = 37;
                        break;

                      case 34:
                        _context2.prev = 34;
                        _context2.t6 = _context2["catch"](25);
                        console.log(_context2.t6);

                      case 37:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [11, 20], [25, 34]]);
              }));

              return function (_x11) {
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

  return function withdrawTelegramCreate(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawTelegramCreate = withdrawTelegramCreate;