"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _telegram = require("telegram");

var _sessions = require("telegram/sessions");

var _help = require("../controllers/telegram/help");

var _info = require("../controllers/telegram/info");

var _faucet = require("../controllers/telegram/faucet");

var _balance = require("../controllers/telegram/balance");

var _deposit = require("../controllers/telegram/deposit");

var _withdraw = require("../controllers/telegram/withdraw");

var _tip = require("../controllers/telegram/tip");

var _rain = require("../controllers/telegram/rain");

var _flood = require("../controllers/telegram/flood");

var _sleet = require("../controllers/telegram/sleet");

var _price = require("../controllers/telegram/price");

var _executeTips = require("../helpers/client/telegram/executeTips");

var _disallowDirectMessage = require("../helpers/client/telegram/disallowDirectMessage");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _rateLimit = require("../helpers/rateLimit");

var _group = require("../controllers/telegram/group");

var _user = require("../controllers/telegram/user");

var _referral = require("../controllers/telegram/referral");

var _settings = require("../controllers/telegram/settings");

var _telegram2 = require("../messages/telegram");

var _settings2 = _interopRequireDefault(require("../config/settings"));

var settings = (0, _settings2["default"])();
(0, _dotenv.config)();
var storeSession = new _sessions.StoreSession("telegram_session");
var telegramApiClient = new _telegram.TelegramClient(storeSession, Number(process.env.TELEGRAM_API_ID), process.env.TELEGRAM_API_HASH, {
  connectionRetries: 5
});
var runesGroup = process.env.TELEGRAM_RUNES_GROUP;

