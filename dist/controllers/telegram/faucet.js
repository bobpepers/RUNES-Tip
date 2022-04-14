"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramFaucetClaim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _telegraf = require("telegraf");

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _userWalletExist = require("../../helpers/client/telegram/userWalletExist");

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var settings = (0, _settings["default"])();

var telegramFaucetClaim = /*#__PURE__*/function () {
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
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, faucet, activityNotFound, fActivity, lastFaucetTip, dateFuture, dateNow, distance, activityTpre, activityT, amountToTip, faucetTip, updateFaucet, updateWallet, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'faucettip');

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
                        return _models["default"].faucet.findOne({
                          order: [['id', 'DESC']],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 11:
                        faucet = _context.sent;

                        if (faucet) {
                          _context.next = 20;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].activity.create({
                          type: 'faucettip_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 15:
                        activityNotFound = _context.sent;
                        activity.unshift(activityNotFound);
                        _context.next = 19;
                        return ctx.reply('Faucet not found');

                      case 19:
                        return _context.abrupt("return");

                      case 20:
                        if (!(Number(faucet.amount) < 10000)) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 23;
                        return _models["default"].activity.create({
                          type: 'faucettip_i'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 23:
                        fActivity = _context.sent;
                        activity.push(fActivity);
                        _context.next = 27;
                        return ctx.reply('Faucet is dry');

                      case 27:
                        return _context.abrupt("return");

                      case 28:
                        _context.next = 30;
                        return _models["default"].faucettip.findOne({
                          where: {
                            userId: user.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t,
                          order: [['id', 'DESC']]
                        });

                      case 30:
                        lastFaucetTip = _context.sent;
                        dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + 4 * 60 * 60 * 1000;
                        dateNow = new Date().getTime();
                        distance = dateFuture && dateFuture - dateNow;

                        if (!(distance && distance > 0)) {
                          _context.next = 50;
                          break;
                        }

                        _context.next = 37;
                        return _models["default"].activity.create({
                          type: 'faucettip_t',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        activityTpre = _context.sent;
                        _context.next = 40;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activityTpre.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        activityT = _context.sent;
                        activity.push(activityT);
                        _context.t0 = ctx;
                        _context.next = 45;
                        return (0, _telegram.claimTooFastFaucetMessage)(user, distance);

                      case 45:
                        _context.t1 = _context.sent;
                        _context.t2 = _objectSpread({}, _telegraf.Markup.inlineKeyboard([[_telegraf.Markup.button.callback('Claim Faucet', 'faucet')]]));
                        _context.next = 49;
                        return _context.t0.replyWithHTML.call(_context.t0, _context.t1, _context.t2);

                      case 49:
                        return _context.abrupt("return");

                      case 50:
                        amountToTip = Number((faucet.amount / 100 * (settings.faucet / 1e2)).toFixed(0));
                        _context.next = 53;
                        return _models["default"].faucettip.create({
                          amount: amountToTip,
                          faucetId: faucet.id,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 53:
                        faucetTip = _context.sent;
                        _context.next = 56;
                        return faucet.update({
                          amount: Number(faucet.amount) - Number(amountToTip),
                          claims: faucet.claims + 1,
                          totalAmountClaimed: faucet.totalAmountClaimed + Number(amountToTip)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        updateFaucet = _context.sent;
                        _context.next = 59;
                        return user.wallet.update({
                          available: Number(user.wallet.available) + amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 59:
                        updateWallet = _context.sent;
                        _context.next = 62;
                        return _models["default"].activity.create({
                          type: 'faucettip_s',
                          earnerId: user.id,
                          faucettipId: faucetTip.id,
                          amount: Number(amountToTip),
                          spender_balance: updateFaucet.amount,
                          earner_balance: updateWallet.available + updateWallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 62:
                        preActivity = _context.sent;
                        _context.next = 65;
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

                      case 65:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        _context.t3 = ctx;
                        _context.next = 70;
                        return (0, _telegram.faucetClaimedMessage)(faucetTip.id, user, amountToTip);

                      case 70:
                        _context.t4 = _context.sent;
                        _context.t5 = _objectSpread({}, _telegraf.Markup.inlineKeyboard([[_telegraf.Markup.button.callback('Claim Faucet', 'faucet')]]));
                        _context.next = 74;
                        return _context.t3.replyWithHTML.call(_context.t3, _context.t4, _context.t5);

                      case 74:
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
                          type: 'faucet',
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

                        _logger["default"].error("Faucet error: ".concat(err));

                        _context2.prev = 10;
                        _context2.t1 = ctx;
                        _context2.next = 14;
                        return (0, _telegram.errorMessage)('Faucet');

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

  return function telegramFaucetClaim(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramFaucetClaim = telegramFaucetClaim;