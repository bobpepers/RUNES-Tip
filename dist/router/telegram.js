"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

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

var _fees = require("../controllers/telegram/fees");

var _user = require("../controllers/telegram/user");

var _executeTips = require("../helpers/client/telegram/executeTips");

var _disallowDirectMessage = require("../helpers/client/telegram/disallowDirectMessage");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _rateLimit = require("../helpers/rateLimit");

var _group = require("../controllers/telegram/group");

var _settings = require("../controllers/telegram/settings");

var _settings2 = require("../controllers/settings");

var _telegram = require("../messages/telegram");

// import {
//   fetchReferralCount,
//   // createReferral,
//   fetchReferralTopTen,
// } from '../controllers/telegram/referral';
// import getCoinSettings from '../config/settings';
// const settings = getCoinSettings();
(0, _dotenv.config)(); // const runesGroup = process.env.TELEGRAM_RUNES_GROUP;

var telegramRouter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(telegramClient, telegramApiClient, queue, io, settings) {
    var priceCallBack, faucetCallBack, balanceCallBack, infoCallBack, depositCallBack;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
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
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

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
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

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

              return function (_x6) {
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
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

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
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

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

              return function priceCallBack(_x7) {
                return _ref5.apply(this, arguments);
              };
            }();

            faucetCallBack = /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(ctx) {
                var groupTask, lastSeen, maintenance, limited, groupTaskId, setting;
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
                        groupTaskId = groupTask && groupTask.id;
                        _context9.next = 15;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'faucet', groupTaskId);

                      case 15:
                        setting = _context9.sent;

                        if (setting) {
                          _context9.next = 18;
                          break;
                        }

                        return _context9.abrupt("return");

                      case 18:
                        if (!(groupTask && groupTask.banned)) {
                          _context9.next = 32;
                          break;
                        }

                        _context9.prev = 19;
                        _context9.t0 = ctx;
                        _context9.next = 23;
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

                      case 23:
                        _context9.t1 = _context9.sent;
                        _context9.next = 26;
                        return _context9.t0.replyWithHTML.call(_context9.t0, _context9.t1);

                      case 26:
                        _context9.next = 31;
                        break;

                      case 28:
                        _context9.prev = 28;
                        _context9.t2 = _context9["catch"](19);
                        console.log(_context9.t2);

                      case 31:
                        return _context9.abrupt("return");

                      case 32:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context9.next = 46;
                          break;
                        }

                        _context9.prev = 33;
                        _context9.t3 = ctx;
                        _context9.next = 37;
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

                      case 37:
                        _context9.t4 = _context9.sent;
                        _context9.next = 40;
                        return _context9.t3.replyWithHTML.call(_context9.t3, _context9.t4);

                      case 40:
                        _context9.next = 45;
                        break;

                      case 42:
                        _context9.prev = 42;
                        _context9.t5 = _context9["catch"](33);
                        console.log(_context9.t5);

                      case 45:
                        return _context9.abrupt("return");

                      case 46:
                        _context9.next = 48;
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

                      case 48:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, null, [[19, 28], [33, 42]]);
              }));

              return function faucetCallBack(_x8) {
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
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

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
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

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

              return function balanceCallBack(_x9) {
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
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

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
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

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

              return function infoCallBack(_x10) {
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
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

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
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

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

              return function depositCallBack(_x11) {
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
            telegramClient.command('deposit', depositCallBack); // if (settings.coin.setting === 'Runebase') {
            //   telegramClient.command('referral', async (ctx) => {
            //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
            //     if (maintenance.maintenance || !maintenance.enabled) return;
            //     await queue.add(async () => {
            //       const groupTask = await updateGroup(ctx);
            //       const telegramUserId = ctx.update.message.from.id;
            //       const telegramUserName = ctx.update.message.from.username;
            //       const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
            //     });
            //   });
            //   telegramClient.action('referral', async (ctx) => {
            //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
            //     if (maintenance.maintenance || !maintenance.enabled) return;
            //     await queue.add(async () => {
            //       const groupTask = await updateGroup(ctx);
            //       const telegramUserId = ctx.update.callback_query.from.id;
            //       const telegramUserName = ctx.update.callback_query.from.username;
            //       const task = await fetchReferralCount(ctx, telegramUserId, telegramUserName);
            //     });
            //   });
            //   telegramClient.command('top', async (ctx) => {
            //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
            //     if (maintenance.maintenance || !maintenance.enabled) return;
            //     await queue.add(async () => {
            //       const groupTask = await updateGroup(ctx);
            //       const task = await fetchReferralTopTen(ctx);
            //     });
            //   });
            //   telegramClient.action('top', async (ctx) => {
            //     const maintenance = await isMaintenanceOrDisabled(ctx, 'telegram');
            //     if (maintenance.maintenance || !maintenance.enabled) return;
            //     await queue.add(async () => {
            //       const groupTask = await updateGroup(ctx);
            //       const task = await fetchReferralTopTen(ctx);
            //     });
            //   });
            // }

            telegramClient.on('new_chat_members', /*#__PURE__*/function () {
              var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(ctx) {
                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
                          var groupTask, task;
                          return _regenerator["default"].wrap(function _callee19$(_context19) {
                            while (1) {
                              switch (_context19.prev = _context19.next) {
                                case 0:
                                  _context19.next = 2;
                                  return (0, _group.updateGroup)(ctx);

                                case 2:
                                  groupTask = _context19.sent;
                                  _context19.next = 5;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 5:
                                  task = _context19.sent;

                                case 6:
                                case "end":
                                  return _context19.stop();
                              }
                            }
                          }, _callee19);
                        })));

                      case 2:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              }));

              return function (_x12) {
                return _ref20.apply(this, arguments);
              };
            }());
            telegramClient.on('text', /*#__PURE__*/function () {
              var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(ctx) {
                var lastSeen, groupTask, messageReplaceBreaksWithSpaces, preFilteredMessageTelegram, filteredMessageTelegram, disallow, maintenance, groupTaskId, faucetSetting, limited, _limited, _limited2, _limited3, _limited4, _limited5, setting, _limited6, _limited7, _limited8, _setting, _limited9, _setting2, _limited10, _setting3, _limited11, _setting4, _limited12, _setting5;

                return _regenerator["default"].wrap(function _callee34$(_context34) {
                  while (1) {
                    switch (_context34.prev = _context34.next) {
                      case 0:
                        _context34.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                          return _regenerator["default"].wrap(function _callee21$(_context21) {
                            while (1) {
                              switch (_context21.prev = _context21.next) {
                                case 0:
                                  _context21.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context21.next = 4;
                                  return (0, _group.updateGroup)(ctx);

                                case 4:
                                  groupTask = _context21.sent;
                                  _context21.next = 7;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 7:
                                  lastSeen = _context21.sent;

                                case 8:
                                case "end":
                                  return _context21.stop();
                              }
                            }
                          }, _callee21);
                        })));

                      case 2:
                        messageReplaceBreaksWithSpaces = ctx.update.message.text.replace(/\n/g, " ");
                        preFilteredMessageTelegram = messageReplaceBreaksWithSpaces.split(' ');
                        filteredMessageTelegram = preFilteredMessageTelegram.filter(function (el) {
                          return el !== '';
                        }); // const telegramUserId = ctx.update.message.from.id;
                        // const telegramUserName = ctx.update.message.from.username;

                        if (!(filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram)) {
                          _context34.next = 207;
                          break;
                        }

                        _context34.next = 8;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 8:
                        maintenance = _context34.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context34.next = 11;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 11:
                        if (!(groupTask && groupTask.banned)) {
                          _context34.next = 25;
                          break;
                        }

                        _context34.prev = 12;
                        _context34.t0 = ctx;
                        _context34.next = 16;
                        return (0, _telegram.telegramServerBannedMessage)(groupTask);

                      case 16:
                        _context34.t1 = _context34.sent;
                        _context34.next = 19;
                        return _context34.t0.replyWithHTML.call(_context34.t0, _context34.t1);

                      case 19:
                        _context34.next = 24;
                        break;

                      case 21:
                        _context34.prev = 21;
                        _context34.t2 = _context34["catch"](12);
                        console.log(_context34.t2);

                      case 24:
                        return _context34.abrupt("return");

                      case 25:
                        if (!(lastSeen && lastSeen.banned)) {
                          _context34.next = 39;
                          break;
                        }

                        _context34.prev = 26;
                        _context34.t3 = ctx;
                        _context34.next = 30;
                        return (0, _telegram.telegramUserBannedMessage)(lastSeen);

                      case 30:
                        _context34.t4 = _context34.sent;
                        _context34.next = 33;
                        return _context34.t3.replyWithHTML.call(_context34.t3, _context34.t4);

                      case 33:
                        _context34.next = 38;
                        break;

                      case 35:
                        _context34.prev = 35;
                        _context34.t5 = _context34["catch"](26);
                        console.log(_context34.t5);

                      case 38:
                        return _context34.abrupt("return");

                      case 39:
                        groupTaskId = groupTask && groupTask.id;
                        _context34.next = 42;
                        return (0, _settings2.waterFaucetSettings)(groupTaskId);

                      case 42:
                        faucetSetting = _context34.sent;

                        if (faucetSetting) {
                          _context34.next = 45;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 45:
                        if (filteredMessageTelegram[1]) {
                          _context34.next = 54;
                          break;
                        }

                        _context34.next = 48;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 48:
                        limited = _context34.sent;

                        if (!limited) {
                          _context34.next = 51;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 51:
                        _context34.next = 53;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
                          var task;
                          return _regenerator["default"].wrap(function _callee22$(_context22) {
                            while (1) {
                              switch (_context22.prev = _context22.next) {
                                case 0:
                                  _context22.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context22.sent;

                                case 3:
                                case "end":
                                  return _context22.stop();
                              }
                            }
                          }, _callee22);
                        })));

                      case 53:
                        return _context34.abrupt("return");

                      case 54:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'help')) {
                          _context34.next = 63;
                          break;
                        }

                        _context34.next = 57;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 57:
                        _limited = _context34.sent;

                        if (!_limited) {
                          _context34.next = 60;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 60:
                        _context34.next = 62;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                          var task;
                          return _regenerator["default"].wrap(function _callee23$(_context23) {
                            while (1) {
                              switch (_context23.prev = _context23.next) {
                                case 0:
                                  _context23.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context23.sent;

                                case 3:
                                case "end":
                                  return _context23.stop();
                              }
                            }
                          }, _callee23);
                        })));

                      case 62:
                        return _context34.abrupt("return");

                      case 63:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'price')) {
                          _context34.next = 72;
                          break;
                        }

                        _context34.next = 66;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Price');

                      case 66:
                        _limited2 = _context34.sent;

                        if (!_limited2) {
                          _context34.next = 69;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 69:
                        _context34.next = 71;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                          var task;
                          return _regenerator["default"].wrap(function _callee24$(_context24) {
                            while (1) {
                              switch (_context24.prev = _context24.next) {
                                case 0:
                                  _context24.next = 2;
                                  return (0, _price.telegramPrice)(ctx, io);

                                case 2:
                                  task = _context24.sent;

                                case 3:
                                case "end":
                                  return _context24.stop();
                              }
                            }
                          }, _callee24);
                        })));

                      case 71:
                        return _context34.abrupt("return");

                      case 72:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'fees')) {
                          _context34.next = 81;
                          break;
                        }

                        _context34.next = 75;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Fees');

                      case 75:
                        _limited3 = _context34.sent;

                        if (!_limited3) {
                          _context34.next = 78;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 78:
                        _context34.next = 80;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                          var task;
                          return _regenerator["default"].wrap(function _callee25$(_context25) {
                            while (1) {
                              switch (_context25.prev = _context25.next) {
                                case 0:
                                  _context25.next = 2;
                                  return (0, _fees.telegramFeeSchedule)(ctx, io, groupTaskId);

                                case 2:
                                  task = _context25.sent;

                                case 3:
                                case "end":
                                  return _context25.stop();
                              }
                            }
                          }, _callee25);
                        })));

                      case 80:
                        return _context34.abrupt("return");

                      case 81:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'info')) {
                          _context34.next = 90;
                          break;
                        }

                        _context34.next = 84;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Info');

                      case 84:
                        _limited4 = _context34.sent;

                        if (!_limited4) {
                          _context34.next = 87;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 87:
                        _context34.next = 89;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
                          var task;
                          return _regenerator["default"].wrap(function _callee26$(_context26) {
                            while (1) {
                              switch (_context26.prev = _context26.next) {
                                case 0:
                                  _context26.next = 2;
                                  return (0, _info.fetchInfo)(ctx, io);

                                case 2:
                                  task = _context26.sent;

                                case 3:
                                case "end":
                                  return _context26.stop();
                              }
                            }
                          }, _callee26);
                        })));

                      case 89:
                        return _context34.abrupt("return");

                      case 90:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'faucet')) {
                          _context34.next = 104;
                          break;
                        }

                        _context34.next = 93;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Faucet');

                      case 93:
                        _limited5 = _context34.sent;

                        if (!_limited5) {
                          _context34.next = 96;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 96:
                        _context34.next = 98;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'faucet', groupTaskId);

                      case 98:
                        setting = _context34.sent;

                        if (setting) {
                          _context34.next = 101;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 101:
                        _context34.next = 103;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                          var task;
                          return _regenerator["default"].wrap(function _callee27$(_context27) {
                            while (1) {
                              switch (_context27.prev = _context27.next) {
                                case 0:
                                  _context27.next = 2;
                                  return (0, _faucet.telegramFaucetClaim)(ctx, io);

                                case 2:
                                  task = _context27.sent;

                                case 3:
                                case "end":
                                  return _context27.stop();
                              }
                            }
                          }, _callee27);
                        })));

                      case 103:
                        return _context34.abrupt("return");

                      case 104:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'balance')) {
                          _context34.next = 113;
                          break;
                        }

                        _context34.next = 107;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Balance');

                      case 107:
                        _limited6 = _context34.sent;

                        if (!_limited6) {
                          _context34.next = 110;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 110:
                        _context34.next = 112;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28() {
                          var task;
                          return _regenerator["default"].wrap(function _callee28$(_context28) {
                            while (1) {
                              switch (_context28.prev = _context28.next) {
                                case 0:
                                  _context28.next = 2;
                                  return (0, _balance.telegramBalance)(ctx, io);

                                case 2:
                                  task = _context28.sent;

                                case 3:
                                case "end":
                                  return _context28.stop();
                              }
                            }
                          }, _callee28);
                        })));

                      case 112:
                        return _context34.abrupt("return");

                      case 113:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'deposit')) {
                          _context34.next = 122;
                          break;
                        }

                        _context34.next = 116;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Deposit');

                      case 116:
                        _limited7 = _context34.sent;

                        if (!_limited7) {
                          _context34.next = 119;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 119:
                        _context34.next = 121;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
                          var task;
                          return _regenerator["default"].wrap(function _callee29$(_context29) {
                            while (1) {
                              switch (_context29.prev = _context29.next) {
                                case 0:
                                  _context29.next = 2;
                                  return (0, _deposit.fetchWalletDepositAddress)(ctx, io);

                                case 2:
                                  task = _context29.sent;

                                case 3:
                                case "end":
                                  return _context29.stop();
                              }
                            }
                          }, _callee29);
                        })));

                      case 121:
                        return _context34.abrupt("return");

                      case 122:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'flood')) {
                          _context34.next = 140;
                          break;
                        }

                        _context34.next = 125;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Flood');

                      case 125:
                        _limited8 = _context34.sent;

                        if (!_limited8) {
                          _context34.next = 128;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 128:
                        _context34.next = 130;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30() {
                          return _regenerator["default"].wrap(function _callee30$(_context30) {
                            while (1) {
                              switch (_context30.prev = _context30.next) {
                                case 0:
                                  _context30.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'flood', io);

                                case 2:
                                  disallow = _context30.sent;

                                case 3:
                                case "end":
                                  return _context30.stop();
                              }
                            }
                          }, _callee30);
                        })));

                      case 130:
                        if (!disallow) {
                          _context34.next = 132;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 132:
                        _context34.next = 134;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'flood', groupTaskId);

                      case 134:
                        _setting = _context34.sent;

                        if (_setting) {
                          _context34.next = 137;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 137:
                        _context34.next = 139;
                        return (0, _executeTips.executeTipFunction)(_flood.telegramFlood, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting, faucetSetting);

                      case 139:
                        return _context34.abrupt("return");

                      case 140:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'sleet')) {
                          _context34.next = 158;
                          break;
                        }

                        _context34.next = 143;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Sleet');

                      case 143:
                        _limited9 = _context34.sent;

                        if (!_limited9) {
                          _context34.next = 146;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 146:
                        _context34.next = 148;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31() {
                          return _regenerator["default"].wrap(function _callee31$(_context31) {
                            while (1) {
                              switch (_context31.prev = _context31.next) {
                                case 0:
                                  _context31.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'sleet', io);

                                case 2:
                                  disallow = _context31.sent;

                                case 3:
                                case "end":
                                  return _context31.stop();
                              }
                            }
                          }, _callee31);
                        })));

                      case 148:
                        if (!disallow) {
                          _context34.next = 150;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 150:
                        _context34.next = 152;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'sleet', groupTaskId);

                      case 152:
                        _setting2 = _context34.sent;

                        if (_setting2) {
                          _context34.next = 155;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 155:
                        _context34.next = 157;
                        return (0, _executeTips.executeTipFunction)(_sleet.telegramSleet, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting2, faucetSetting);

                      case 157:
                        return _context34.abrupt("return");

                      case 158:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'rain')) {
                          _context34.next = 176;
                          break;
                        }

                        _context34.next = 161;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Rain');

                      case 161:
                        _limited10 = _context34.sent;

                        if (!_limited10) {
                          _context34.next = 164;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 164:
                        _context34.next = 166;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32() {
                          return _regenerator["default"].wrap(function _callee32$(_context32) {
                            while (1) {
                              switch (_context32.prev = _context32.next) {
                                case 0:
                                  _context32.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'rain', io);

                                case 2:
                                  disallow = _context32.sent;

                                case 3:
                                case "end":
                                  return _context32.stop();
                              }
                            }
                          }, _callee32);
                        })));

                      case 166:
                        if (!disallow) {
                          _context34.next = 168;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 168:
                        _context34.next = 170;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'rain', groupTaskId);

                      case 170:
                        _setting3 = _context34.sent;

                        if (_setting3) {
                          _context34.next = 173;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 173:
                        _context34.next = 175;
                        return (0, _executeTips.executeTipFunction)(_rain.telegramRain, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting3, faucetSetting);

                      case 175:
                        return _context34.abrupt("return");

                      case 176:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'withdraw')) {
                          _context34.next = 190;
                          break;
                        }

                        _context34.next = 179;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Withdraw');

                      case 179:
                        _limited11 = _context34.sent;

                        if (!_limited11) {
                          _context34.next = 182;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 182:
                        _context34.next = 184;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'withdraw', groupTaskId);

                      case 184:
                        _setting4 = _context34.sent;

                        if (_setting4) {
                          _context34.next = 187;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 187:
                        _context34.next = 189;
                        return (0, _executeTips.executeTipFunction)(_withdraw.withdrawTelegramCreate, queue, filteredMessageTelegram[3], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting4, faucetSetting);

                      case 189:
                        return _context34.abrupt("return");

                      case 190:
                        if (!(filteredMessageTelegram[1] && ctx.update && ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.length > 0)) {
                          _context34.next = 207;
                          break;
                        }

                        _context34.next = 193;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Tip');

                      case 193:
                        _limited12 = _context34.sent;

                        if (!_limited12) {
                          _context34.next = 196;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 196:
                        _context34.next = 198;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33() {
                          return _regenerator["default"].wrap(function _callee33$(_context33) {
                            while (1) {
                              switch (_context33.prev = _context33.next) {
                                case 0:
                                  _context33.next = 2;
                                  return (0, _disallowDirectMessage.disallowDirectMessage)(ctx, lastSeen, 'tip', io);

                                case 2:
                                  disallow = _context33.sent;

                                case 3:
                                case "end":
                                  return _context33.stop();
                              }
                            }
                          }, _callee33);
                        })));

                      case 198:
                        if (!disallow) {
                          _context34.next = 200;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 200:
                        _context34.next = 202;
                        return (0, _settings.telegramFeatureSettings)(ctx, 'tip', groupTaskId);

                      case 202:
                        _setting5 = _context34.sent;

                        if (_setting5) {
                          _context34.next = 205;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 205:
                        _context34.next = 207;
                        return (0, _executeTips.executeTipFunction)(_tip.tipToTelegramUser, queue, filteredMessageTelegram[ctx.update.message.entities.length + 1], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting5, faucetSetting);

                      case 207:
                      case "end":
                        return _context34.stop();
                    }
                  }
                }, _callee34, null, [[12, 21], [26, 35]]);
              }));

              return function (_x13) {
                return _ref22.apply(this, arguments);
              };
            }());

          case 18:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function telegramRouter(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramRouter = telegramRouter;