var telegramRouter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee44(telegramClient, queue, io, settings) {
    var priceCallBack, faucetCallBack, balanceCallBack, infoCallBack, depositCallBack;
    return _regenerator["default"].wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            _context44.next = 2;
            return telegramApiClient.start({
              botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
              onError: function onError(err) {
                return console.log(err);
              }
            });

          case 2:
            _context44.next = 4;
            return telegramApiClient.session.save();

          case 4:
            _context44.next = 6;
            return telegramApiClient.connect();

          case 6:
            telegramClient.command('help', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context3.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context3.next = 5;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 5:
                        _context3.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context.sent;
                                  _context.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context.sent;

                                case 8:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 7:
                        _context3.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 9:
                        limited = _context3.sent;

                        if (!limited) {
                          _context3.next = 12;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context3.next = 26;
                          break;
                        }

                        _context3.prev = 13;
                        _context3.t0 = ctx;
                        _context3.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context3.t1 = _context3.sent;
                        _context3.next = 20;
                        return _context3.t0.replyWithHTML.call(_context3.t0, _context3.t1);

                      case 20:
                        _context3.next = 25;
                        break;

                      case 22:
                        _context3.prev = 22;
                        _context3.t2 = _context3["catch"](13);
                        console.log(_context3.t2);

                      case 25:
                        return _context3.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context3.next = 40;
                          break;
                        }

                        _context3.prev = 27;
                        _context3.t3 = ctx;
                        _context3.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context3.t4 = _context3.sent;
                        _context3.next = 34;
                        return _context3.t3.replyWithHTML.call(_context3.t3, _context3.t4);

                      case 34:
                        _context3.next = 39;
                        break;

                      case 36:
                        _context3.prev = 36;
                        _context3.t5 = _context3["catch"](27);
                        console.log(_context3.t5);

                      case 39:
                        return _context3.abrupt("return");

                      case 40:
                        _context3.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                          var task;
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context2.sent;

                                case 3:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        })));

                      case 42:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[13, 22], [27, 36]]);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }());

            priceCallBack = /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context6.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context6.next = 5;
                          break;
                        }

                        return _context6.abrupt("return");

                      case 5:
                        _context6.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  _context4.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context4.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context4.sent;
                                  _context4.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context4.sent;

                                case 8:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        })));

                      case 7:
                        _context6.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Price');

                      case 9:
                        limited = _context6.sent;

                        if (!limited) {
                          _context6.next = 12;
                          break;
                        }

                        return _context6.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context6.next = 26;
                          break;
                        }

                        _context6.prev = 13;
                        _context6.t0 = ctx;
                        _context6.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context6.t1 = _context6.sent;
                        _context6.next = 20;
                        return _context6.t0.replyWithHTML.call(_context6.t0, _context6.t1);

                      case 20:
                        _context6.next = 25;
                        break;

                      case 22:
                        _context6.prev = 22;
                        _context6.t2 = _context6["catch"](13);
                        console.log(_context6.t2);

                      case 25:
                        return _context6.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context6.next = 40;
                          break;
                        }

                        _context6.prev = 27;
                        _context6.t3 = ctx;
                        _context6.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context6.t4 = _context6.sent;
                        _context6.next = 34;
                        return _context6.t3.replyWithHTML.call(_context6.t3, _context6.t4);

                      case 34:
                        _context6.next = 39;
                        break;

                      case 36:
                        _context6.prev = 36;
                        _context6.t5 = _context6["catch"](27);
                        console.log(_context6.t5);

                      case 39:
                        return _context6.abrupt("return");

                      case 40:
                        _context6.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                          var task;
                          return _regenerator["default"].wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  _context5.next = 2;
                                  return (0, _price.telegramPrice)(ctx, io);

                                case 2:
                                  task = _context5.sent;

                                case 3:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5);
                        })));

                      case 42:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[13, 22], [27, 36]]);
              }));

              return function priceCallBack(_x6) {
                return _ref5.apply(this, arguments);
              };
            }();

            faucetCallBack = /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context9.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context9.next = 5;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 5:
                        _context9.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                          return _regenerator["default"].wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  _context7.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context7.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context7.sent;
                                  _context7.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context7.sent;

                                case 8:
                                case "end":
                                  return _context7.stop();
                              }
                            }
                          }, _callee7);
                        })));

                      case 7:
                        _context9.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Faucet');

                      case 9:
                        limited = _context9.sent;

                        if (!limited) {
                          _context9.next = 12;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context9.next = 26;
                          break;
                        }

                        _context9.prev = 13;
                        _context9.t0 = ctx;
                        _context9.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context9.t1 = _context9.sent;
                        _context9.next = 20;
                        return _context9.t0.replyWithHTML.call(_context9.t0, _context9.t1);

                      case 20:
                        _context9.next = 25;
                        break;

                      case 22:
                        _context9.prev = 22;
                        _context9.t2 = _context9["catch"](13);
                        console.log(_context9.t2);

                      case 25:
                        return _context9.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context9.next = 40;
                          break;
                        }

                        _context9.prev = 27;
                        _context9.t3 = ctx;
                        _context9.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context9.t4 = _context9.sent;
                        _context9.next = 34;
                        return _context9.t3.replyWithHTML.call(_context9.t3, _context9.t4);

                      case 34:
                        _context9.next = 39;
                        break;

                      case 36:
                        _context9.prev = 36;
                        _context9.t5 = _context9["catch"](27);
                        console.log(_context9.t5);

                      case 39:
                        return _context9.abrupt("return");

                      case 40:
                        _context9.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                          var task;
                          return _regenerator["default"].wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  _context8.next = 2;
                                  return (0, _faucet.telegramFaucetClaim)(ctx, io);

                                case 2:
                                  task = _context8.sent;

                                case 3:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8);
                        })));

                      case 42:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, null, [[13, 22], [27, 36]]);
              }));

              return function faucetCallBack(_x7) {
                return _ref8.apply(this, arguments);
              };
            }();

            balanceCallBack = /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context12.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context12.next = 5;
                          break;
                        }

                        return _context12.abrupt("return");

                      case 5:
                        _context12.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                          return _regenerator["default"].wrap(function _callee10$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  _context10.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context10.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context10.sent;
                                  _context10.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context10.sent;

                                case 8:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee10);
                        })));

                      case 7:
                        _context12.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Balance');

                      case 9:
                        limited = _context12.sent;

                        if (!limited) {
                          _context12.next = 12;
                          break;
                        }

                        return _context12.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context12.next = 26;
                          break;
                        }

                        _context12.prev = 13;
                        _context12.t0 = ctx;
                        _context12.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context12.t1 = _context12.sent;
                        _context12.next = 20;
                        return _context12.t0.replyWithHTML.call(_context12.t0, _context12.t1);

                      case 20:
                        _context12.next = 25;
                        break;

                      case 22:
                        _context12.prev = 22;
                        _context12.t2 = _context12["catch"](13);
                        console.log(_context12.t2);

                      case 25:
                        return _context12.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context12.next = 40;
                          break;
                        }

                        _context12.prev = 27;
                        _context12.t3 = ctx;
                        _context12.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context12.t4 = _context12.sent;
                        _context12.next = 34;
                        return _context12.t3.replyWithHTML.call(_context12.t3, _context12.t4);

                      case 34:
                        _context12.next = 39;
                        break;

                      case 36:
                        _context12.prev = 36;
                        _context12.t5 = _context12["catch"](27);
                        console.log(_context12.t5);

                      case 39:
                        return _context12.abrupt("return");

                      case 40:
                        _context12.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                          var task;
                          return _regenerator["default"].wrap(function _callee11$(_context11) {
                            while (1) {
                              switch (_context11.prev = _context11.next) {
                                case 0:
                                  _context11.next = 2;
                                  return (0, _balance.telegramBalance)(ctx, io);

                                case 2:
                                  task = _context11.sent;

                                case 3:
                                case "end":
                                  return _context11.stop();
                              }
                            }
                          }, _callee11);
                        })));

                      case 42:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, null, [[13, 22], [27, 36]]);
              }));

              return function balanceCallBack(_x8) {
                return _ref11.apply(this, arguments);
              };
            }();

            infoCallBack = /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context15.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context15.next = 5;
                          break;
                        }

                        return _context15.abrupt("return");

                      case 5:
                        _context15.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                          return _regenerator["default"].wrap(function _callee13$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  _context13.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context13.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context13.sent;
                                  _context13.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context13.sent;

                                case 8:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee13);
                        })));

                      case 7:
                        _context15.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Info');

                      case 9:
                        limited = _context15.sent;

                        if (!limited) {
                          _context15.next = 12;
                          break;
                        }

                        return _context15.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context15.next = 26;
                          break;
                        }

                        _context15.prev = 13;
                        _context15.t0 = ctx;
                        _context15.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context15.t1 = _context15.sent;
                        _context15.next = 20;
                        return _context15.t0.replyWithHTML.call(_context15.t0, _context15.t1);

                      case 20:
                        _context15.next = 25;
                        break;

                      case 22:
                        _context15.prev = 22;
                        _context15.t2 = _context15["catch"](13);
                        console.log(_context15.t2);

                      case 25:
                        return _context15.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context15.next = 40;
                          break;
                        }

                        _context15.prev = 27;
                        _context15.t3 = ctx;
                        _context15.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context15.t4 = _context15.sent;
                        _context15.next = 34;
                        return _context15.t3.replyWithHTML.call(_context15.t3, _context15.t4);

                      case 34:
                        _context15.next = 39;
                        break;

                      case 36:
                        _context15.prev = 36;
                        _context15.t5 = _context15["catch"](27);
                        console.log(_context15.t5);

                      case 39:
                        return _context15.abrupt("return");

                      case 40:
                        _context15.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
                          var task;
                          return _regenerator["default"].wrap(function _callee14$(_context14) {
                            while (1) {
                              switch (_context14.prev = _context14.next) {
                                case 0:
                                  _context14.next = 2;
                                  return (0, _info.fetchInfo)(ctx, io);

                                case 2:
                                  task = _context14.sent;

                                case 3:
                                case "end":
                                  return _context14.stop();
                              }
                            }
                          }, _callee14);
                        })));

                      case 42:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15, null, [[13, 22], [27, 36]]);
              }));

              return function infoCallBack(_x9) {
                return _ref14.apply(this, arguments);
              };
            }();

            depositCallBack = /*#__PURE__*/function () {
              var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(ctx) {
                var groupTask, lastSeen, maintenance, limited;
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context18.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context18.next = 5;
                          break;
                        }

                        return _context18.abrupt("return");

                      case 5:
                        _context18.next = 7;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                          return _regenerator["default"].wrap(function _callee16$(_context16) {
                            while (1) {
                              switch (_context16.prev = _context16.next) {
                                case 0:
                                  _context16.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context16.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context16.sent;
                                  _context16.next = 7;
                                  return (0, _group.updateGroup)(ctx);

                                case 7:
                                  groupTask = _context16.sent;

                                case 8:
                                case "end":
                                  return _context16.stop();
                              }
                            }
                          }, _callee16);
                        })));

                      case 7:
                        _context18.next = 9;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Deposit');

                      case 9:
                        limited = _context18.sent;

                        if (!limited) {
                          _context18.next = 12;
                          break;
                        }

                        return _context18.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context18.next = 26;
                          break;
                        }

                        _context18.prev = 13;
                        _context18.t0 = ctx;
                        _context18.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context18.t1 = _context18.sent;
                        _context18.next = 20;
                        return _context18.t0.replyWithHTML.call(_context18.t0, _context18.t1);

                      case 20:
                        _context18.next = 25;
                        break;

                      case 22:
                        _context18.prev = 22;
                        _context18.t2 = _context18["catch"](13);
                        console.log(_context18.t2);

                      case 25:
                        return _context18.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context18.next = 40;
                          break;
                        }

                        _context18.prev = 27;
                        _context18.t3 = ctx;
                        _context18.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context18.t4 = _context18.sent;
                        _context18.next = 34;
                        return _context18.t3.replyWithHTML.call(_context18.t3, _context18.t4);

                      case 34:
                        _context18.next = 39;
                        break;

                      case 36:
                        _context18.prev = 36;
                        _context18.t5 = _context18["catch"](27);
                        console.log(_context18.t5);

                      case 39:
                        return _context18.abrupt("return");

                      case 40:
                        _context18.next = 42;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
                          var task;
                          return _regenerator["default"].wrap(function _callee17$(_context17) {
                            while (1) {
                              switch (_context17.prev = _context17.next) {
                                case 0:
                                  _context17.next = 2;
                                  return (0, _deposit.fetchWalletDepositAddress)(ctx, io);

                                case 2:
                                  task = _context17.sent;

                                case 3:
                                case "end":
                                  return _context17.stop();
                              }
                            }
                          }, _callee17);
                        })));

                      case 42:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18, null, [[13, 22], [27, 36]]);
              }));

              return function depositCallBack(_x10) {
                return _ref17.apply(this, arguments);
              };
            }();

            telegramClient.command('balance', balanceCallBack);
            telegramClient.action('balance', balanceCallBack);
            telegramClient.command('info', infoCallBack);
            telegramClient.action('info', infoCallBack);
            telegramClient.command('faucet', faucetCallBack);
            telegramClient.action('faucet', faucetCallBack);
            telegramClient.command('price', priceCallBack);
            telegramClient.action('price', priceCallBack);
            telegramClient.action('deposit', depositCallBack);
            telegramClient.command('deposit', depositCallBack);

            if (settings.coin.setting === 'Runebase') {
              telegramClient.command('referral', /*#__PURE__*/function () {
                var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(ctx) {
                  var maintenance;
                  return _regenerator["default"].wrap(function _callee20$(_context20) {
                    while (1) {
                      switch (_context20.prev = _context20.next) {
                        case 0:
                          _context20.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context20.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context20.next = 5;
                            break;
                          }

                          return _context20.abrupt("return");

                        case 5:
                          _context20.next = 7;
                          return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                            var groupTask, telegramUserId, telegramUserName, task;
                            return _regenerator["default"].wrap(function _callee19$(_context19) {
                              while (1) {
                                switch (_context19.prev = _context19.next) {
                                  case 0:
                                    _context19.next = 2;
                                    return (0, _group.updateGroup)(ctx);

                                  case 2:
                                    groupTask = _context19.sent;
                                    telegramUserId = ctx.update.message.from.id;
                                    telegramUserName = ctx.update.message.from.username;
                                    _context19.next = 7;
                                    return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                                  case 7:
                                    task = _context19.sent;

                                  case 8:
                                  case "end":
                                    return _context19.stop();
                                }
                              }
                            }, _callee19);
                          })));

                        case 7:
                        case "end":
                          return _context20.stop();
                      }
                    }
                  }, _callee20);
                }));

                return function (_x11) {
                  return _ref20.apply(this, arguments);
                };
              }());
              telegramClient.action('referral', /*#__PURE__*/function () {
                var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(ctx) {
                  var maintenance;
                  return _regenerator["default"].wrap(function _callee22$(_context22) {
                    while (1) {
                      switch (_context22.prev = _context22.next) {
                        case 0:
                          _context22.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context22.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context22.next = 5;
                            break;
                          }

                          return _context22.abrupt("return");

                        case 5:
                          _context22.next = 7;
                          return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                            var groupTask, telegramUserId, telegramUserName, task;
                            return _regenerator["default"].wrap(function _callee21$(_context21) {
                              while (1) {
                                switch (_context21.prev = _context21.next) {
                                  case 0:
                                    _context21.next = 2;
                                    return (0, _group.updateGroup)(ctx);

                                  case 2:
                                    groupTask = _context21.sent;
                                    telegramUserId = ctx.update.callback_query.from.id;
                                    telegramUserName = ctx.update.callback_query.from.username;
                                    _context21.next = 7;
                                    return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                                  case 7:
                                    task = _context21.sent;

                                  case 8:
                                  case "end":
                                    return _context21.stop();
                                }
                              }
                            }, _callee21);
                          })));

                        case 7:
                        case "end":
                          return _context22.stop();
                      }
                    }
                  }, _callee22);
                }));

                return function (_x12) {
                  return _ref22.apply(this, arguments);
                };
              }());
              telegramClient.command('top', /*#__PURE__*/function () {
                var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(ctx) {
                  var maintenance;
                  return _regenerator["default"].wrap(function _callee24$(_context24) {
                    while (1) {
                      switch (_context24.prev = _context24.next) {
                        case 0:
                          _context24.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context24.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context24.next = 5;
                            break;
                          }

                          return _context24.abrupt("return");

                        case 5:
                          _context24.next = 7;
                          return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                            var groupTask, task;
                            return _regenerator["default"].wrap(function _callee23$(_context23) {
                              while (1) {
                                switch (_context23.prev = _context23.next) {
                                  case 0:
                                    _context23.next = 2;
                                    return (0, _group.updateGroup)(ctx);

                                  case 2:
                                    groupTask = _context23.sent;
                                    _context23.next = 5;
                                    return (0, _referral.fetchReferralTopTen)(ctx);

                                  case 5:
                                    task = _context23.sent;

                                  case 6:
                                  case "end":
                                    return _context23.stop();
                                }
                              }
                            }, _callee23);
                          })));

                        case 7:
                        case "end":
                          return _context24.stop();
                      }
                    }
                  }, _callee24);
                }));

                return function (_x13) {
                  return _ref24.apply(this, arguments);
                };
              }());
              telegramClient.action('top', /*#__PURE__*/function () {
                var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(ctx) {
                  var maintenance;
                  return _regenerator["default"].wrap(function _callee26$(_context26) {
                    while (1) {
                      switch (_context26.prev = _context26.next) {
                        case 0:
                          _context26.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context26.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context26.next = 5;
                            break;
                          }

                          return _context26.abrupt("return");

                        case 5:
                          _context26.next = 7;
                          return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                            var groupTask, task;
                            return _regenerator["default"].wrap(function _callee25$(_context25) {
                              while (1) {
                                switch (_context25.prev = _context25.next) {
                                  case 0:
                                    _context25.next = 2;
                                    return (0, _group.updateGroup)(ctx);

                                  case 2:
                                    groupTask = _context25.sent;
                                    _context25.next = 5;
                                    return (0, _referral.fetchReferralTopTen)(ctx);

                                  case 5:
                                    task = _context25.sent;

                                  case 6:
                                  case "end":
                                    return _context25.stop();
                                }
                              }
                            }, _callee25);
                          })));

                        case 7:
                        case "end":
                          return _context26.stop();
                      }
                    }
                  }, _callee26);
                }));

                return function (_x14) {
                  return _ref26.apply(this, arguments);
                };
              }());
            }

            telegramClient.on('new_chat_members', /*#__PURE__*/function () {
              var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(ctx) {
                return _regenerator["default"].wrap(function _callee28$(_context28) {
                  while (1) {
                    switch (_context28.prev = _context28.next) {
                      case 0:
                        _context28.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                          var groupTask, task;
                          return _regenerator["default"].wrap(function _callee27$(_context27) {
                            while (1) {
                              switch (_context27.prev = _context27.next) {
                                case 0:
                                  _context27.next = 2;
                                  return (0, _group.updateGroup)(ctx);

                                case 2:
                                  groupTask = _context27.sent;
                                  _context27.next = 5;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 5:
                                  task = _context27.sent;

                                case 6:
                                case "end":
                                  return _context27.stop();
                              }
                            }
                          }, _callee27);
                        })));

                      case 2:
                      case "end":
                        return _context28.stop();
                    }
                  }
                }, _callee28);
              }));

              return function (_x15) {
                return _ref28.apply(this, arguments);
              };
            }());
            telegramClient.on('text', /*#__PURE__*/function () {
              var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee43(ctx) {
                var lastSeen, groupTask, preFilteredMessageTelegram, filteredMessageTelegram, telegramUserId, telegramUserName, disallow, maintenance, groupTaskId, faucetSetting, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, setting, _limited8, _setting, _limited9, _setting2, _limited10, _setting3, _limited11, _setting4;

                return _regenerator["default"].wrap(function _callee43$(_context43) {
                  while (1) {
                    switch (_context43.prev = _context43.next) {
                      case 0:
                        _context43.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
                          return _regenerator["default"].wrap(function _callee29$(_context29) {
                            while (1) {
                              switch (_context29.prev = _context29.next) {
                                case 0:
                                  _context29.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context29.next = 4;
                                  return (0, _group.updateGroup)(ctx);

                                case 4:
                                  groupTask = _context29.sent;
                                  _context29.next = 7;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 7:
                                  lastSeen = _context29.sent;

                                case 8:
                                case "end":
                                  return _context29.stop();
                              }
                            }
                          }, _callee29);
                        })));

                      case 2:
                        preFilteredMessageTelegram = ctx.update.message.text.split(' ');
                        filteredMessageTelegram = preFilteredMessageTelegram.filter(function (el) {
                          return el !== '';
                        });
                        telegramUserId = ctx.update.message.from.id;
                        telegramUserName = ctx.update.message.from.username;

                        if (!(filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram)) {
                          _context43.next = 201;
                          break;
                        }

                        _context43.next = 9;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 9:
                        maintenance = _context43.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context43.next = 12;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 12:
                        if (!(groupTask && groupTask.banned)) {
                          _context43.next = 26;
                          break;
                        }

                        _context43.prev = 13;
                        _context43.t0 = ctx;
                        _context43.next = 17;
                        return (0, _telegram2.telegramServerBannedMessage)(groupTask);

                      case 17:
                        _context43.t1 = _context43.sent;
                        _context43.next = 20;
                        return _context43.t0.replyWithHTML.call(_context43.t0, _context43.t1);

                      case 20:
                        _context43.next = 25;
                        break;

                      case 22:
                        _context43.prev = 22;
                        _context43.t2 = _context43["catch"](13);
                        console.log(_context43.t2);

                      case 25:
                        return _context43.abrupt("return");

                      case 26:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context43.next = 40;
                          break;
                        }

                        _context43.prev = 27;
                        _context43.t3 = ctx;
                        _context43.next = 31;
                        return (0, _telegram2.telegramUserBannedMessage)(lastSeen);

                      case 31:
                        _context43.t4 = _context43.sent;
                        _context43.next = 34;
                        return _context43.t3.replyWithHTML.call(_context43.t3, _context43.t4);

                      case 34:
                        _context43.next = 39;
                        break;

                      case 36:
                        _context43.prev = 36;
                        _context43.t5 = _context43["catch"](27);
                        console.log(_context43.t5);

                      case 39:
                        return _context43.abrupt("return");

                      case 40:
                        groupTaskId = groupTask && groupTask.id;
                        _context43.next = 43;
                        return (0, _settings.telegramWaterFaucetSettings)(groupTaskId);

                      case 43:
                        faucetSetting = _context43.sent;

                        if (faucetSetting) {
                          _context43.next = 46;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 46:
                        if (filteredMessageTelegram[1]) {
                          _context43.next = 55;
                          break;
                        }

                        _context43.next = 49;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 49:
                        limited = _context43.sent;

                        if (!limited) {
                          _context43.next = 52;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 52:
                        _context43.next = 54;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30() {
                          var task;
                          return _regenerator["default"].wrap(function _callee30$(_context30) {
                            while (1) {
                              switch (_context30.prev = _context30.next) {
                                case 0:
                                  _context30.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context30.sent;

                                case 3:
                                case "end":
                                  return _context30.stop();
                              }
                            }
                          }, _callee30);
                        })));

                      case 54:
                        return _context43.abrupt("return");

                      case 55:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'help')) {
                          _context43.next = 64;
                          break;
                        }

                        _context43.next = 58;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 58:
                        _limited = _context43.sent;

                        if (!_limited) {
                          _context43.next = 61;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 61:
                        _context43.next = 63;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31() {
                          var task;
                          return _regenerator["default"].wrap(function _callee31$(_context31) {
                            while (1) {
                              switch (_context31.prev = _context31.next) {
                                case 0:
                                  _context31.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context31.sent;

                                case 3:
                                case "end":
                                  return _context31.stop();
                              }
                            }
                          }, _callee31);
                        })));

                      case 63:
                        return _context43.abrupt("return");

                      case 64:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'price')) {
                          _context43.next = 73;
                          break;
                        }

                        _context43.next = 67;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Price');

                      case 67:
                        _limited2 = _context43.sent;

                        if (!_limited2) {
                          _context43.next = 70;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 70:
                        _context43.next = 72;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32() {
                          var task;
                          return _regenerator["default"].wrap(function _callee32$(_context32) {
                            while (1) {
                              switch (_context32.prev = _context32.next) {
                                case 0:
                                  _context32.next = 2;
                                  return (0, _price.telegramPrice)(ctx, io);

                                case 2:
                                  task = _context32.sent;

                                case 3:
                                case "end":
                                  return _context32.stop();
                              }
                            }
                          }, _callee32);
                        })));

                      case 72:
                        return _context43.abrupt("return");

                      case 73:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'info')) {
                          _context43.next = 82;
                          break;
                        }

                        _context43.next = 76;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Info');

                      case 76:
                        _limited3 = _context43.sent;

                        if (!_limited3) {
                          _context43.next = 79;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 79:
                        _context43.next = 81;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33() {
                          var task;
                          return _regenerator["default"].wrap(function _callee33$(_context33) {
                            while (1) {
                              switch (_context33.prev = _context33.next) {
                                case 0:
                                  _context33.next = 2;
                                  return (0, _info.fetchInfo)(ctx, io);

                                case 2:
                                  task = _context33.sent;

                                case 3:
                                case "end":
                                  return _context33.stop();
                              }
                            }
                          }, _callee33);
                        })));

                      case 81:
                        return _context43.abrupt("return");

                      case 82:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'faucet')) {
                          _context43.next = 91;
                          break;
                        }

                        _context43.next = 85;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Faucet');

                      case 85:
                        _limited4 = _context43.sent;

                        if (!_limited4) {
                          _context43.next = 88;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 88:
                        _context43.next = 90;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34() {
                          var task;
                          return _regenerator["default"].wrap(function _callee34$(_context34) {
                            while (1) {
                              switch (_context34.prev = _context34.next) {
                                case 0:
                                  _context34.next = 2;
                                  return (0, _faucet.telegramFaucetClaim)(ctx, io);

                                case 2:
                                  task = _context34.sent;

                                case 3:
                                case "end":
                                  return _context34.stop();
                              }
                            }
                          }, _callee34);
                        })));

                      case 90:
                        return _context43.abrupt("return");

                      case 91:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'balance')) {
                          _context43.next = 100;
                          break;
                        }

                        _context43.next = 94;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Balance');

                      case 94:
                        _limited5 = _context43.sent;

                        if (!_limited5) {
                          _context43.next = 97;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 97:
                        _context43.next = 99;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35() {
                          var task;
                          return _regenerator["default"].wrap(function _callee35$(_context35) {
                            while (1) {
                              switch (_context35.prev = _context35.next) {
                                case 0:
                                  _context35.next = 2;
                                  return (0, _balance.telegramBalance)(ctx, io);

                                case 2:
                                  task = _context35.sent;

                                case 3:
                                case "end":
                                  return _context35.stop();
                              }
                            }
                          }, _callee35);
                        })));

                      case 99:
                        return _context43.abrupt("return");

                      case 100:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'deposit')) {
                          _context43.next = 109;
                          break;
                        }

                        _context43.next = 103;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Deposit');

                      case 103:
                        _limited6 = _context43.sent;

                        if (!_limited6) {
                          _context43.next = 106;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 106:
                        _context43.next = 108;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36() {
                          var task;
                          return _regenerator["default"].wrap(function _callee36$(_context36) {
                            while (1) {
                              switch (_context36.prev = _context36.next) {
                                case 0:
                                  _context36.next = 2;
                                  return (0, _deposit.fetchWalletDepositAddress)(ctx, io);

                                case 2:
                                  task = _context36.sent;

                                case 3:
                                case "end":
                                  return _context36.stop();
                              }
                            }
                          }, _callee36);
                        })));

                      case 108:
                        return _context43.abrupt("return");

                      case 109:
                        if (!(settings.coin.setting === 'Runebase')) {
                          _context43.next = 116;
                          break;
                        }

                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2])) {
                          _context43.next = 113;
                          break;
                        }

                        _context43.next = 113;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee37() {
                          var task;
                          return _regenerator["default"].wrap(function _callee37$(_context37) {
                            while (1) {
                              switch (_context37.prev = _context37.next) {
                                case 0:
                                  _context37.next = 2;
                                  return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                                case 2:
                                  task = _context37.sent;

                                case 3:
                                case "end":
                                  return _context37.stop();
                              }
                            }
                          }, _callee37);
                        })));

                      case 113:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top')) {
                          _context43.next = 116;
                          break;
                        }

                        _context43.next = 116;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee38() {
                          var task;
                          return _regenerator["default"].wrap(function _callee38$(_context38) {
                            while (1) {
                              switch (_context38.prev = _context38.next) {
                                case 0:
                                  _context38.next = 2;
                                  return (0, _referral.fetchReferralTopTen)(ctx);

                                case 2:
                                  task = _context38.sent;

                                case 3:
                                case "end":
                                  return _context38.stop();
                              }
                            }
                          }, _callee38);
                        })));

                      case 116:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'flood')) {
                          _context43.next = 134;
                          break;
                        }

                        _context43.next = 119;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Flood');

                      case 119:
                        _limited7 = _context43.sent;

                        if (!_limited7) {
                          _context43.next = 122;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 122:
                        _context43.next = 124;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee39() {
                          return _regenerator["default"].wrap(function _callee39$(_context39) {
                            while (1) {
                              switch (_context39.prev = _context39.next) {
                                case 0:
                                  _context39.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'flood', io);

                                case 2:
                                  disallow = _context39.sent;

                                case 3:
                                case "end":
                                  return _context39.stop();
                              }
                            }
                          }, _callee39);
                        })));

                      case 124:
                        if (!disallow) {
                          _context43.next = 126;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 126:
                        _context43.next = 128;
                        return (0, _settings.telegramSettings)(ctx, 'flood', groupTaskId);

                      case 128:
                        setting = _context43.sent;

                        if (setting) {
                          _context43.next = 131;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 131:
                        _context43.next = 133;
                        return (0, _executeTips.executeTipFunction)(_flood.telegramFlood, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, setting, faucetSetting);

                      case 133:
                        return _context43.abrupt("return");

                      case 134:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'sleet')) {
                          _context43.next = 152;
                          break;
                        }

                        _context43.next = 137;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Sleet');

                      case 137:
                        _limited8 = _context43.sent;

                        if (!_limited8) {
                          _context43.next = 140;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 140:
                        _context43.next = 142;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee40() {
                          return _regenerator["default"].wrap(function _callee40$(_context40) {
                            while (1) {
                              switch (_context40.prev = _context40.next) {
                                case 0:
                                  _context40.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'sleet', io);

                                case 2:
                                  disallow = _context40.sent;

                                case 3:
                                case "end":
                                  return _context40.stop();
                              }
                            }
                          }, _callee40);
                        })));

                      case 142:
                        if (!disallow) {
                          _context43.next = 144;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 144:
                        _context43.next = 146;
                        return (0, _settings.telegramSettings)(ctx, 'sleet', groupTaskId);

                      case 146:
                        _setting = _context43.sent;

                        if (_setting) {
                          _context43.next = 149;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 149:
                        _context43.next = 151;
                        return (0, _executeTips.executeTipFunction)(_sleet.telegramSleet, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting, faucetSetting);

                      case 151:
                        return _context43.abrupt("return");

                      case 152:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'rain')) {
                          _context43.next = 170;
                          break;
                        }

                        _context43.next = 155;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Rain');

                      case 155:
                        _limited9 = _context43.sent;

                        if (!_limited9) {
                          _context43.next = 158;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 158:
                        _context43.next = 160;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee41() {
                          return _regenerator["default"].wrap(function _callee41$(_context41) {
                            while (1) {
                              switch (_context41.prev = _context41.next) {
                                case 0:
                                  _context41.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'rain', io);

                                case 2:
                                  disallow = _context41.sent;

                                case 3:
                                case "end":
                                  return _context41.stop();
                              }
                            }
                          }, _callee41);
                        })));

                      case 160:
                        if (!disallow) {
                          _context43.next = 162;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 162:
                        _context43.next = 164;
                        return (0, _settings.telegramSettings)(ctx, 'rain', groupTaskId);

                      case 164:
                        _setting2 = _context43.sent;

                        if (_setting2) {
                          _context43.next = 167;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 167:
                        _context43.next = 169;
                        return (0, _executeTips.executeTipFunction)(_rain.telegramRain, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting2, faucetSetting);

                      case 169:
                        return _context43.abrupt("return");

                      case 170:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'withdraw')) {
                          _context43.next = 184;
                          break;
                        }

                        _context43.next = 173;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Withdraw');

                      case 173:
                        _limited10 = _context43.sent;

                        if (!_limited10) {
                          _context43.next = 176;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 176:
                        _context43.next = 178;
                        return (0, _settings.telegramSettings)(ctx, 'withdraw', groupTaskId);

                      case 178:
                        _setting3 = _context43.sent;

                        if (_setting3) {
                          _context43.next = 181;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 181:
                        _context43.next = 183;
                        return (0, _executeTips.executeTipFunction)(_withdraw.withdrawTelegramCreate, queue, filteredMessageTelegram[3], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting3, faucetSetting);

                      case 183:
                        return _context43.abrupt("return");

                      case 184:
                        if (!(filteredMessageTelegram[1] && ctx.update && ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.length > 0)) {
                          _context43.next = 201;
                          break;
                        }

                        _context43.next = 187;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Tip');

                      case 187:
                        _limited11 = _context43.sent;

                        if (!_limited11) {
                          _context43.next = 190;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 190:
                        _context43.next = 192;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee42() {
                          return _regenerator["default"].wrap(function _callee42$(_context42) {
                            while (1) {
                              switch (_context42.prev = _context42.next) {
                                case 0:
                                  _context42.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'tip', io);

                                case 2:
                                  disallow = _context42.sent;

                                case 3:
                                case "end":
                                  return _context42.stop();
                              }
                            }
                          }, _callee42);
                        })));

                      case 192:
                        if (!disallow) {
                          _context43.next = 194;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 194:
                        _context43.next = 196;
                        return (0, _settings.telegramSettings)(ctx, 'tip', groupTaskId);

                      case 196:
                        _setting4 = _context43.sent;

                        if (_setting4) {
                          _context43.next = 199;
                          break;
                        }

                        return _context43.abrupt("return");

                      case 199:
                        _context43.next = 201;
                        return (0, _executeTips.executeTipFunction)(_tip.tipToTelegramUser, queue, filteredMessageTelegram[ctx.update.message.entities.length + 1], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting4, faucetSetting);

                      case 201:
                      case "end":
                        return _context43.stop();
                    }
                  }
                }, _callee43, null, [[13, 22], [27, 36]]);
              }));

              return function (_x16) {
                return _ref30.apply(this, arguments);
              };
            }());

          case 25:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));

  return function telegramRouter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramRouter = telegramRouter;