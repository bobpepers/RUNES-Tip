"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _validateAmount = require("../../helpers/telegram/validateAmount");

var _userWalletExist = require("../../helpers/telegram/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var settings = (0, _settings["default"])();

var tipRunesToUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, tipTo, tipAmount, bot, runesGroup, io, groupTask, setting) {
    var user, activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, userToTip, findUserToTip, wallet, fee, userTipAmount, updatedFindUserToTip, tipTransaction, tiptipTransaction;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'tip');

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
                        return (0, _validateAmount.validateAmount)(ctx, t, tipAmount, user, setting, 'tip');

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
                        userToTip = tipTo.substring(1);
                        _context.next = 20;
                        return _models["default"].user.findOne({
                          where: {
                            username: userToTip
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

                      case 20:
                        findUserToTip = _context.sent;

                        if (findUserToTip) {
                          _context.next = 27;
                          break;
                        }

                        _context.next = 24;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 24:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.unableToFindUserMessage)());
                        return _context.abrupt("return");

                      case 27:
                        _context.next = 29;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 29:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        userTipAmount = amount - Number(fee);
                        updatedFindUserToTip = findUserToTip.wallet.update({
                          available: findUserToTip.wallet.available + userTipAmount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });
                        _context.next = 35;
                        return _models["default"].tip.create({
                          feeAmount: Number(fee),
                          userId: user.id,
                          amount: amount,
                          type: 'split',
                          userCount: 1,
                          groupId: groupTask.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 35:
                        tipTransaction = _context.sent;
                        _context.next = 38;
                        return _models["default"].tiptip.create({
                          userId: findUserToTip.id,
                          tipId: tipTransaction.id,
                          amount: Number(userTipAmount),
                          groupId: groupTask.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 38:
                        tiptipTransaction = _context.sent;
                        _context.next = 41;
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

                      case 41:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.tipSuccessMessage)(user, amount, findUserToTip));

                        _logger["default"].info("Success tip Requested by: ".concat(ctx.update.message.from.id, "-").concat(ctx.update.message.from.username, " to ").concat(findUserToTip.username, " with ").concat(amount / 1e8, " ").concat(settings.coin.ticker));

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 45:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x9) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply((0, _telegram.generalErrorMessage)());
            });

          case 2:
            if (!activity) {
              _context2.next = 7;
              break;
            }

            _context2.next = 5;
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

          case 5:
            activity = _context2.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function tipRunesToUser(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToUser = tipRunesToUser;