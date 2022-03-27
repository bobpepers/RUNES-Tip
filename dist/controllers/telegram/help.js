"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchHelp = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _telegraf = require("telegraf");

var _sequelize = require("sequelize");

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var settings = (0, _settings["default"])();

var fetchHelp = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, withdraw, activityCreateFinish, activityFinish;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'help');

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
                        return _models["default"].features.findOne({
                          where: {
                            type: 'global',
                            name: 'withdraw'
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        withdraw = _context.sent;
                        _context.t0 = ctx.telegram;
                        _context.t1 = ctx.update.message.from.id;
                        _context.next = 16;
                        return (0, _telegram.helpMessage)(withdraw);

                      case 16:
                        _context.t2 = _context.sent;
                        _context.t3 = _objectSpread({
                          parse_mode: 'HTML'
                        }, _telegraf.Markup.inlineKeyboard([[_telegraf.Markup.button.callback('Balance', 'balance'), _telegraf.Markup.button.callback('Price', 'price')], [_telegraf.Markup.button.callback('Info', 'info'), _telegraf.Markup.button.callback('Deposit', 'deposit')], settings.coin.setting === 'Runebase' ? [_telegraf.Markup.button.callback('Referral', 'referral'), _telegraf.Markup.button.callback('Referral Top 10', 'top')] : []]));
                        _context.next = 20;
                        return _context.t0.sendMessage.call(_context.t0, _context.t1, _context.t2, _context.t3);

                      case 20:
                        if (!(ctx.update.message.chat.type !== 'private')) {
                          _context.next = 27;
                          break;
                        }

                        _context.t4 = ctx;
                        _context.next = 24;
                        return (0, _telegram.warnDirectMessage)(user);

                      case 24:
                        _context.t5 = _context.sent;
                        _context.next = 27;
                        return _context.t4.replyWithHTML.call(_context.t4, _context.t5);

                      case 27:
                        _context.next = 29;
                        return _models["default"].activity.create({
                          type: 'help',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 29:
                        activityCreateFinish = _context.sent;
                        _context.next = 32;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activityCreateFinish.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 32:
                        activityFinish = _context.sent;
                        activity.unshift(activityFinish);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 35:
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
                          type: 'help',
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

                        _logger["default"].error("help error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Help');

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

  return function fetchHelp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchHelp = fetchHelp;