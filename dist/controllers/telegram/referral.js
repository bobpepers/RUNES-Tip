"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchReferralTopTen = exports.fetchReferralCount = exports.createReferral = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var referralRunesReward = 20 * 1e8; // eslint-disable-next-line import/prefer-default-export

var createReferral = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx, bot, runesGroup) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _iterator, _step, newMember, user, myReferral, addNewReferral, updatedUser, addReward, updatedUserWallet;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // console.log(ctx);
                        // eslint-disable-next-line no-restricted-syntax
                        _iterator = _createForOfIteratorHelper(ctx.message.new_chat_members);
                        _context.prev = 1;

                        _iterator.s();

                      case 3:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 35;
                          break;
                        }

                        newMember = _step.value;
                        _context.next = 7;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(ctx.message.from.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 7:
                        user = _context.sent;

                        if (!user) {
                          _context.next = 33;
                          break;
                        }

                        console.log('newMember');
                        console.log(newMember);

                        if (!(newMember.is_bot === false)) {
                          _context.next = 33;
                          break;
                        }

                        _context.next = 14;
                        return _models["default"].referral.findOne({
                          where: {
                            user_id: "telegram-".concat(newMember.id)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        myReferral = _context.sent;

                        if (myReferral) {
                          _context.next = 33;
                          break;
                        }

                        _context.next = 18;
                        return _models["default"].referral.create({
                          userId: user.id,
                          user_id: "telegram-".concat(newMember.id)
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 18:
                        addNewReferral = _context.sent;
                        _context.next = 21;
                        return user.update({
                          referral_count: user.referral_count + 1
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 21:
                        updatedUser = _context.sent;

                        if (!(updatedUser.referral_count % 10 === 0)) {
                          _context.next = 33;
                          break;
                        }

                        _context.next = 25;
                        return _models["default"].referralReward.create({
                          userId: user.id,
                          count: updatedUser.referral_count,
                          amount: referralRunesReward
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 25:
                        addReward = _context.sent;
                        _context.next = 28;
                        return updatedUser.wallet.update({
                          available: updatedUser.wallet.available + referralRunesReward
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 28:
                        updatedUserWallet = _context.sent;
                        console.log(updatedUser);
                        console.log(updatedUserWallet);
                        _context.next = 33;
                        return bot.telegram.sendMessage(runesGroup, "Congratulations ".concat(user.username, ", you added ").concat(updatedUser.referral_count, " users in total to Runebase Telegram group,\nwe added ").concat(referralRunesReward / 1e8, " ").concat(_settings["default"].coin.ticker, " to your wallet as a reward."));

                      case 33:
                        _context.next = 3;
                        break;

                      case 35:
                        _context.next = 40;
                        break;

                      case 37:
                        _context.prev = 37;
                        _context.t0 = _context["catch"](1);

                        _iterator.e(_context.t0);

                      case 40:
                        _context.prev = 40;

                        _iterator.f();

                        return _context.finish(40);

                      case 43:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 44:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[1, 37, 40, 43]]);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply('Something went wrong with adding referral');
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createReferral(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.createReferral = createReferral;

var fetchReferralCount = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx, telegramUserId, telegramUserName) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                var user;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        console.log(ctx);
                        _context3.next = 3;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "telegram-".concat(telegramUserId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 3:
                        user = _context3.sent;

                        if (!user) {
                          ctx.reply("User not found");
                        }

                        if (user) {
                          ctx.reply("".concat(user.username, "'s referral count: ").concat(user.referral_count));
                        }

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 7:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x8) {
                return _ref4.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply('Something went wrong with fetching referral');
            });

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchReferralCount(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetchReferralCount = fetchReferralCount;

var fetchReferralTopTen = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ctx) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                var users, replyString;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        console.log(ctx);
                        _context5.next = 3;
                        return _models["default"].user.findAll({
                          order: [// Will escape title and validate DESC against a list of valid direction parameters
                          ['referral_count', 'DESC']],
                          limit: 10,
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 3:
                        users = _context5.sent;

                        if (!users) {
                          ctx.reply("Users not found");
                        }

                        if (users) {
                          replyString = '<b><u>Referral Top 10</u></b>\n';
                          replyString += users.map(function (a, index) {
                            return "".concat(index + 1, ". @").concat(a.username, ": ").concat(a.referral_count);
                          }).join('\n');
                          ctx.replyWithHTML(replyString); // ctx.reply(`${user.username}'s referral count: ${user.referral_count}`);
                        }

                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 7:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x10) {
                return _ref6.apply(this, arguments);
              };
            }())["catch"](function (err) {
              ctx.reply('Something went wrong with fetching referral');
            });

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetchReferralTopTen(_x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.fetchReferralTopTen = fetchReferralTopTen;