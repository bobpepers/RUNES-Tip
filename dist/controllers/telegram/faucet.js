"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramFaucetClaim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _telegram = require("../../messages/telegram");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _userWalletExist = require("../../helpers/telegram/userWalletExist");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var telegramFaucetClaim = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, io) {
    var user, userActivity, activity;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            activity = [];
            _context2.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, faucet, fActivity, lastFaucetTip, username, dateFuture, dateNow, distance, activityT, amountToTip, faucetTip, updateFaucet, updateWallet, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(ctx, t, 'rain');

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
                          _context.next = 19;
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
                        activity = _context.sent;
                        _context.next = 18;
                        return ctx.reply('Faucet not found');

                      case 18:
                        return _context.abrupt("return");

                      case 19:
                        if (!(Number(faucet.amount) < 10000)) {
                          _context.next = 27;
                          break;
                        }

                        _context.next = 22;
                        return _models["default"].activity.create({
                          type: 'faucettip_i'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 22:
                        fActivity = _context.sent;
                        activity.push(fActivity);
                        _context.next = 26;
                        return ctx.reply('Faucet is dry');

                      case 26:
                        return _context.abrupt("return");

                      case 27:
                        _context.next = 29;
                        return _models["default"].faucettip.findOne({
                          where: {
                            userId: user.id
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t,
                          order: [['id', 'DESC']]
                        });

                      case 29:
                        lastFaucetTip = _context.sent;
                        username = "".concat(user.username);
                        dateFuture = lastFaucetTip && lastFaucetTip.createdAt.getTime() + 4 * 60 * 60 * 1000;
                        dateNow = new Date().getTime();
                        distance = dateFuture && dateFuture - dateNow;
                        console.log(distance);

                        if (!(distance && distance > 0)) {
                          _context.next = 43;
                          break;
                        }

                        _context.next = 38;
                        return _models["default"].activity.create({
                          type: 'faucettip_t'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 38:
                        activityT = _context.sent;
                        activity.push(activityT);
                        _context.next = 42;
                        return ctx.reply((0, _telegram.claimTooFastFaucetMessage)(username, distance));

                      case 42:
                        return _context.abrupt("return");

                      case 43:
                        amountToTip = Number((faucet.amount / 100 * (settings.faucet / 1e2)).toFixed(0));
                        _context.next = 46;
                        return _models["default"].faucettip.create({
                          amount: amountToTip,
                          faucetId: faucet.id,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        faucetTip = _context.sent;
                        _context.next = 49;
                        return faucet.update({
                          amount: Number(faucet.amount) - Number(amountToTip),
                          claims: faucet.claims + 1,
                          totalAmountClaimed: faucet.totalAmountClaimed + Number(amountToTip)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        updateFaucet = _context.sent;
                        _context.next = 52;
                        return user.wallet.update({
                          available: Number(user.wallet.available) + amountToTip
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 52:
                        updateWallet = _context.sent;
                        _context.next = 55;
                        return _models["default"].activity.create({
                          type: 'faucettip_s',
                          earnerId: user.id,
                          faucettipId: faucetTip.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 55:
                        preActivity = _context.sent;
                        _context.next = 58;
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

                      case 58:
                        finalActivity = _context.sent;
                        console.log(finalActivity);
                        activity.unshift(finalActivity);
                        _context.next = 63;
                        return ctx.reply((0, _telegram.faucetClaimedMessage)(username, amountToTip));

                      case 63:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              ctx.reply('something went wrong');
            });

          case 3:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });
            return _context2.abrupt("return", true);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function telegramFaucetClaim(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramFaucetClaim = telegramFaucetClaim;