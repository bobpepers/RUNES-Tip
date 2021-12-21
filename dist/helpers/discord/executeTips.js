"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTipFunction = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

var _discord = require("../../messages/discord");

var executeTipFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(tipFunction, queue, amount, discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting) {
    var task;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(amount && amount.toLowerCase() === 'all')) {
              _context3.next = 4;
              break;
            }

            message.channel.send({
              embeds: [(0, _discord.confirmAllAmoutMessageDiscord)(message, filteredMessageDiscord[1])]
            }).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              var msgFilter;
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      msgFilter = function msgFilter(m) {
                        var filtered = m.author.id === message.author.id && (m.content.toUpperCase() === 'YES' || m.content.toUpperCase() === 'Y' || m.content.toUpperCase() === 'NO' || m.content.toUpperCase() === 'N');
                        return filtered;
                      };

                      message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 30000,
                        errors: ['time']
                      }).then( /*#__PURE__*/function () {
                        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(collected) {
                          var collectedMessage, task;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  collectedMessage = collected.first();

                                  if (!(collectedMessage.content.toUpperCase() === 'YES' || collectedMessage.content.toUpperCase() === 'Y')) {
                                    _context.next = 9;
                                    break;
                                  }

                                  _context.next = 4;
                                  return tipFunction(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting, queue);

                                case 4:
                                  task = _context.sent;
                                  _context.next = 7;
                                  return queue.add(function () {
                                    return task;
                                  });

                                case 7:
                                  _context.next = 10;
                                  break;

                                case 9:
                                  if (collectedMessage.content.toUpperCase() === 'NO' || collectedMessage.content.toUpperCase() === 'N') {
                                    message.channel.send({
                                      embeds: [(0, _discord.canceledAllAmoutMessageDiscord)(message, filteredMessageDiscord[1])]
                                    });
                                  }

                                case 10:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                        return function (_x12) {
                          return _ref3.apply(this, arguments);
                        };
                      }())["catch"](function (collected) {
                        message.channel.send({
                          embeds: [(0, _discord.timeOutAllAmoutMessageDiscord)(message, filteredMessageDiscord[1])]
                        });
                      });

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })));
            _context3.next = 9;
            break;

          case 4:
            _context3.next = 6;
            return tipFunction(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting, queue);

          case 6:
            task = _context3.sent;
            _context3.next = 9;
            return queue.add(function () {
              return task;
            });

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function executeTipFunction(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref.apply(this, arguments);
  };
}();

exports.executeTipFunction = executeTipFunction;