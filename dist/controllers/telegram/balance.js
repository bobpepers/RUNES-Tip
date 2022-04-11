"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var telegramBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx, io) {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, createActivity, findActivity, priceInfo;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'balance');

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
                        return _models["default"].activity.create({
                          type: 'balance_s',
                          earnerId: user.id,
                          earner_balance: user.wallet.available + user.wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        createActivity = _context.sent;
                        _context.next = 14;
                        return _models["default"].activity.findOne({
                          where: {
                            id: createActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        findActivity = _context.sent;
                        activity.unshift(findActivity);
                        _context.next = 18;
                        return _models["default"].currency.findOne({
                          where: {
                            iso: 'USD'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 18:
                        priceInfo = _context.sent;

                        if (!ctx.update.callback_query) {
                          _context.next = 30;
                          break;
                        }

                        _context.t0 = ctx.telegram;
                        _context.t1 = ctx.update.callback_query.from.id;
                        _context.next = 24;
                        return (0, _telegram.balanceMessage)(user, priceInfo);

                      case 24:
                        _context.t2 = _context.sent;
                        _context.t3 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 28;
                        return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                      case 28:
                        _context.next = 38;
                        break;

                      case 30:
                        _context.t4 = ctx.telegram;
                        _context.t5 = ctx.update.message.from.id;
                        _context.next = 34;
                        return (0, _telegram.balanceMessage)(user, priceInfo);

                      case 34:
                        _context.t6 = _context.sent;
                        _context.t7 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 38;
                        return _context.t4.sendMessage.call(_context.t4, _context.t5, _context.t6, _context.t7);

                      case 38:
                        if (!(ctx.update && ctx.update.message && ctx.update.message.chat && ctx.update.message.chat.type && ctx.update.message.chat.type !== 'private')) {
                          _context.next = 45;
                          break;
                        }

                        _context.t8 = ctx;
                        _context.next = 42;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 42:
                        _context.t9 = _context.sent;
                        _context.next = 45;
                        return _context.t8.replyWithHTML.call(_context.t8, _context.t9);

                      case 45:
                        t.afterCommit(function () {
                          _logger["default"].info("Success Balance Requested");
                        });

                      case 46:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
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
                          type: 'balance',
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

                        _logger["default"].error("Balance error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Balance');

                      case 14:
                        _context2.t2 = _context2.sent;
                        _context2.next = 17;
                        return _context2.t1.replyWithHTML.call(_context2.t1, _context2.t2);

                      case 17:
                        _context2.next = 22;
                        break;

                      case 19:
                        _context2.prev = 19;
                        _context2.t3 = _context2["catch"](10);
                        console.log(_context2.t3);

                      case 22:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5], [10, 19]]);
              }));

              return function (_x4) {
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

  return function telegramBalance(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramBalance = telegramBalance;