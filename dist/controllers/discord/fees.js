"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFee = exports.fetchFeeSchedule = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var findFee = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, t, groupId, channelId) {
    var fee;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId,
                channelId: channelId
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 2:
            fee = _context.sent;

            if (fee) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return _models["default"].features.findOne({
              where: {
                type: 'local',
                name: name,
                groupId: groupId
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            fee = _context.sent;

          case 7:
            if (fee) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: name
              },
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 10:
            fee = _context.sent;

          case 11:
            return _context.abrupt("return", fee);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function findFee(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.findFee = findFee;

var fetchFeeSchedule = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message, io) {
    var guildId,
        channelId,
        fee,
        activity,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            guildId = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : null;
            channelId = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : null;
            fee = {};
            activity = [];
            _context4.next = 6;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, 'fees');

                      case 2:
                        _yield$userWalletExis = _context2.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context2.next = 9;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 9:
                        _context2.next = 11;
                        return findFee('tip', t, guildId, channelId);

                      case 11:
                        fee.tip = _context2.sent;
                        _context2.next = 14;
                        return findFee('reactdrop', t, guildId, channelId);

                      case 14:
                        fee.reactdrop = _context2.sent;
                        _context2.next = 17;
                        return findFee('trivia', t, guildId, channelId);

                      case 17:
                        fee.trivia = _context2.sent;
                        _context2.next = 20;
                        return findFee('soak', t, guildId, channelId);

                      case 20:
                        fee.soak = _context2.sent;
                        _context2.next = 23;
                        return findFee('rain', t, guildId, channelId);

                      case 23:
                        fee.rain = _context2.sent;
                        _context2.next = 26;
                        return findFee('voicerain', t, guildId, channelId);

                      case 26:
                        fee.voicerain = _context2.sent;
                        _context2.next = 29;
                        return findFee('thunder', t, guildId, channelId);

                      case 29:
                        fee.thunder = _context2.sent;
                        _context2.next = 32;
                        return findFee('thunderstorm', t, guildId, channelId);

                      case 32:
                        fee.thunderstorm = _context2.sent;
                        _context2.next = 35;
                        return findFee('hurricane', t, guildId, channelId);

                      case 35:
                        fee.hurricane = _context2.sent;
                        _context2.next = 38;
                        return findFee('flood', t, guildId, channelId);

                      case 38:
                        fee.flood = _context2.sent;
                        _context2.next = 41;
                        return findFee('sleet', t, guildId, channelId);

                      case 41:
                        fee.sleet = _context2.sent;
                        _context2.next = 44;
                        return findFee('withdraw', t, guildId, channelId);

                      case 44:
                        fee.withdraw = _context2.sent;
                        _context2.next = 47;
                        return _models["default"].activity.create({
                          type: 'fees_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 47:
                        preActivity = _context2.sent;
                        _context2.next = 50;
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

                      case 50:
                        finalActivity = _context2.sent;
                        activity.unshift(finalActivity);
                        _context2.next = 54;
                        return message.reply({
                          embeds: [(0, _discord.DiscordFeeMessage)(message, fee)]
                        });

                      case 54:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _models["default"].error.create({
                          type: 'fees',
                          error: "".concat(err)
                        });

                      case 3:
                        _context3.next = 8;
                        break;

                      case 5:
                        _context3.prev = 5;
                        _context3.t0 = _context3["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context3.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("fees error: ".concat(err));

                        _context3.next = 12;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Fees")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 12:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 5]]);
              }));

              return function (_x8) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 6:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchFeeSchedule(_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchFeeSchedule = fetchFeeSchedule;