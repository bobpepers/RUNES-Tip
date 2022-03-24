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

/* eslint-disable no-await-in-loop */

/* eslint-disable import/prefer-default-export */
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, _yield$validateWithdr, _yield$validateWithdr2, isInvalidAddress, isNodeOffline, failWithdrawalActivity, addressExternal, UserExternalAddressMnMAssociation, wallet, fee, transaction, activityCreate;

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
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context.next = 18;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context.abrupt("return");

                      case 18:
                        _context.next = 20;
                        return (0, _validateWithdrawalAddress.validateWithdrawalAddress)(filteredMessage[2], user, t);

                      case 20:
                        _yield$validateWithdr = _context.sent;
                        _yield$validateWithdr2 = (0, _slicedToArray2["default"])(_yield$validateWithdr, 3);
                        isInvalidAddress = _yield$validateWithdr2[0];
                        isNodeOffline = _yield$validateWithdr2[1];
                        failWithdrawalActivity = _yield$validateWithdr2[2];

                        if (!isNodeOffline) {
                          _context.next = 34;
                          break;
                        }

                        _context.t0 = ctx.telegram;
                        _context.t1 = ctx.update.message.from.id;
                        _context.next = 30;
                        return (0, _telegram.nodeIsOfflineMessage)();

                      case 30:
                        _context.t2 = _context.sent;
                        _context.t3 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 34;
                        return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                      case 34:
                        if (!isInvalidAddress) {
                          _context.next = 43;
                          break;
                        }

                        _context.t4 = ctx.telegram;
                        _context.t5 = ctx.update.message.from.id;
                        _context.next = 39;
                        return (0, _telegram.invalidAddressMessage)();

                      case 39:
                        _context.t6 = _context.sent;
                        _context.t7 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 43;
                        return _context.t4.sendMessage.call(_context.t4, _context.t5, _context.t6, _context.t7);

                      case 43:
                        if (!(isInvalidAddress || isNodeOffline)) {
                          _context.next = 51;
                          break;
                        }

                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 51;
                          break;
                        }

                        _context.t8 = ctx;
                        _context.next = 48;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 48:
                        _context.t9 = _context.sent;
                        _context.next = 51;
                        return _context.t8.replyWithHTML.call(_context.t8, _context.t9);

                      case 51:
                        if (!failWithdrawalActivity) {
                          _context.next = 54;
                          break;
                        }

                        activity.unshift(failWithdrawalActivity);
                        return _context.abrupt("return");

                      case 54:
                        _context.next = 56;
                        return _models["default"].addressExternal.findOne({
                          where: {
                            address: filteredMessage[2]
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 56:
                        addressExternal = _context.sent;

                        if (addressExternal) {
                          _context.next = 61;
                          break;
                        }

                        _context.next = 60;
                        return _models["default"].addressExternal.create({
                          address: filteredMessage[2]
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 60:
                        addressExternal = _context.sent;

                      case 61:
                        _context.next = 63;
                        return _models["default"].UserAddressExternal.findOne({
                          where: {
                            addressExternalId: addressExternal.id,
                            userId: user.id
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 63:
                        UserExternalAddressMnMAssociation = _context.sent;

                        if (UserExternalAddressMnMAssociation) {
                          _context.next = 68;
                          break;
                        }

                        _context.next = 67;
                        return _models["default"].UserAddressExternal.create({
                          addressExternalId: addressExternal.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 67:
                        UserExternalAddressMnMAssociation = _context.sent;

                      case 68:
                        _context.next = 70;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 70:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 74;
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

                      case 74:
                        transaction = _context.sent;
                        _context.next = 77;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 77:
                        activityCreate = _context.sent;
                        activity.unshift(activityCreate);
                        _context.t10 = ctx.telegram;
                        _context.t11 = ctx.update.message.from.id;
                        _context.next = 83;
                        return (0, _telegram.reviewMessage)(user, transaction);

                      case 83:
                        _context.t12 = _context.sent;
                        _context.t13 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 87;
                        return _context.t10.sendMessage.call(_context.t10, _context.t11, _context.t12, _context.t13);

                      case 87:
                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 94;
                          break;
                        }

                        _context.t14 = ctx;
                        _context.next = 91;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 91:
                        _context.t15 = _context.sent;
                        _context.next = 94;
                        return _context.t14.replyWithHTML.call(_context.t14, _context.t15);

                      case 94:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 95:
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

                        _context2.prev = 10;
                        _context2.next = 13;
                        return ctx.replyWithHTML((0, _telegram.errorMessage)('Withdraw'));

                      case 13:
                        _context2.next = 18;
                        break;

                      case 15:
                        _context2.prev = 15;
                        _context2.t1 = _context2["catch"](10);
                        console.log(_context2.t1);

                      case 18:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 15]]);
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