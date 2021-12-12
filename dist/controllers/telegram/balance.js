"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWalletBalance = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

// import settings from '../../config/settings';
var fetchWalletBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, telegramUserId, telegramUserName, io) {
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
                var priceInfo;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(telegramUserId)
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

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 6;
                          break;
                        }

                        ctx.reply("User not found");
                        return _context.abrupt("return");

                      case 6:
                        if (user.wallet) {
                          _context.next = 9;
                          break;
                        }

                        ctx.reply("Wallet not found");
                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return _models["default"].priceInfo.findOne({
                          where: {
                            currency: 'USD'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        priceInfo = _context.sent;

                        if (!(ctx.update && ctx.update.message && ctx.update.message.chat && ctx.update.message.chat.type && ctx.update.message.chat.type !== 'private')) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 15;
                        return ctx.reply("i have sent you a direct message");

                      case 15:
                        console.log(ctx);

                        if (!ctx.update.callback_query) {
                          _context.next = 21;
                          break;
                        }

                        _context.next = 19;
                        return ctx.telegram.sendMessage(ctx.update.callback_query.from.id, (0, _telegram.balanceMessage)(telegramUserName, user, priceInfo));

                      case 19:
                        _context.next = 23;
                        break;

                      case 21:
                        _context.next = 23;
                        return ctx.telegram.sendMessage(ctx.update.message.from.id, (0, _telegram.balanceMessage)(telegramUserName, user, priceInfo));

                      case 23:
                        t.afterCommit(function () {
                          _logger["default"].info("Success Balance Requested by: ".concat(telegramUserId, "-").concat(telegramUserName));
                        });

                      case 24:
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
              console.log(err);

              _logger["default"].error("Error Balance Requested by: ".concat(telegramUserId, "-").concat(telegramUserName, " - ").concat(err));
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchWalletBalance(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchWalletBalance = fetchWalletBalance;