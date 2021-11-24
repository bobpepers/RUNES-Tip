"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWalletDepositAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _qrcode = _interopRequireDefault(require("qrcode"));

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var fetchWalletDepositAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, telegramUserId, telegramUserName, io) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var user, depositQr, depositQrFixed;
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

                        if (!user && !user.wallet && !user.wallet.addresses) {
                          ctx.reply((0, _telegram.depositAddressNotFoundMessage)());
                        }

                        if (!(user && user.wallet && user.wallet.addresses)) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 7;
                        return _qrcode["default"].toDataURL(user.wallet.addresses[0].address);

                      case 7:
                        depositQr = _context.sent;
                        depositQrFixed = depositQr.replace('data:image/png;base64,', '');
                        _context.next = 11;
                        return ctx.replyWithPhoto({
                          source: Buffer.from(depositQrFixed, 'base64')
                        }, {
                          caption: (0, _telegram.depositAddressMessage)(telegramUserName, user),
                          parse_mode: 'MarkdownV2'
                        });

                      case 11:
                        _context.next = 13;
                        return ctx.reply((0, _telegram.depositAddressMessage)(telegramUserName, user), {
                          parse_mode: 'MarkdownV2'
                        });

                      case 13:
                        t.afterCommit(function () {
                          _logger["default"].info("Success Deposit Address Requested by: ".concat(telegramUserId, "-").concat(telegramUserName));
                        });

                      case 14:
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
              _logger["default"].error("Error Deposit Address Requested by: ".concat(telegramUserId, "-").concat(telegramUserName, " - ").concat(err));
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchWalletDepositAddress(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchWalletDepositAddress = fetchWalletDepositAddress;