"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rainRunesToUsers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _telegram = require("../../messages/telegram");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var rainRunesToUsers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, rainAmount, bot, runesGroup, io) {
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
                var user, amount, group, usersToRain, updatedBalance, amountPerUser, rainRecord, listOfUsersRained, _iterator, _step, rainee, raineeWallet, raintipRecord, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element;

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
                          _context.next = 10;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'rain_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context.sent;
                        _context.next = 9;
                        return ctx.reply((0, _telegram.userNotFoundMessage)());

                      case 9:
                        return _context.abrupt("return");

                      case 10:
                        if (!(ctx.update.message.chat.id === ctx.update.message.from.id)) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 13;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 13:
                        activity = _context.sent;
                        return _context.abrupt("return");

                      case 15:
                        amount = new _bignumber["default"](rainAmount).times(1e8).toFixed(0).toString();
                        console.log(amount);

                        if (!(Number(amount) < Number(_settings["default"].min.telegram.rain))) {
                          _context.next = 24;
                          break;
                        }

                        _context.next = 20;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 20:
                        activity = _context.sent;
                        _context.next = 23;
                        return ctx.reply((0, _telegram.minimumRainMessage)());

                      case 23:
                        return _context.abrupt("return");

                      case 24:
                        if (!(Number(amount) % 1 !== 0)) {
                          _context.next = 32;
                          break;
                        }

                        console.log(3);
                        _context.next = 28;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 28:
                        activity = _context.sent;
                        _context.next = 31;
                        return ctx.reply((0, _telegram.invalidAmountMessage)());

                      case 31:
                        return _context.abrupt("return");

                      case 32:
                        if (!(user.wallet.available < Number(amount))) {
                          _context.next = 39;
                          break;
                        }

                        _context.next = 35;
                        return _models["default"].activity.create({
                          type: 'rain_i',
                          spenderId: user.id // amount: Number(amount), // fix this? fails with big numbers

                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        activity = _context.sent;
                        _context.next = 38;
                        return ctx.reply((0, _telegram.insufficientBalanceMessage)());

                      case 38:
                        return _context.abrupt("return");

                      case 39:
                        if (!(user.wallet.available >= amount)) {
                          _context.next = 128;
                          break;
                        }

                        _context.next = 42;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "telegram-".concat(ctx.update.message.chat.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 42:
                        group = _context.sent;

                        if (group) {
                          _context.next = 50;
                          break;
                        }

                        _context.next = 46;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        activity = _context.sent;
                        _context.next = 49;
                        return ctx.reply((0, _telegram.groupNotFoundMessage)());

                      case 49:
                        return _context.abrupt("return");

                      case 50:
                        _context.next = 52;
                        return _models["default"].user.findAll({
                          where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                            user_id: (0, _defineProperty2["default"])({}, _sequelize.Op.not, "telegram-".concat(ctx.update.message.from.id))
                          }]),
                          include: [{
                            model: _models["default"].active,
                            as: 'active',
                            // required: false,
                            where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                              lastSeen: (0, _defineProperty2["default"])({}, _sequelize.Op.gte, new Date(Date.now() - 3 * 60 * 60 * 1000))
                            }, {
                              groupId: group.id
                            }])
                          }, {
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 52:
                        usersToRain = _context.sent;

                        if (!(usersToRain.length < 2)) {
                          _context.next = 60;
                          break;
                        }

                        _context.next = 56;
                        return _models["default"].activity.create({
                          type: 'rain_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 56:
                        activity = _context.sent;
                        _context.next = 59;
                        return ctx.reply((0, _telegram.notEnoughActiveUsersMessage)());

                      case 59:
                        return _context.abrupt("return");

                      case 60:
                        if (!(usersToRain.length >= 2)) {
                          _context.next = 128;
                          break;
                        }

                        _context.next = 63;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 63:
                        updatedBalance = _context.sent;
                        amountPerUser = (amount / usersToRain.length).toFixed(0);
                        _context.next = 67;
                        return _models["default"].rain.create({
                          amount: amount,
                          userCount: usersToRain.length,
                          userId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 67:
                        rainRecord = _context.sent;
                        _context.next = 70;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'rain_s',
                          spenderId: user.id,
                          rainId: rainRecord.id,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 70:
                        activity = _context.sent;
                        _context.next = 73;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
                          },
                          include: [{
                            model: _models["default"].rain,
                            as: 'rain'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 73:
                        activity = _context.sent;
                        listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(usersToRain);
                        _context.prev = 76;

                        _iterator.s();

                      case 78:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 98;
                          break;
                        }

                        rainee = _step.value;
                        _context.next = 82;
                        return rainee.wallet.update({
                          available: rainee.wallet.available + Number(amountPerUser)
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 82:
                        raineeWallet = _context.sent;
                        _context.next = 85;
                        return _models["default"].raintip.create({
                          amount: amountPerUser,
                          userId: rainee.id,
                          rainId: rainRecord.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 85:
                        raintipRecord = _context.sent;
                        listOfUsersRained.push("@".concat(rainee.username));
                        tipActivity = void 0;
                        _context.next = 90;
                        return _models["default"].activity.create({
                          amount: Number(amountPerUser),
                          type: 'raintip_s',
                          spenderId: user.id,
                          earnerId: rainee.id,
                          rainId: rainRecord.id,
                          raintipId: raintipRecord.id,
                          earner_balance: raineeWallet.available + raineeWallet.locked,
                          spender_balance: updatedBalance.available + updatedBalance.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 90:
                        tipActivity = _context.sent;
                        _context.next = 93;
                        return _models["default"].activity.findOne({
                          where: {
                            id: tipActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }, {
                            model: _models["default"].rain,
                            as: 'rain'
                          }, {
                            model: _models["default"].raintip,
                            as: 'raintip'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 93:
                        tipActivity = _context.sent;
                        console.log(tipActivity);
                        io.to('admin').emit('updateActivity', {
                          activity: tipActivity
                        });

                      case 96:
                        _context.next = 78;
                        break;

                      case 98:
                        _context.next = 103;
                        break;

                      case 100:
                        _context.prev = 100;
                        _context.t0 = _context["catch"](76);

                        _iterator.e(_context.t0);

                      case 103:
                        _context.prev = 103;

                        _iterator.f();

                        return _context.finish(103);

                      case 106:
                        _context.next = 108;
                        return ctx.reply((0, _telegram.rainSuccessMessage)(amount, usersToRain, amountPerUser));

                      case 108:
                        newStringListUsers = listOfUsersRained.join(", ");
                        cutStringListUsers = newStringListUsers.match(/.{1,4000}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                        _context.prev = 111;

                        _iterator2.s();

                      case 113:
                        if ((_step2 = _iterator2.n()).done) {
                          _context.next = 119;
                          break;
                        }

                        element = _step2.value;
                        _context.next = 117;
                        return ctx.reply(element);

                      case 117:
                        _context.next = 113;
                        break;

                      case 119:
                        _context.next = 124;
                        break;

                      case 121:
                        _context.prev = 121;
                        _context.t1 = _context["catch"](111);

                        _iterator2.e(_context.t1);

                      case 124:
                        _context.prev = 124;

                        _iterator2.f();

                        return _context.finish(124);

                      case 127:
                        _logger["default"].info("Success Rain Requested by: ".concat(ctx.update.message.from.id, "-").concat(ctx.update.message.from.username, " for ").concat(amount / 1e8)); // cutStringListUsers.forEach((element) => ctx.reply(element));


                      case 128:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 129:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[76, 100, 103, 106], [111, 121, 124, 127]]);
              }));

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply((0, _telegram.generalErrorMessage)());
            });

          case 2:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function rainRunesToUsers(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.rainRunesToUsers = rainRunesToUsers;