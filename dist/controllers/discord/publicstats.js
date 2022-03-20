"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordPublicStats = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

/* eslint-disable import/prefer-default-export */
var discordPublicStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, io) {
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
                var user, activityA, preActivity, finalActivity;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context.sent;

                        if (user) {
                          _context.next = 11;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].activity.create({
                          type: 'publicstats_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activityA = _context.sent;
                        activity.unshift(activityA);
                        _context.next = 10;
                        return message.channel.send({
                          embeds: [(0, _discord.walletNotFoundMessage)(message, 'Ignore me')]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 10:
                        return _context.abrupt("return");

                      case 11:
                        if (!user.publicStats) {
                          _context.next = 18;
                          break;
                        }

                        _context.next = 14;
                        return user.update({
                          publicStats: false
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 14:
                        _context.next = 16;
                        return message.channel.send({
                          embeds: [(0, _discord.disablePublicStatsMessage)(message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 16:
                        _context.next = 23;
                        break;

                      case 18:
                        if (user.publicStats) {
                          _context.next = 23;
                          break;
                        }

                        _context.next = 21;
                        return user.update({
                          publicStats: true
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 21:
                        _context.next = 23;
                        return message.channel.send({
                          embeds: [(0, _discord.enablePublicStatsMeMessage)(message)]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 23:
                        _context.next = 25;
                        return _models["default"].activity.create({
                          type: 'publicstats_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 25:
                        preActivity = _context.sent;
                        _context.next = 28;
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

                      case 28:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 31:
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
                          type: 'publicStats',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("publicstats error: ".concat(err));

                        message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("PublicStats")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordPublicStats(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordPublicStats = discordPublicStats;