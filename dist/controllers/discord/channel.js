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

var updateDiscordChannel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(client, message, group) {
    var channelRecord;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(message);
            console.log('updateDiscordMessage');
            _context2.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var channel;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // const channel = await client.channels.cache.get(message.channelId);
                        channel = message.guild.channels.cache.get(message.channelId);
                        console.log(channel);

                        if (!message.channelId) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 5;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(message.channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 5:
                        channelRecord = _context.sent;

                        if (channelRecord) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 9;
                        return _models["default"].channel.create({
                          channelId: "discord-".concat(message.channelId),
                          lastActive: Date.now(),
                          channelName: channel.name,
                          groupId: group.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 9:
                        channelRecord = _context.sent;

                      case 10:
                        if (!channelRecord) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 13;
                        return channelRecord.update({
                          channelName: channel.name,
                          lastActive: Date.now()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 13:
                        channelRecord = _context.sent;

                      case 14:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 15:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err.message);
            });

          case 4:
            return _context2.abrupt("return", channelRecord);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateDiscordChannel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateDiscordChannel = updateDiscordChannel;