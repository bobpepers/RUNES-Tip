"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawTelegramCreate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var withdrawTelegramCreate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, withdrawalAddress, withdrawalAmount, io) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].info("Start Withdrawal Request: ".concat(ctx.update.message.from.id, "-").concat(ctx.update.message.from.username));

            if (!(ctx.update.message.chat.type !== 'private')) {
              _context2.next = 4;
              break;
            }

            _context2.next = 4;
            return ctx.reply("i have send you a direct message");

          case 4:
            _context2.next = 6;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var amount, isValidAddress, user, wallet, transaction, activity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        amount = new _bignumber["default"](withdrawalAmount).times(1e8).toNumber();

                        if (amount < Number(_settings["default"].min.withdrawal)) {
                          ctx.reply((0, _telegram.minimumWithdrawalMessage)());
                        }

                        if (amount % 1 !== 0) {
                          ctx.reply((0, _telegram.invalidAmountMessage)());
                        } // Add new currencies here (default fallback Runebase)


                        // Add new currencies here (default fallback Runebase)
                        isValidAddress = false;

                        if (!(_settings["default"].coin.name === 'Runebase')) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 7;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(withdrawalAddress);

                      case 7:
                        isValidAddress = _context.sent;
                        _context.next = 19;
                        break;

                      case 10:
                        if (!(_settings["default"].coin.name === 'Pirate')) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 13;
                        return (0, _rclient.getInstance)().utils.isPirateAddress(withdrawalAddress);

                      case 13:
                        isValidAddress = _context.sent;
                        _context.next = 19;
                        break;

                      case 16:
                        _context.next = 18;
                        return (0, _rclient.getInstance)().utils.isRunebaseAddress(withdrawalAddress);

                      case 18:
                        isValidAddress = _context.sent;

                      case 19:
                        //
                        if (!isValidAddress) {
                          ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.invalidAddressMessage)());
                        }

                        if (!(amount >= Number(_settings["default"].min.withdrawal) && amount % 1 === 0 && isValidAddress)) {
                          _context.next = 38;
                          break;
                        }

                        _context.next = 23;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(ctx.update.message.from.id)
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

                      case 23:
                        user = _context.sent;

                        if (!user) {
                          ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.userNotFoundMessage)());
                        }

                        if (!user) {
                          _context.next = 38;
                          break;
                        }

                        if (amount > user.wallet.available) {
                          ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.insufficientBalanceMessage)());
                        }

                        if (!(amount <= user.wallet.available)) {
                          _context.next = 38;
                          break;
                        }

                        _context.next = 30;
                        return user.wallet.update({
                          available: user.wallet.available - amount,
                          locked: user.wallet.locked + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 30:
                        wallet = _context.sent;
                        _context.next = 33;
                        return _models["default"].transaction.create({
                          addressId: wallet.addresses[0].id,
                          phase: 'review',
                          type: 'send',
                          to_from: withdrawalAddress,
                          amount: amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 33:
                        transaction = _context.sent;
                        _context.next = 36;
                        return _models["default"].activity.create({
                          spenderId: user.id,
                          type: 'withdrawRequested',
                          amount: amount,
                          transactionId: transaction.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 36:
                        activity = _context.sent;
                        ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.withdrawalReviewMessage)());

                      case 38:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 39:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply((0, _telegram.generalErrorMessage)());
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function withdrawTelegramCreate(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.withdrawTelegramCreate = withdrawTelegramCreate;