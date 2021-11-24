"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipRunesToUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var tipRunesToUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, tipTo, tipAmount, bot, runesGroup, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user, amount, userToTip, findUserToTip, wallet, updatedFindUserToTip, tipTransaction;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(ctx.update.message.from.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'tip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.userNotFoundMessage)());
                        return _context.abrupt("return");

                      case 9:
                        amount = new _bignumber["default"](tipAmount).times(1e8).toNumber();

                        if (!(amount < Number(_settings["default"].min.telegram.tip))) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 13;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 13:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.minimumTipMessage)());
                        return _context.abrupt("return");

                      case 16:
                        if (!(amount % 1 !== 0)) {
                          _context.next = 22;
                          break;
                        }

                        _context.next = 19;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 19:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.invalidAmountMessage)());
                        return _context.abrupt("return");

                      case 22:
                        userToTip = tipTo.substring(1);
                        _context.next = 25;
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

                      case 25:
                        findUserToTip = _context.sent;

                        if (findUserToTip) {
                          _context.next = 32;
                          break;
                        }

                        _context.next = 29;
                        return _models["default"].activity.create({
                          type: 'tip_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.unableToFindUserMessage)());
                        return _context.abrupt("return");

                      case 32:
                        if (!(amount >= Number(_settings["default"].min.telegram.tip) && amount % 1 === 0 && findUserToTip)) {
                          _context.next = 52;
                          break;
                        }

                        if (!user) {
                          _context.next = 52;
                          break;
                        }

                        if (!(amount > user.wallet.available)) {
                          _context.next = 39;
                          break;
                        }

                        _context.next = 37;
                        return _models["default"].activity.create({
                          type: 'tip_i',
                          spenderId: user.id,
                          amount: amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.insufficientBalanceMessage)());

                      case 39:
                        if (!(amount <= user.wallet.available)) {
                          _context.next = 52;
                          break;
                        }

                        _context.next = 42;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 42:
                        wallet = _context.sent;
                        updatedFindUserToTip = findUserToTip.wallet.update({
                          available: findUserToTip.wallet.available + amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });
                        _context.next = 46;
                        return _models["default"].tip.create({
                          userId: user.id,
                          userTippedId: findUserToTip.id,
                          amount: amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 46:
                        tipTransaction = _context.sent;
                        _context.next = 49;
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

                      case 49:
                        activity = _context.sent;
                        ctx.reply((0, _telegram.tipSuccessMessage)(user, amount, findUserToTip));

                        _logger["default"].info("Success tip Requested by: ".concat(ctx.update.message.from.id, "-").concat(ctx.update.message.from.username, " to ").concat(findUserToTip.username, " with ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker));

                      case 52:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 53:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x7) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply((0, _telegram.generalErrorMessage)());
            });

          case 2:
            _context2.next = 4;
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
            activity = _context2.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function tipRunesToUser(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.tipRunesToUser = tipRunesToUser;