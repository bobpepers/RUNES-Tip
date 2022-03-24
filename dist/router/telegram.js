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

var _price = _interopRequireDefault(require("../controllers/telegram/price"));

var _executeTips = require("../helpers/client/telegram/executeTips");

var _disallowDirectMessage = require("../helpers/client/telegram/disallowDirectMessage");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var _rateLimit = require("../helpers/rateLimit");

var _group = require("../controllers/telegram/group");

var _user = require("../controllers/telegram/user");

var _referral = require("../controllers/telegram/referral");

var _settings = require("../controllers/telegram/settings");

var _settings2 = _interopRequireDefault(require("../config/settings"));

var settings = (0, _settings2["default"])();
(0, _dotenv.config)();

var _require = require('telegram'),
    Api = _require.Api,
    TelegramClient = _require.TelegramClient;

var _require2 = require('telegram/sessions'),
    StoreSession = _require2.StoreSession;

var storeSession = new StoreSession("telegram_session");
var telegramApiClient = new TelegramClient(storeSession, Number(process.env.TELEGRAM_API_ID), process.env.TELEGRAM_API_HASH, {
  connectionRetries: 5
});
var runesGroup = process.env.TELEGRAM_RUNES_GROUP;

var telegramRouter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(telegramClient, queue, io, settings) {
    var priceCallBack, faucetCallBack, balanceCallBack, infoCallBack, depositCallBack;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.next = 2;
            return telegramApiClient.start({
              botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
              onError: function onError(err) {
                return console.log(err);
              }
            });

          case 2:
            _context35.next = 4;
            return telegramApiClient.session.save();

          case 4:
            _context35.next = 6;
            return telegramApiClient.connect();

          case 6:
            telegramClient.command('help', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
                var maintenance, groupTask;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context2.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context2.next = 5;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 5:
                        _context2.next = 7;
                        return (0, _group.updateGroup)(ctx);

                      case 7:
                        groupTask = _context2.sent;
                        _context2.next = 10;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                          var task;
                          return _regenerator["default"].wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context.sent;

                                case 3:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        })));

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }());

            priceCallBack = /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx) {
                var maintenance, groupTask;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context4.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context4.next = 5;
                          break;
                        }

                        return _context4.abrupt("return");

                      case 5:
                        _context4.next = 7;
                        return (0, _group.updateGroup)(ctx);

                      case 7:
                        groupTask = _context4.sent;
                        _context4.next = 10;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                          var task;
                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return (0, _price["default"])(ctx, io);

                                case 2:
                                  task = _context3.sent;

                                case 3:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        })));

                      case 10:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function priceCallBack(_x6) {
                return _ref4.apply(this, arguments);
              };
            }();

            faucetCallBack = /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ctx) {
                var maintenance, groupTask;
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
                        return (0, _group.updateGroup)(ctx);

                      case 7:
                        groupTask = _context6.sent;
                        _context6.next = 10;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                          var task;
                          return _regenerator["default"].wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  _context5.next = 2;
                                  return (0, _faucet.telegramFaucetClaim)(ctx, io);

                                case 2:
                                  task = _context5.sent;

                                case 3:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5);
                        })));

                      case 10:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function faucetCallBack(_x7) {
                return _ref6.apply(this, arguments);
              };
            }();

            balanceCallBack = /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(ctx) {
                var maintenance, limited, groupTask;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context8.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context8.next = 5;
                          break;
                        }

                        return _context8.abrupt("return");

                      case 5:
                        _context8.next = 7;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Balance');

                      case 7:
                        limited = _context8.sent;

                        if (!limited) {
                          _context8.next = 10;
                          break;
                        }

                        return _context8.abrupt("return");

                      case 10:
                        _context8.next = 12;
                        return (0, _group.updateGroup)(ctx);

                      case 12:
                        groupTask = _context8.sent;
                        _context8.next = 15;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                          var task;
                          return _regenerator["default"].wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  _context7.next = 2;
                                  return (0, _balance.fetchWalletBalance)(ctx, io);

                                case 2:
                                  task = _context7.sent;

                                case 3:
                                case "end":
                                  return _context7.stop();
                              }
                            }
                          }, _callee7);
                        })));

                      case 15:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function balanceCallBack(_x8) {
                return _ref8.apply(this, arguments);
              };
            }();

            infoCallBack = /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(ctx) {
                var maintenance, groupTask;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 2:
                        maintenance = _context10.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context10.next = 5;
                          break;
                        }

                        return _context10.abrupt("return");

                      case 5:
                        _context10.next = 7;
                        return (0, _group.updateGroup)(ctx);

                      case 7:
                        groupTask = _context10.sent;
                        _context10.next = 10;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                          var task;
                          return _regenerator["default"].wrap(function _callee9$(_context9) {
                            while (1) {
                              switch (_context9.prev = _context9.next) {
                                case 0:
                                  _context9.next = 2;
                                  return (0, _info.fetchInfo)(ctx, io);

                                case 2:
                                  task = _context9.sent;

                                case 3:
                                case "end":
                                  return _context9.stop();
                              }
                            }
                          }, _callee9);
                        })));

                      case 10:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function infoCallBack(_x9) {
                return _ref10.apply(this, arguments);
              };
            }();

            depositCallBack = /*#__PURE__*/function () {
              var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(ctx) {
                var maintenance, limited, groupTask;
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
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Deposit');

                      case 7:
                        limited = _context12.sent;

                        if (!limited) {
                          _context12.next = 10;
                          break;
                        }

                        return _context12.abrupt("return");

                      case 10:
                        _context12.next = 12;
                        return (0, _group.updateGroup)(ctx);

                      case 12:
                        groupTask = _context12.sent;
                        _context12.next = 15;
                        return queue.add(function () {
                          return groupTask;
                        });

                      case 15:
                        _context12.next = 17;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
                          var task;
                          return _regenerator["default"].wrap(function _callee11$(_context11) {
                            while (1) {
                              switch (_context11.prev = _context11.next) {
                                case 0:
                                  _context11.next = 2;
                                  return (0, _deposit.fetchWalletDepositAddress)(ctx, io);

                                case 2:
                                  task = _context11.sent;

                                case 3:
                                case "end":
                                  return _context11.stop();
                              }
                            }
                          }, _callee11);
                        })));

                      case 17:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function depositCallBack(_x10) {
                return _ref12.apply(this, arguments);
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
                var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(ctx) {
                  var maintenance, groupTask, telegramUserId, telegramUserName, task;
                  return _regenerator["default"].wrap(function _callee13$(_context13) {
                    while (1) {
                      switch (_context13.prev = _context13.next) {
                        case 0:
                          _context13.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context13.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context13.next = 5;
                            break;
                          }

                          return _context13.abrupt("return");

                        case 5:
                          _context13.next = 7;
                          return (0, _group.updateGroup)(ctx);

                        case 7:
                          groupTask = _context13.sent;
                          _context13.next = 10;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 10:
                          telegramUserId = ctx.update.message.from.id;
                          telegramUserName = ctx.update.message.from.username;
                          _context13.next = 14;
                          return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                        case 14:
                          task = _context13.sent;
                          _context13.next = 17;
                          return queue.add(function () {
                            return task;
                          });

                        case 17:
                        case "end":
                          return _context13.stop();
                      }
                    }
                  }, _callee13);
                }));

                return function (_x11) {
                  return _ref14.apply(this, arguments);
                };
              }());
              telegramClient.action('referral', /*#__PURE__*/function () {
                var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(ctx) {
                  var maintenance, groupTask, telegramUserId, telegramUserName, task;
                  return _regenerator["default"].wrap(function _callee14$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          _context14.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context14.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context14.next = 5;
                            break;
                          }

                          return _context14.abrupt("return");

                        case 5:
                          _context14.next = 7;
                          return (0, _group.updateGroup)(ctx);

                        case 7:
                          groupTask = _context14.sent;
                          _context14.next = 10;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 10:
                          telegramUserId = ctx.update.callback_query.from.id;
                          telegramUserName = ctx.update.callback_query.from.username;
                          _context14.next = 14;
                          return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                        case 14:
                          task = _context14.sent;
                          _context14.next = 17;
                          return queue.add(function () {
                            return task;
                          });

                        case 17:
                        case "end":
                          return _context14.stop();
                      }
                    }
                  }, _callee14);
                }));

                return function (_x12) {
                  return _ref15.apply(this, arguments);
                };
              }());
              telegramClient.command('top', /*#__PURE__*/function () {
                var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(ctx) {
                  var maintenance, groupTask, task;
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
                          return (0, _group.updateGroup)(ctx);

                        case 7:
                          groupTask = _context15.sent;
                          _context15.next = 10;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 10:
                          _context15.next = 12;
                          return (0, _referral.fetchReferralTopTen)(ctx);

                        case 12:
                          task = _context15.sent;
                          _context15.next = 15;
                          return queue.add(function () {
                            return task;
                          });

                        case 15:
                        case "end":
                          return _context15.stop();
                      }
                    }
                  }, _callee15);
                }));

                return function (_x13) {
                  return _ref16.apply(this, arguments);
                };
              }());
              telegramClient.action('ReferralTop', /*#__PURE__*/function () {
                var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(ctx) {
                  var maintenance, groupTask, task;
                  return _regenerator["default"].wrap(function _callee16$(_context16) {
                    while (1) {
                      switch (_context16.prev = _context16.next) {
                        case 0:
                          _context16.next = 2;
                          return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                        case 2:
                          maintenance = _context16.sent;

                          if (!(maintenance.maintenance || !maintenance.enabled)) {
                            _context16.next = 5;
                            break;
                          }

                          return _context16.abrupt("return");

                        case 5:
                          _context16.next = 7;
                          return (0, _group.updateGroup)(ctx);

                        case 7:
                          groupTask = _context16.sent;
                          _context16.next = 10;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 10:
                          _context16.next = 12;
                          return (0, _referral.fetchReferralTopTen)(ctx);

                        case 12:
                          task = _context16.sent;
                          _context16.next = 15;
                          return queue.add(function () {
                            return task;
                          });

                        case 15:
                        case "end":
                          return _context16.stop();
                      }
                    }
                  }, _callee16);
                }));

                return function (_x14) {
                  return _ref17.apply(this, arguments);
                };
              }());
            }

            telegramClient.on('new_chat_members', /*#__PURE__*/function () {
              var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(ctx) {
                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
                          var groupTask, task;
                          return _regenerator["default"].wrap(function _callee17$(_context17) {
                            while (1) {
                              switch (_context17.prev = _context17.next) {
                                case 0:
                                  _context17.next = 2;
                                  return (0, _group.updateGroup)(ctx);

                                case 2:
                                  groupTask = _context17.sent;
                                  _context17.next = 5;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 5:
                                  task = _context17.sent;

                                case 6:
                                case "end":
                                  return _context17.stop();
                              }
                            }
                          }, _callee17);
                        })));

                      case 2:
                        if (!(settings.coin.setting === 'Runebase')) {
                          _context19.next = 6;
                          break;
                        }

                        if (!(ctx.update.message.chat.id === Number(runesGroup))) {
                          _context19.next = 6;
                          break;
                        }

                        _context19.next = 6;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
                          var task;
                          return _regenerator["default"].wrap(function _callee18$(_context18) {
                            while (1) {
                              switch (_context18.prev = _context18.next) {
                                case 0:
                                  _context18.next = 2;
                                  return (0, _referral.createReferral)(ctx, telegramClient, runesGroup);

                                case 2:
                                  task = _context18.sent;

                                case 3:
                                case "end":
                                  return _context18.stop();
                              }
                            }
                          }, _callee18);
                        })));

                      case 6:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              }));

              return function (_x15) {
                return _ref18.apply(this, arguments);
              };
            }());
            telegramClient.on('text', /*#__PURE__*/function () {
              var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(ctx) {
                var lastSeen, preFilteredMessageTelegram, filteredMessageTelegram, telegramUserId, telegramUserName, disallow, maintenance, groupTask, groupTaskId, faucetSetting, limited, _limited, _limited2, _limited3, _limited4, _limited5, _limited6, _limited7, setting, _limited8, _setting, _limited9, _setting2, _limited10, _setting3, _limited11, _setting4;

                return _regenerator["default"].wrap(function _callee34$(_context34) {
                  while (1) {
                    switch (_context34.prev = _context34.next) {
                      case 0:
                        _context34.next = 2;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
                          return _regenerator["default"].wrap(function _callee20$(_context20) {
                            while (1) {
                              switch (_context20.prev = _context20.next) {
                                case 0:
                                  _context20.next = 2;
                                  return (0, _user.createUpdateUser)(ctx);

                                case 2:
                                  _context20.next = 4;
                                  return (0, _user.updateLastSeen)(ctx);

                                case 4:
                                  lastSeen = _context20.sent;

                                case 5:
                                case "end":
                                  return _context20.stop();
                              }
                            }
                          }, _callee20);
                        })));

                      case 2:
                        preFilteredMessageTelegram = ctx.update.message.text.split(' ');
                        filteredMessageTelegram = preFilteredMessageTelegram.filter(function (el) {
                          return el !== '';
                        });
                        telegramUserId = ctx.update.message.from.id;
                        telegramUserName = ctx.update.message.from.username;

                        if (!(filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram)) {
                          _context34.next = 179;
                          break;
                        }

                        _context34.next = 9;
                        return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

                      case 9:
                        maintenance = _context34.sent;

                        if (!(maintenance.maintenance || !maintenance.enabled)) {
                          _context34.next = 12;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 12:
                        _context34.next = 14;
                        return (0, _group.updateGroup)(ctx);

                      case 14:
                        groupTask = _context34.sent;
                        groupTaskId = groupTask && groupTask.id;
                        _context34.next = 18;
                        return (0, _settings.telegramWaterFaucetSettings)(groupTaskId);

                      case 18:
                        faucetSetting = _context34.sent;

                        if (faucetSetting) {
                          _context34.next = 21;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 21:
                        if (filteredMessageTelegram[1]) {
                          _context34.next = 30;
                          break;
                        }

                        _context34.next = 24;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 24:
                        limited = _context34.sent;

                        if (!limited) {
                          _context34.next = 27;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 27:
                        _context34.next = 29;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
                          var task;
                          return _regenerator["default"].wrap(function _callee21$(_context21) {
                            while (1) {
                              switch (_context21.prev = _context21.next) {
                                case 0:
                                  _context21.next = 2;
                                  return (0, _help.fetchHelp)(ctx, io);

                                case 2:
                                  task = _context21.sent;

                                case 3:
                                case "end":
                                  return _context21.stop();
                              }
                            }
                          }, _callee21);
                        })));

                      case 29:
                        return _context34.abrupt("return");

                      case 30:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'help')) {
                          _context34.next = 39;
                          break;
                        }

                        _context34.next = 33;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Help');

                      case 33:
                        _limited = _context34.sent;

                        if (!_limited) {
                          _context34.next = 36;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 36:
                        _context34.next = 38;
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

                      case 38:
                        return _context34.abrupt("return");

                      case 39:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'price')) {
                          _context34.next = 48;
                          break;
                        }

                        _context34.next = 42;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Price');

                      case 42:
                        _limited2 = _context34.sent;

                        if (!_limited2) {
                          _context34.next = 45;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 45:
                        _context34.next = 47;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23() {
                          var task;
                          return _regenerator["default"].wrap(function _callee23$(_context23) {
                            while (1) {
                              switch (_context23.prev = _context23.next) {
                                case 0:
                                  _context23.next = 2;
                                  return (0, _price["default"])(ctx, io);

                                case 2:
                                  task = _context23.sent;

                                case 3:
                                case "end":
                                  return _context23.stop();
                              }
                            }
                          }, _callee23);
                        })));

                      case 47:
                        return _context34.abrupt("return");

                      case 48:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'info')) {
                          _context34.next = 57;
                          break;
                        }

                        _context34.next = 51;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Info');

                      case 51:
                        _limited3 = _context34.sent;

                        if (!_limited3) {
                          _context34.next = 54;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 54:
                        _context34.next = 56;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24() {
                          var task;
                          return _regenerator["default"].wrap(function _callee24$(_context24) {
                            while (1) {
                              switch (_context24.prev = _context24.next) {
                                case 0:
                                  _context24.next = 2;
                                  return (0, _info.fetchInfo)(ctx, io);

                                case 2:
                                  task = _context24.sent;

                                case 3:
                                case "end":
                                  return _context24.stop();
                              }
                            }
                          }, _callee24);
                        })));

                      case 56:
                        return _context34.abrupt("return");

                      case 57:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'faucet')) {
                          _context34.next = 66;
                          break;
                        }

                        _context34.next = 60;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Faucet');

                      case 60:
                        _limited4 = _context34.sent;

                        if (!_limited4) {
                          _context34.next = 63;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 63:
                        _context34.next = 65;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25() {
                          var task;
                          return _regenerator["default"].wrap(function _callee25$(_context25) {
                            while (1) {
                              switch (_context25.prev = _context25.next) {
                                case 0:
                                  _context25.next = 2;
                                  return (0, _faucet.telegramFaucetClaim)(ctx, io);

                                case 2:
                                  task = _context25.sent;

                                case 3:
                                case "end":
                                  return _context25.stop();
                              }
                            }
                          }, _callee25);
                        })));

                      case 65:
                        return _context34.abrupt("return");

                      case 66:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'balance')) {
                          _context34.next = 75;
                          break;
                        }

                        _context34.next = 69;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Balance');

                      case 69:
                        _limited5 = _context34.sent;

                        if (!_limited5) {
                          _context34.next = 72;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 72:
                        _context34.next = 74;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26() {
                          var task;
                          return _regenerator["default"].wrap(function _callee26$(_context26) {
                            while (1) {
                              switch (_context26.prev = _context26.next) {
                                case 0:
                                  _context26.next = 2;
                                  return (0, _balance.fetchWalletBalance)(ctx, io);

                                case 2:
                                  task = _context26.sent;

                                case 3:
                                case "end":
                                  return _context26.stop();
                              }
                            }
                          }, _callee26);
                        })));

                      case 74:
                        return _context34.abrupt("return");

                      case 75:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'deposit')) {
                          _context34.next = 84;
                          break;
                        }

                        _context34.next = 78;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Deposit');

                      case 78:
                        _limited6 = _context34.sent;

                        if (!_limited6) {
                          _context34.next = 81;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 81:
                        _context34.next = 83;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                          var task;
                          return _regenerator["default"].wrap(function _callee27$(_context27) {
                            while (1) {
                              switch (_context27.prev = _context27.next) {
                                case 0:
                                  _context27.next = 2;
                                  return (0, _deposit.fetchWalletDepositAddress)(ctx, io);

                                case 2:
                                  task = _context27.sent;

                                case 3:
                                case "end":
                                  return _context27.stop();
                              }
                            }
                          }, _callee27);
                        })));

                      case 83:
                        return _context34.abrupt("return");

                      case 84:
                        if (!(settings.coin.setting === 'Runebase')) {
                          _context34.next = 91;
                          break;
                        }

                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2])) {
                          _context34.next = 88;
                          break;
                        }

                        _context34.next = 88;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28() {
                          var task;
                          return _regenerator["default"].wrap(function _callee28$(_context28) {
                            while (1) {
                              switch (_context28.prev = _context28.next) {
                                case 0:
                                  _context28.next = 2;
                                  return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

                                case 2:
                                  task = _context28.sent;

                                case 3:
                                case "end":
                                  return _context28.stop();
                              }
                            }
                          }, _callee28);
                        })));

                      case 88:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top')) {
                          _context34.next = 91;
                          break;
                        }

                        _context34.next = 91;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29() {
                          var task;
                          return _regenerator["default"].wrap(function _callee29$(_context29) {
                            while (1) {
                              switch (_context29.prev = _context29.next) {
                                case 0:
                                  _context29.next = 2;
                                  return (0, _referral.fetchReferralTopTen)(ctx);

                                case 2:
                                  task = _context29.sent;

                                case 3:
                                case "end":
                                  return _context29.stop();
                              }
                            }
                          }, _callee29);
                        })));

                      case 91:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'flood')) {
                          _context34.next = 109;
                          break;
                        }

                        _context34.next = 94;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Flood');

                      case 94:
                        _limited7 = _context34.sent;

                        if (!_limited7) {
                          _context34.next = 97;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 97:
                        _context34.next = 99;
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

                      case 99:
                        if (!disallow) {
                          _context34.next = 101;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 101:
                        _context34.next = 103;
                        return (0, _settings.telegramSettings)(ctx, 'flood', groupTaskId);

                      case 103:
                        setting = _context34.sent;

                        if (setting) {
                          _context34.next = 106;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 106:
                        _context34.next = 108;
                        return (0, _executeTips.executeTipFunction)(_flood.telegramFlood, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, setting, faucetSetting);

                      case 108:
                        return _context34.abrupt("return");

                      case 109:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'sleet')) {
                          _context34.next = 127;
                          break;
                        }

                        _context34.next = 112;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Sleet');

                      case 112:
                        _limited8 = _context34.sent;

                        if (!_limited8) {
                          _context34.next = 115;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 115:
                        _context34.next = 117;
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

                      case 117:
                        if (!disallow) {
                          _context34.next = 119;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 119:
                        _context34.next = 121;
                        return (0, _settings.telegramSettings)(ctx, 'sleet', groupTaskId);

                      case 121:
                        _setting = _context34.sent;

                        if (_setting) {
                          _context34.next = 124;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 124:
                        _context34.next = 126;
                        return (0, _executeTips.executeTipFunction)(_sleet.telegramSleet, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting, faucetSetting);

                      case 126:
                        return _context34.abrupt("return");

                      case 127:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'rain')) {
                          _context34.next = 145;
                          break;
                        }

                        _context34.next = 130;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Rain');

                      case 130:
                        _limited9 = _context34.sent;

                        if (!_limited9) {
                          _context34.next = 133;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 133:
                        _context34.next = 135;
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

                      case 135:
                        if (!disallow) {
                          _context34.next = 137;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 137:
                        _context34.next = 139;
                        return (0, _settings.telegramSettings)(ctx, 'rain', groupTaskId);

                      case 139:
                        _setting2 = _context34.sent;

                        if (_setting2) {
                          _context34.next = 142;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 142:
                        _context34.next = 144;
                        return (0, _executeTips.executeTipFunction)(_rain.telegramRain, queue, filteredMessageTelegram[2], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting2, faucetSetting);

                      case 144:
                        return _context34.abrupt("return");

                      case 145:
                        if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1].toLowerCase() === 'withdraw')) {
                          _context34.next = 159;
                          break;
                        }

                        _context34.next = 148;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Rain');

                      case 148:
                        _limited10 = _context34.sent;

                        if (!_limited10) {
                          _context34.next = 151;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 151:
                        _context34.next = 153;
                        return (0, _settings.telegramSettings)(ctx, 'rain', groupTaskId);

                      case 153:
                        _setting3 = _context34.sent;

                        if (_setting3) {
                          _context34.next = 156;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 156:
                        _context34.next = 158;
                        return (0, _executeTips.executeTipFunction)(_withdraw.withdrawTelegramCreate, queue, filteredMessageTelegram[3], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting3, faucetSetting);

                      case 158:
                        return _context34.abrupt("return");

                      case 159:
                        console.log(ctx);
                        console.log(ctx.update.message.entities);
                        console.log(filteredMessageTelegram);

                        if (!(filteredMessageTelegram[1] && ctx.update && ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.length > 0)) {
                          _context34.next = 179;
                          break;
                        }

                        _context34.next = 165;
                        return (0, _rateLimit.myRateLimiter)(telegramClient, ctx, 'telegram', 'Tip');

                      case 165:
                        _limited11 = _context34.sent;

                        if (!_limited11) {
                          _context34.next = 168;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 168:
                        _context34.next = 170;
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

                      case 170:
                        if (!disallow) {
                          _context34.next = 172;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 172:
                        _context34.next = 174;
                        return (0, _settings.telegramSettings)(ctx, 'tip', groupTaskId);

                      case 174:
                        _setting4 = _context34.sent;

                        if (_setting4) {
                          _context34.next = 177;
                          break;
                        }

                        return _context34.abrupt("return");

                      case 177:
                        _context34.next = 179;
                        return (0, _executeTips.executeTipFunction)(_tip.tipToTelegramUser, queue, filteredMessageTelegram[ctx.update.message.entities.length + 1], telegramClient, telegramApiClient, ctx, filteredMessageTelegram, io, groupTask, _setting4, faucetSetting);

                      case 179:
                      case "end":
                        return _context34.stop();
                    }
                  }
                }, _callee34);
              }));

              return function (_x16) {
                return _ref21.apply(this, arguments);
              };
            }());

          case 25:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function telegramRouter(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.telegramRouter = telegramRouter;