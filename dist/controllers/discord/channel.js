"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDiscordChannel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var updateDiscordChannel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(client, message, group) {
    var channelId, channelRecord;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (message.type && message.type === "GUILD_VOICE") {
              console.log('GUILD_VOICE');
              channelId = message.id;
            } else if (message.guild && message.guild.id && message.channelId) {
              channelId = message.channelId;
            } else if (message.guildId && message.channelId) {
              channelId = message.channelId;
            }

            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var channel;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!channelId) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 3;
                        return message.guild.channels.cache.get(channelId);

                      case 3:
                        channel = _context.sent;
                        _context.next = 6;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 6:
                        channelRecord = _context.sent;

                        if (channelRecord) {
                          _context.next = 11;
                          break;
                        }

                        _context.next = 10;
                        return _models["default"].channel.create({
                          channelId: "discord-".concat(channelId),
                          lastActive: Date.now(),
                          channelName: channel.name,
                          groupId: group.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 10:
                        channelRecord = _context.sent;

                      case 11:
                        if (!channelRecord) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 14;
                        return channelRecord.update({
                          channelName: channel.name,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 14:
                        channelRecord = _context.sent;

                      case 15:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 16:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
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
                          type: 'channel',
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
                        _logger["default"].error("channel error: ".concat(err));

                        console.log(err.message);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            return _context3.abrupt("return", channelRecord);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateDiscordChannel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateDiscordChannel = updateDiscordChannel;