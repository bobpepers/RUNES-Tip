"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchWalletDepositAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _qrcode = _interopRequireDefault(require("qrcode"));

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var fetchWalletDepositAddress = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, depositQr, depositQrFixed, userId, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'deposit');

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
                        if (!(!user && !user.wallet && !user.wallet.addresses)) {
                          _context.next = 17;
                          break;
                        }

                        _context.t0 = ctx;
                        _context.next = 13;
                        return (0, _telegram.depositAddressNotFoundMessage)();

                      case 13:
                        _context.t1 = _context.sent;
                        _context.next = 16;
                        return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

                      case 16:
                        return _context.abrupt("return");

                      case 17:
                        _context.next = 19;
                        return _qrcode["default"].toDataURL(user.wallet.addresses[0].address);

                      case 19:
                        depositQr = _context.sent;
                        depositQrFixed = depositQr.replace('data:image/png;base64,', '');
                        userId = user.user_id.replace('telegram-', '');
                        _context.t2 = ctx.telegram;
                        _context.t3 = userId;
                        _context.t4 = {
                          source: Buffer.from(depositQrFixed, 'base64')
                        };
                        _context.next = 27;
                        return (0, _telegram.depositAddressMessage)(user);

                      case 27:
                        _context.t5 = _context.sent;
                        _context.t6 = {
                          caption: _context.t5,
                          parse_mode: 'HTML'
                        };
                        _context.next = 31;
                        return _context.t2.sendPhoto.call(_context.t2, _context.t3, _context.t4, _context.t6);

                      case 31:
                        _context.t7 = ctx.telegram;
                        _context.t8 = userId;
                        _context.next = 35;
                        return (0, _telegram.depositAddressMessage)(user);

                      case 35:
                        _context.t9 = _context.sent;
                        _context.t10 = {
                          parse_mode: 'HTML'
                        };
                        _context.next = 39;
                        return _context.t7.sendMessage.call(_context.t7, _context.t8, _context.t9, _context.t10);

                      case 39:
                        if (!(ctx.update && ctx.update.message && ctx.update.message.chat && ctx.update.message.chat.type && ctx.update.message.chat.type !== 'private')) {
                          _context.next = 46;
                          break;
                        }

                        _context.t11 = ctx;
                        _context.next = 43;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 43:
                        _context.t12 = _context.sent;
                        _context.next = 46;
                        return _context.t11.replyWithHTML.call(_context.t11, _context.t12);

                      case 46:
                        _context.next = 48;
                        return _models["default"].activity.create({
                          type: 'deposit_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 48:
                        preActivity = _context.sent;
                        _context.next = 51;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        t.afterCommit(function () {
                          console.log('telegram deposit address request done');
                        });

                      case 54:
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
                          type: 'deposit',
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

                        _logger["default"].error("deposit error: ".concat(err));

                        if (!(err && err.response && err.response.error_code && err.response.error_code === 403)) {
                          _context2.next = 25;
                          break;
                        }

                        _context2.prev = 11;
                        _context2.t1 = ctx;
                        _context2.next = 15;
                        return (0, _telegram.unableToDirectMessageErrorMessage)(ctx, 'Deposit');

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
                        return (0, _telegram.errorMessage)('Deposit');

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

  return function fetchWalletDepositAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchWalletDepositAddress = fetchWalletDepositAddress;