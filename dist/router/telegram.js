"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telegramRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = require("dotenv");

var _balance = require("../controllers/telegram/balance");

var _deposit = require("../controllers/telegram/deposit");

var _withdraw = require("../controllers/telegram/withdraw");

var _tip = require("../controllers/telegram/tip");

var _rain = require("../controllers/telegram/rain");

var _user = require("../controllers/telegram/user");

var _group = require("../controllers/telegram/group");

var _help = require("../controllers/telegram/help");

var _faucet = require("../controllers/telegram/faucet");

var _referral = require("../controllers/telegram/referral");

var _price = _interopRequireDefault(require("../controllers/telegram/price"));

var _info = require("../controllers/telegram/info");

var _settings = _interopRequireDefault(require("../config/settings"));

var _settings2 = require("../controllers/telegram/settings");

var _isMaintenanceOrDisabled = require("../helpers/isMaintenanceOrDisabled");

var settings = (0, _settings["default"])(); // import logger from "../helpers/logger";

(0, _dotenv.config)();
var runesGroup = process.env.TELEGRAM_RUNES_GROUP;

var telegramRouter = function telegramRouter(telegramClient, queue, io, settings) {
  telegramClient.command('help', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var maintenance, task;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context.sent;
              _context.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return");

            case 7:
              _context.next = 9;
              return (0, _help.fetchHelp)(ctx, io);

            case 9:
              task = _context.sent;
              _context.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  });
  telegramClient.command('price', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var maintenance, groupTask, task;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context2.sent;
              _context2.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return");

            case 7:
              _context2.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context2.sent;
              _context2.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              _context2.next = 14;
              return (0, _price["default"])(ctx, io);

            case 14:
              task = _context2.sent;
              _context2.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  });
  telegramClient.action('Price', function (ctx) {
    console.log(ctx);
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var maintenance, task;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context3.sent;
              _context3.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return");

            case 7:
              _context3.next = 9;
              return (0, _price["default"])(ctx, io);

            case 9:
              task = _context3.sent;
              _context3.next = 12;
              return queue.add(function () {
                return task;
              });

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  });
  telegramClient.command('faucet', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var maintenance, groupTask, task;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context4.sent;
              _context4.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context4.next = 7;
                break;
              }

              return _context4.abrupt("return");

            case 7:
              _context4.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context4.sent;
              _context4.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              _context4.next = 14;
              return (0, _faucet.telegramFaucetClaim)(ctx, io);

            case 14:
              task = _context4.sent;
              _context4.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  });
  telegramClient.command('Faucet', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var maintenance, groupTask, task;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context5.sent;
              _context5.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context5.next = 7;
                break;
              }

              return _context5.abrupt("return");

            case 7:
              _context5.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context5.sent;
              _context5.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              _context5.next = 14;
              return (0, _faucet.telegramFaucetClaim)(ctx, io);

            case 14:
              task = _context5.sent;
              _context5.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  });
  telegramClient.command('info', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var maintenance, groupTask, task;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context6.sent;
              _context6.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context6.next = 7;
                break;
              }

              return _context6.abrupt("return");

            case 7:
              _context6.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context6.sent;
              _context6.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              _context6.next = 14;
              return (0, _info.fetchInfo)(ctx);

            case 14:
              task = _context6.sent;
              _context6.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }))();
  });
  telegramClient.action('Info', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var maintenance, groupTask, task;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context7.sent;
              _context7.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context7.next = 7;
                break;
              }

              return _context7.abrupt("return");

            case 7:
              _context7.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context7.sent;
              _context7.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              _context7.next = 14;
              return (0, _info.fetchInfo)(ctx);

            case 14:
              task = _context7.sent;
              _context7.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  });
  telegramClient.command('balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context8.sent;
              _context8.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context8.next = 7;
                break;
              }

              return _context8.abrupt("return");

            case 7:
              _context8.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context8.sent;
              _context8.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context8.next = 16;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context8.sent;
              _context8.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }))();
  });
  telegramClient.action('Balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context9.sent;
              _context9.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context9.next = 7;
                break;
              }

              return _context9.abrupt("return");

            case 7:
              _context9.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context9.sent;
              _context9.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context9.next = 16;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context9.sent;
              _context9.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }))();
  });
  telegramClient.command('tip', /*#__PURE__*/function () {
    var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(ctx) {
      var maintenance, filteredMessageTelegram;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context11.sent;
              _context11.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context11.next = 7;
                break;
              }

              return _context11.abrupt("return");

            case 7:
              filteredMessageTelegram = ctx.update.message.text.split(' ');

              if (!filteredMessageTelegram[1]) {
                ctx.reply('insufficient Arguments');
              }

              if (!filteredMessageTelegram[2]) {
                ctx.reply('insufficient Arguments');
              }

              if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
                (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                  var groupTask, groupTaskId, setting, tipAmount, tipTo, task;
                  return _regenerator["default"].wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          _context10.next = 2;
                          return (0, _group.updateGroup)(ctx);

                        case 2:
                          groupTask = _context10.sent;
                          _context10.next = 5;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 5:
                          groupTaskId = groupTask && groupTask.id;
                          _context10.next = 8;
                          return (0, _settings2.telegramSettings)(ctx, 'tip', groupTaskId);

                        case 8:
                          setting = _context10.sent;
                          _context10.next = 11;
                          return queue.add(function () {
                            return setting;
                          });

                        case 11:
                          if (setting) {
                            _context10.next = 13;
                            break;
                          }

                          return _context10.abrupt("return");

                        case 13:
                          tipAmount = filteredMessageTelegram[2];
                          tipTo = filteredMessageTelegram[1];

                          if (!groupTask) {
                            _context10.next = 21;
                            break;
                          }

                          _context10.next = 18;
                          return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask, setting);

                        case 18:
                          task = _context10.sent;
                          _context10.next = 21;
                          return queue.add(function () {
                            return task;
                          });

                        case 21:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }))();
              }

            case 11:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x) {
      return _ref10.apply(this, arguments);
    };
  }());
  telegramClient.command('rain', /*#__PURE__*/function () {
    var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(ctx) {
      var maintenance, filteredMessageTelegram;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context13.sent;
              _context13.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context13.next = 7;
                break;
              }

              return _context13.abrupt("return");

            case 7:
              filteredMessageTelegram = ctx.update.message.text.split(' ');

              if (!filteredMessageTelegram[1]) {
                ctx.reply('invalid amount of arguments');
              }

              if (filteredMessageTelegram[1]) {
                (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                  var groupTask, groupTaskId, setting, rainAmount, task;
                  return _regenerator["default"].wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          _context12.next = 2;
                          return (0, _group.updateGroup)(ctx);

                        case 2:
                          groupTask = _context12.sent;
                          _context12.next = 5;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 5:
                          groupTaskId = groupTask && groupTask.id;
                          _context12.next = 8;
                          return (0, _settings2.telegramSettings)(ctx, 'rain', groupTaskId);

                        case 8:
                          setting = _context12.sent;
                          _context12.next = 11;
                          return queue.add(function () {
                            return setting;
                          });

                        case 11:
                          if (setting) {
                            _context12.next = 13;
                            break;
                          }

                          return _context12.abrupt("return");

                        case 13:
                          console.log(setting);
                          rainAmount = filteredMessageTelegram[1];
                          _context12.next = 17;
                          return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io, setting);

                        case 17:
                          task = _context12.sent;
                          _context12.next = 20;
                          return queue.add(function () {
                            return task;
                          });

                        case 20:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }))();
              }

            case 10:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x2) {
      return _ref12.apply(this, arguments);
    };
  }());
  telegramClient.command('deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context14.sent;
              _context14.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context14.next = 7;
                break;
              }

              return _context14.abrupt("return");

            case 7:
              _context14.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context14.sent;
              _context14.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context14.next = 16;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context14.sent;
              _context14.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }))();
  });
  telegramClient.action('Deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context15.sent;
              _context15.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context15.next = 7;
                break;
              }

              return _context15.abrupt("return");

            case 7:
              _context15.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context15.sent;
              _context15.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context15.next = 16;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context15.sent;
              _context15.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }))();
  });
  telegramClient.command('withdraw', /*#__PURE__*/function () {
    var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(ctx) {
      var maintenance, filteredMessageTelegram, groupTask, groupTaskId, setting, withdrawalAddress, withdrawalAmount, task;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context16.sent;
              _context16.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context16.next = 7;
                break;
              }

              return _context16.abrupt("return");

            case 7:
              filteredMessageTelegram = ctx.update.message.text.split(' ');

              if (filteredMessageTelegram[1]) {
                _context16.next = 11;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context16.abrupt("return");

            case 11:
              if (filteredMessageTelegram[2]) {
                _context16.next = 14;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context16.abrupt("return");

            case 14:
              _context16.next = 16;
              return (0, _group.updateGroup)(ctx);

            case 16:
              groupTask = _context16.sent;
              _context16.next = 19;
              return queue.add(function () {
                return groupTask;
              });

            case 19:
              groupTaskId = groupTask && groupTask.id;
              _context16.next = 22;
              return (0, _settings2.telegramSettings)(ctx, 'withdraw', groupTaskId);

            case 22:
              setting = _context16.sent;
              _context16.next = 25;
              return queue.add(function () {
                return setting;
              });

            case 25:
              if (setting) {
                _context16.next = 27;
                break;
              }

              return _context16.abrupt("return");

            case 27:
              withdrawalAddress = filteredMessageTelegram[1];
              withdrawalAmount = filteredMessageTelegram[2];
              console.log('before withdrawal create');
              _context16.next = 32;
              return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io, setting);

            case 32:
              task = _context16.sent;
              _context16.next = 35;
              return queue.add(function () {
                return task;
              });

            case 35:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x3) {
      return _ref16.apply(this, arguments);
    };
  }());

  if (settings.coin.setting === 'Runebase') {
    telegramClient.command('referral', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var maintenance, groupTask, telegramUserId, telegramUserName, task;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

              case 2:
                maintenance = _context17.sent;
                _context17.next = 5;
                return queue.add(function () {
                  return maintenance;
                });

              case 5:
                if (!(maintenance.maintenance || !maintenance.enabled)) {
                  _context17.next = 7;
                  break;
                }

                return _context17.abrupt("return");

              case 7:
                _context17.next = 9;
                return (0, _group.updateGroup)(ctx);

              case 9:
                groupTask = _context17.sent;
                _context17.next = 12;
                return queue.add(function () {
                  return groupTask;
                });

              case 12:
                telegramUserId = ctx.update.message.from.id;
                telegramUserName = ctx.update.message.from.username;
                _context17.next = 16;
                return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

              case 16:
                task = _context17.sent;
                _context17.next = 19;
                return queue.add(function () {
                  return task;
                });

              case 19:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }))();
    });
    telegramClient.action('Referral', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        var maintenance, groupTask, telegramUserId, telegramUserName, task;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

              case 2:
                maintenance = _context18.sent;
                _context18.next = 5;
                return queue.add(function () {
                  return maintenance;
                });

              case 5:
                if (!(maintenance.maintenance || !maintenance.enabled)) {
                  _context18.next = 7;
                  break;
                }

                return _context18.abrupt("return");

              case 7:
                _context18.next = 9;
                return (0, _group.updateGroup)(ctx);

              case 9:
                groupTask = _context18.sent;
                _context18.next = 12;
                return queue.add(function () {
                  return groupTask;
                });

              case 12:
                telegramUserId = ctx.update.callback_query.from.id;
                telegramUserName = ctx.update.callback_query.from.username;
                _context18.next = 16;
                return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

              case 16:
                task = _context18.sent;
                _context18.next = 19;
                return queue.add(function () {
                  return task;
                });

              case 19:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }))();
    });
    telegramClient.command('top', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
        var maintenance, groupTask, task;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

              case 2:
                maintenance = _context19.sent;
                _context19.next = 5;
                return queue.add(function () {
                  return maintenance;
                });

              case 5:
                if (!(maintenance.maintenance || !maintenance.enabled)) {
                  _context19.next = 7;
                  break;
                }

                return _context19.abrupt("return");

              case 7:
                _context19.next = 9;
                return (0, _group.updateGroup)(ctx);

              case 9:
                groupTask = _context19.sent;
                _context19.next = 12;
                return queue.add(function () {
                  return groupTask;
                });

              case 12:
                _context19.next = 14;
                return (0, _referral.fetchReferralTopTen)(ctx);

              case 14:
                task = _context19.sent;
                _context19.next = 17;
                return queue.add(function () {
                  return task;
                });

              case 17:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19);
      }))();
    });
    telegramClient.action('ReferralTop', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
        var maintenance, groupTask, task;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

              case 2:
                maintenance = _context20.sent;
                _context20.next = 5;
                return queue.add(function () {
                  return maintenance;
                });

              case 5:
                if (!(maintenance.maintenance || !maintenance.enabled)) {
                  _context20.next = 7;
                  break;
                }

                return _context20.abrupt("return");

              case 7:
                _context20.next = 9;
                return (0, _group.updateGroup)(ctx);

              case 9:
                groupTask = _context20.sent;
                _context20.next = 12;
                return queue.add(function () {
                  return groupTask;
                });

              case 12:
                _context20.next = 14;
                return (0, _referral.fetchReferralTopTen)(ctx);

              case 14:
                task = _context20.sent;
                _context20.next = 17;
                return queue.add(function () {
                  return task;
                });

              case 17:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20);
      }))();
    });
  }

  telegramClient.on('new_chat_members', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
      var groupTask, task, taskReferred;
      return _regenerator["default"].wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context21.sent;
              _context21.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context21.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context21.sent;
              _context21.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              if (!(settings.coin.setting === 'Runebase')) {
                _context21.next = 17;
                break;
              }

              if (!(ctx.update.message.chat.id === Number(runesGroup))) {
                _context21.next = 17;
                break;
              }

              _context21.next = 14;
              return (0, _referral.createReferral)(ctx, telegramClient, runesGroup);

            case 14:
              taskReferred = _context21.sent;
              _context21.next = 17;
              return queue.add(function () {
                return taskReferred;
              });

            case 17:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }))();
  });
  telegramClient.on('text', /*#__PURE__*/function () {
    var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(ctx) {
      var groupTask, task, lastSeenTask, preFilteredMessageTelegram, filteredMessageTelegram, telegramUserId, telegramUserName, maintenance, _task, _task2, _task3, _task4, _task5, _task6, _task7, _task8, _task9, _groupTask, groupTaskId, setting, withdrawalAddress, withdrawalAmount, _task10, _groupTask2, _groupTaskId, _setting, tipAmount, tipTo, _task11, _groupTask3, _groupTaskId2, _setting2, rainAmount, _task12;

      return _regenerator["default"].wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context22.sent;
              _context22.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context22.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context22.sent;
              _context22.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              _context22.next = 12;
              return (0, _user.updateLastSeen)(ctx);

            case 12:
              lastSeenTask = _context22.sent;
              _context22.next = 15;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 15:
              preFilteredMessageTelegram = ctx.update.message.text.split(' ');
              filteredMessageTelegram = preFilteredMessageTelegram.filter(function (el) {
                return el !== '';
              });
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username; // console.log(filteredMessageTelegram);

              if (!(filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram)) {
                _context22.next = 160;
                break;
              }

              _context22.next = 22;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 22:
              maintenance = _context22.sent;
              _context22.next = 25;
              return queue.add(function () {
                return maintenance;
              });

            case 25:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context22.next = 27;
                break;
              }

              return _context22.abrupt("return");

            case 27:
              if (filteredMessageTelegram[1]) {
                _context22.next = 33;
                break;
              }

              _context22.next = 30;
              return (0, _help.fetchHelp)(ctx, io);

            case 30:
              _task = _context22.sent;
              _context22.next = 33;
              return queue.add(function () {
                return _task;
              });

            case 33:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'price')) {
                _context22.next = 39;
                break;
              }

              _context22.next = 36;
              return (0, _price["default"])(ctx, io);

            case 36:
              _task2 = _context22.sent;
              _context22.next = 39;
              return queue.add(function () {
                return _task2;
              });

            case 39:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'info')) {
                _context22.next = 45;
                break;
              }

              _context22.next = 42;
              return (0, _info.fetchInfo)(ctx);

            case 42:
              _task3 = _context22.sent;
              _context22.next = 45;
              return queue.add(function () {
                return _task3;
              });

            case 45:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'help')) {
                _context22.next = 51;
                break;
              }

              _context22.next = 48;
              return (0, _help.fetchHelp)(ctx, io);

            case 48:
              _task4 = _context22.sent;
              _context22.next = 51;
              return queue.add(function () {
                return _task4;
              });

            case 51:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'faucet')) {
                _context22.next = 57;
                break;
              }

              _context22.next = 54;
              return (0, _faucet.telegramFaucetClaim)(ctx, io);

            case 54:
              _task5 = _context22.sent;
              _context22.next = 57;
              return queue.add(function () {
                return _task5;
              });

            case 57:
              if (!(settings.coin.setting === 'Runebase')) {
                _context22.next = 70;
                break;
              }

              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2])) {
                _context22.next = 64;
                break;
              }

              _context22.next = 61;
              return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

            case 61:
              _task6 = _context22.sent;
              _context22.next = 64;
              return queue.add(function () {
                return _task6;
              });

            case 64:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top')) {
                _context22.next = 70;
                break;
              }

              _context22.next = 67;
              return (0, _referral.fetchReferralTopTen)(ctx);

            case 67:
              _task7 = _context22.sent;
              _context22.next = 70;
              return queue.add(function () {
                return _task7;
              });

            case 70:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'balance')) {
                _context22.next = 76;
                break;
              }

              _context22.next = 73;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 73:
              _task8 = _context22.sent;
              _context22.next = 76;
              return queue.add(function () {
                return _task8;
              });

            case 76:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'deposit')) {
                _context22.next = 82;
                break;
              }

              _context22.next = 79;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 79:
              _task9 = _context22.sent;
              _context22.next = 82;
              return queue.add(function () {
                return _task9;
              });

            case 82:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'withdraw')) {
                _context22.next = 109;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context22.next = 86;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context22.abrupt("return");

            case 86:
              if (filteredMessageTelegram[3]) {
                _context22.next = 89;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context22.abrupt("return");

            case 89:
              _context22.next = 91;
              return (0, _group.updateGroup)(ctx);

            case 91:
              _groupTask = _context22.sent;
              _context22.next = 94;
              return queue.add(function () {
                return _groupTask;
              });

            case 94:
              groupTaskId = _groupTask && _groupTask.id;
              _context22.next = 97;
              return (0, _settings2.telegramSettings)(ctx, 'withdraw', groupTaskId);

            case 97:
              setting = _context22.sent;
              _context22.next = 100;
              return queue.add(function () {
                return setting;
              });

            case 100:
              if (setting) {
                _context22.next = 102;
                break;
              }

              return _context22.abrupt("return");

            case 102:
              withdrawalAddress = filteredMessageTelegram[2];
              withdrawalAmount = filteredMessageTelegram[3];
              _context22.next = 106;
              return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io, setting);

            case 106:
              _task10 = _context22.sent;
              _context22.next = 109;
              return queue.add(function () {
                return _task10;
              });

            case 109:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'tip')) {
                _context22.next = 137;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context22.next = 113;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context22.abrupt("return");

            case 113:
              if (filteredMessageTelegram[3]) {
                _context22.next = 116;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context22.abrupt("return");

            case 116:
              _context22.next = 118;
              return (0, _group.updateGroup)(ctx);

            case 118:
              _groupTask2 = _context22.sent;
              _context22.next = 121;
              return queue.add(function () {
                return _groupTask2;
              });

            case 121:
              _groupTaskId = _groupTask2 && _groupTask2.id;
              _context22.next = 124;
              return (0, _settings2.telegramSettings)(ctx, 'tip', _groupTaskId);

            case 124:
              _setting = _context22.sent;
              _context22.next = 127;
              return queue.add(function () {
                return _setting;
              });

            case 127:
              if (_setting) {
                _context22.next = 129;
                break;
              }

              return _context22.abrupt("return");

            case 129:
              tipAmount = filteredMessageTelegram[3];
              tipTo = filteredMessageTelegram[2];

              if (!_groupTask2) {
                _context22.next = 137;
                break;
              }

              _context22.next = 134;
              return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, _groupTask2, _setting);

            case 134:
              _task11 = _context22.sent;
              _context22.next = 137;
              return queue.add(function () {
                return _task11;
              });

            case 137:
              if (!(filteredMessageTelegram[1] && filteredMessageTelegram[1] === 'rain')) {
                _context22.next = 160;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context22.next = 141;
                break;
              }

              ctx.reply('invalid amount of arguments');
              return _context22.abrupt("return");

            case 141:
              _context22.next = 143;
              return (0, _group.updateGroup)(ctx);

            case 143:
              _groupTask3 = _context22.sent;
              _context22.next = 146;
              return queue.add(function () {
                return _groupTask3;
              });

            case 146:
              _groupTaskId2 = _groupTask3.id;
              _context22.next = 149;
              return (0, _settings2.telegramSettings)(ctx, 'rain', _groupTaskId2);

            case 149:
              _setting2 = _context22.sent;
              _context22.next = 152;
              return queue.add(function () {
                return _setting2;
              });

            case 152:
              if (_setting2) {
                _context22.next = 154;
                break;
              }

              return _context22.abrupt("return");

            case 154:
              rainAmount = filteredMessageTelegram[2];
              _context22.next = 157;
              return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io, _setting2);

            case 157:
              _task12 = _context22.sent;
              _context22.next = 160;
              return queue.add(function () {
                return _task12;
              });

            case 160:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    }));

    return function (_x4) {
      return _ref22.apply(this, arguments);
    };
  }());
  telegramClient.on('message', /*#__PURE__*/function () {
    var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(ctx) {
      var groupTask, task, lastSeenTask;
      return _regenerator["default"].wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context23.sent;
              _context23.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context23.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context23.sent;
              _context23.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              _context23.next = 12;
              return (0, _user.updateLastSeen)(ctx);

            case 12:
              lastSeenTask = _context23.sent;
              _context23.next = 15;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 15:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23);
    }));

    return function (_x5) {
      return _ref23.apply(this, arguments);
    };
  }());
};

exports.telegramRouter = telegramRouter;