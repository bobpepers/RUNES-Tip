"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTipFunction = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("../../messages/discord");

// import BigNumber from "bignumber.js";
// import db from '../../models';
var executeTipFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(tipFunction, queue, amount, discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting) {
    var operationName, userBeingTipped;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (filteredMessageDiscord[1].startsWith('<@') && !filteredMessageDiscord[2].startsWith('<@')) {
              operationName = 'tip';
              userBeingTipped = filteredMessageDiscord[1];
            } else if (filteredMessageDiscord[1].startsWith('<@') && filteredMessageDiscord[2].startsWith('<@')) {
              operationName = 'tip';
              userBeingTipped = 'multiple users';
            } else {
              operationName = filteredMessageDiscord[1];
            }

            if (!(amount && amount.toLowerCase() === 'all')) {
              _context5.next = 5;
              break;
            }

            message.channel.send({
              embeds: [(0, _discord.confirmAllAmoutMessageDiscord)(message, operationName, userBeingTipped)]
            }).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              var msgFilter;
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
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
                        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(collected) {
                          var collectedMessage;
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  collectedMessage = collected.first();

                                  if (!(collectedMessage.content.toUpperCase() === 'YES' || collectedMessage.content.toUpperCase() === 'Y')) {
                                    _context2.next = 6;
                                    break;
                                  }

                                  _context2.next = 4;
                                  return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                                    var task;
                                    return _regenerator["default"].wrap(function _callee$(_context) {
                                      while (1) {
                                        switch (_context.prev = _context.next) {
                                          case 0:
                                            _context.next = 2;
                                            return tipFunction(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting, queue);

                                          case 2:
                                            task = _context.sent;

                                          case 3:
                                          case "end":
                                            return _context.stop();
                                        }
                                      }
                                    }, _callee);
                                  })));

                                case 4:
                                  _context2.next = 7;
                                  break;

                                case 6:
                                  if (collectedMessage.content.toUpperCase() === 'NO' || collectedMessage.content.toUpperCase() === 'N') {
                                    message.channel.send({
                                      embeds: [(0, _discord.canceledAllAmoutMessageDiscord)(message, operationName, userBeingTipped)]
                                    });
                                  }

                                case 7:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        }));

                        return function (_x12) {
                          return _ref3.apply(this, arguments);
                        };
                      }())["catch"](function (collected) {
                        message.channel.send({
                          embeds: [(0, _discord.timeOutAllAmoutMessageDiscord)(message, operationName, userBeingTipped)]
                        });
                      });

                    case 2:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })));
            _context5.next = 7;
            break;

          case 5:
            _context5.next = 7;
            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
              var task;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return tipFunction(discordClient, message, filteredMessageDiscord, io, groupTask, channelTask, setting, faucetSetting, queue);

                    case 2:
                      task = _context4.sent;

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function executeTipFunction(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref.apply(this, arguments);
  };
}();

exports.executeTipFunction = executeTipFunction;