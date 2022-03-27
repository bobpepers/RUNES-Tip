"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTipFunction = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _events = require("telegram/events");

var _telegram = require("../../../messages/telegram");

// const { NewMessage } = require('telegram/events');
var executeTipFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(tipFunction, queue, amount, telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting) {
    var operationName, userBeingTipped, chatId, isRunning, listenerFunction, myTimeout;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(ctx);
            console.log('telegraf ctx');

            if (ctx && ctx.update && ctx.update.message && ctx.update.message.chat) {
              chatId = ctx.update.message.chat.id;
            } else if (ctx && ctx.message && ctx.message.chat) {
              chatId = ctx.message.chat.id;
            }

            console.log(chatId);

            if (ctx && ctx.update && ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.length === 1) {
              operationName = 'tip';
              userBeingTipped = filteredMessage[1];
            } else if (ctx && ctx.update && ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.length > 1) {
              operationName = 'tip';
              userBeingTipped = 'multiple users';
            } else {
              operationName = filteredMessage[1];
            }

            if (!(amount && amount.toLowerCase() === 'all')) {
              _context5.next = 22;
              break;
            }

            _context5.prev = 6;
            _context5.next = 9;
            return ctx.replyWithHTML((0, _telegram.confirmAllAmoutMessage)(ctx, operationName, userBeingTipped));

          case 9:
            _context5.next = 14;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](6);
            console.log(_context5.t0);

          case 14:
            isRunning = true;

            listenerFunction = /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(event) {
                var tempBody;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        console.log(event);
                        console.log(ctx);
                        console.log('event');
                        tempBody = event.message.message;

                        if (!(event.message && event.message.fromId && ctx.update.message.from.id === Number(event.message.fromId.userId) || chatId === ctx.update.message.from.id)) {
                          _context2.next = 25;
                          break;
                        }

                        if (!(tempBody.toUpperCase() === 'YES' || tempBody.toUpperCase() === 'Y')) {
                          _context2.next = 13;
                          break;
                        }

                        isRunning = false;
                        _context2.next = 9;
                        return telegramApiClient.removeEventHandler(listenerFunction, new _events.NewMessage({
                          chats: [chatId]
                        }));

                      case 9:
                        _context2.next = 11;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var task;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return tipFunction(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue);

                                case 2:
                                  task = _context.sent;

                                case 3:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 11:
                        _context2.next = 25;
                        break;

                      case 13:
                        if (!(tempBody.toUpperCase() === 'NO' || tempBody.toUpperCase() === 'N')) {
                          _context2.next = 25;
                          break;
                        }

                        isRunning = false;
                        _context2.next = 17;
                        return telegramApiClient.removeEventHandler(listenerFunction, new _events.NewMessage({
                          chats: [chatId]
                        }));

                      case 17:
                        _context2.prev = 17;
                        _context2.next = 20;
                        return ctx.replyWithHTML((0, _telegram.canceledAllAmoutMessage)(ctx, operationName, userBeingTipped));

                      case 20:
                        _context2.next = 25;
                        break;

                      case 22:
                        _context2.prev = 22;
                        _context2.t0 = _context2["catch"](17);
                        console.log(_context2.t0);

                      case 25:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[17, 22]]);
              }));

              return function listenerFunction(_x12) {
                return _ref2.apply(this, arguments);
              };
            }();

            _context5.next = 18;
            return telegramApiClient.addEventHandler(listenerFunction, new _events.NewMessage({
              chats: [chatId]
            }));

          case 18:
            console.log('after event handler');
            myTimeout = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!isRunning) {
                        _context3.next = 11;
                        break;
                      }

                      _context3.next = 3;
                      return telegramApiClient.removeEventHandler(listenerFunction, new _events.NewMessage({
                        chats: [chatId]
                      }));

                    case 3:
                      _context3.prev = 3;
                      _context3.next = 6;
                      return ctx.replyWithHTML((0, _telegram.timeOutAllAmoutMessage)(ctx, operationName, userBeingTipped));

                    case 6:
                      _context3.next = 11;
                      break;

                    case 8:
                      _context3.prev = 8;
                      _context3.t0 = _context3["catch"](3);
                      console.log(_context3.t0);

                    case 11:
                      clearTimeout(myTimeout);

                    case 12:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, null, [[3, 8]]);
            })), 30000);
            _context5.next = 24;
            break;

          case 22:
            _context5.next = 24;
            return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
              var task;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return tipFunction(telegramClient, telegramApiClient, ctx, filteredMessage, io, groupTask, setting, faucetSetting, queue);

                    case 2:
                      task = _context4.sent;

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })));

          case 24:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 11]]);
  }));

  return function executeTipFunction(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref.apply(this, arguments);
  };
}();

exports.executeTipFunction = executeTipFunction;