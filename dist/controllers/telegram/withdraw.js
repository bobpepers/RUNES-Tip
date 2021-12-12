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

var _rclient = require("../../services/rclient");

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _validateAmount = require("../../helpers/telegram/validateAmount");

var _userWalletExist = require("../../helpers/telegram/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var settings = (0, _settings["default"])();

var withdrawTelegramCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, withdrawalAddress, withdrawalAmount, io, setting) {
    var user, activity, isValidAddress, complete;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].info("Start Withdrawal Request: ".concat(ctx.update.message.from.id, "-").concat(ctx.update.message.from.username));

            isValidAddress = false;
            complete = false;
            _context2.next = 5;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, wallet, fee, transaction;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'withdraw');

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
                        return (0, _validateAmount.validateAmount)(ctx, t, withdrawalAmount, user, setting, 'withdraw');

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
                        if (!(settings.coin.setting === 'Runebase')) {
                          _context.next = 23;
                          break;
                        }

                        _context.next = 20;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(withdrawalAddress);

                      case 20:
                        isValidAddress = _context.sent;
                        _context.next = 32;
                        break;

                      case 23:
                        if (!(settings.coin.setting === 'Pirate')) {
                          _context.next = 29;
                          break;
                        }

                        _context.next = 26;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(withdrawalAddress);

                      case 26:
                        isValidAddress = _context.sent;
                        _context.next = 32;
                        break;

                      case 29:
                        _context.next = 31;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(withdrawalAddress);

                      case 31:
                        isValidAddress = _context.sent;

                      case 32:
                        if (isValidAddress) {
                          _context.next = 34;
                          break;
                        }

                        return _context.abrupt("return");

                      case 34:
                        _context.next = 36;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 36:
                        wallet = _context.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context.next = 40;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          phase: 'review',
                          type: 'send',
                          to_from: withdrawalAddress,
                          amount: amount,
                          feeAmount: Number(fee)
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 40:
                        transaction = _context.sent;
                        _context.next = 43;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 43:
                        activity = _context.sent;
                        t.afterCommit(function () {
                          complete = true;
                          console.log('done');
                        });

                      case 45:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply((0, _telegram.generalErrorMessage)());
            });

          case 5:
            if (!(ctx.update.message.chat.type !== 'private' && complete)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 8;
            return ctx.reply("i have sent you a direct message");

          case 8:
            if (isValidAddress) {
              _context2.next = 11;
              break;
            }

            ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.invalidAddressMessage)());
            return _context2.abrupt("return");

          case 11:
            ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.withdrawalReviewMessage)());

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function withdrawTelegramCreate(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawTelegramCreate = withdrawTelegramCreate;