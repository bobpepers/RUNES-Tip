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
  telegramClient.command('info', function (ctx) {
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
              return (0, _info.fetchInfo)(ctx);

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
  telegramClient.action('Info', function (ctx) {
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
              return (0, _info.fetchInfo)(ctx);

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
  telegramClient.command('balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
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
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context6.next = 16;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context6.sent;
              _context6.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }))();
  });
  telegramClient.action('Balance', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
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
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context7.next = 16;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context7.sent;
              _context7.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  });
  telegramClient.command('tip', /*#__PURE__*/function () {
    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(ctx) {
      var maintenance, filteredMessageTelegram;
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
              filteredMessageTelegram = ctx.update.message.text.split(' ');

              if (!filteredMessageTelegram[1]) {
                ctx.reply('insufficient Arguments');
              }

              if (!filteredMessageTelegram[2]) {
                ctx.reply('insufficient Arguments');
              }

              if (filteredMessageTelegram[1] && filteredMessageTelegram[2]) {
                (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                  var groupTask, groupTaskId, setting, tipAmount, tipTo, task;
                  return _regenerator["default"].wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          _context8.next = 2;
                          return (0, _group.updateGroup)(ctx);

                        case 2:
                          groupTask = _context8.sent;
                          _context8.next = 5;
                          return queue.add(function () {
                            return groupTask;
                          });

                        case 5:
                          groupTaskId = groupTask.id;
                          _context8.next = 8;
                          return (0, _settings2.telegramSettings)(ctx, 'tip', groupTaskId);

                        case 8:
                          setting = _context8.sent;
                          _context8.next = 11;
                          return queue.add(function () {
                            return setting;
                          });

                        case 11:
                          if (setting) {
                            _context8.next = 13;
                            break;
                          }

                          return _context8.abrupt("return");

                        case 13:
                          tipAmount = filteredMessageTelegram[2];
                          tipTo = filteredMessageTelegram[1];

                          if (!groupTask) {
                            _context8.next = 21;
                            break;
                          }

                          _context8.next = 18;
                          return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, groupTask, setting);

                        case 18:
                          task = _context8.sent;
                          _context8.next = 21;
                          return queue.add(function () {
                            return task;
                          });

                        case 21:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }))();
              }

            case 11:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x) {
      return _ref8.apply(this, arguments);
    };
  }());
  telegramClient.command('rain', /*#__PURE__*/function () {
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
                ctx.reply('invalid amount of arguments');
              }

              if (filteredMessageTelegram[1]) {
                (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                  var groupTask, groupTaskId, setting, rainAmount, task;
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
                          groupTaskId = groupTask.id;
                          _context10.next = 8;
                          return (0, _settings2.telegramSettings)(ctx, 'rain', groupTaskId);

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
                          console.log(setting);
                          rainAmount = filteredMessageTelegram[1];
                          _context10.next = 17;
                          return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io, setting);

                        case 17:
                          task = _context10.sent;
                          _context10.next = 20;
                          return queue.add(function () {
                            return task;
                          });

                        case 20:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }))();
              }

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x2) {
      return _ref10.apply(this, arguments);
    };
  }());
  telegramClient.command('deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return (0, _isMaintenanceOrDisabled.isMaintenanceOrDisabled)(ctx, 'telegram');

            case 2:
              maintenance = _context12.sent;
              _context12.next = 5;
              return queue.add(function () {
                return maintenance;
              });

            case 5:
              if (!(maintenance.maintenance || !maintenance.enabled)) {
                _context12.next = 7;
                break;
              }

              return _context12.abrupt("return");

            case 7:
              _context12.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context12.sent;
              _context12.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username;
              _context12.next = 16;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context12.sent;
              _context12.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }))();
  });
  telegramClient.action('Deposit', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var maintenance, groupTask, telegramUserId, telegramUserName, task;
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
              _context13.next = 9;
              return (0, _group.updateGroup)(ctx);

            case 9:
              groupTask = _context13.sent;
              _context13.next = 12;
              return queue.add(function () {
                return groupTask;
              });

            case 12:
              telegramUserId = ctx.update.callback_query.from.id;
              telegramUserName = ctx.update.callback_query.from.username;
              _context13.next = 16;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 16:
              task = _context13.sent;
              _context13.next = 19;
              return queue.add(function () {
                return task;
              });

            case 19:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }))();
  });
  telegramClient.command('withdraw', /*#__PURE__*/function () {
    var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(ctx) {
      var maintenance, filteredMessageTelegram, groupTask, groupTaskId, setting, withdrawalAddress, withdrawalAmount, task;
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
              filteredMessageTelegram = ctx.update.message.text.split(' ');

              if (filteredMessageTelegram[1]) {
                _context14.next = 11;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context14.abrupt("return");

            case 11:
              if (filteredMessageTelegram[2]) {
                _context14.next = 14;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context14.abrupt("return");

            case 14:
              _context14.next = 16;
              return (0, _group.updateGroup)(ctx);

            case 16:
              groupTask = _context14.sent;
              _context14.next = 19;
              return queue.add(function () {
                return groupTask;
              });

            case 19:
              console.log(groupTask);
              groupTaskId = groupTask ? groupTask.id : null;
              _context14.next = 23;
              return (0, _settings2.telegramSettings)(ctx, 'withdraw', groupTaskId);

            case 23:
              setting = _context14.sent;
              _context14.next = 26;
              return queue.add(function () {
                return setting;
              });

            case 26:
              if (setting) {
                _context14.next = 28;
                break;
              }

              return _context14.abrupt("return");

            case 28:
              withdrawalAddress = filteredMessageTelegram[1];
              withdrawalAmount = filteredMessageTelegram[2];
              console.log('before withdrawal create');
              _context14.next = 33;
              return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io, setting);

            case 33:
              task = _context14.sent;
              _context14.next = 36;
              return queue.add(function () {
                return task;
              });

            case 36:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x3) {
      return _ref14.apply(this, arguments);
    };
  }());

  if (settings.coin.setting === 'Runebase') {
    telegramClient.command('referral', function (ctx) {
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
                telegramUserId = ctx.update.message.from.id;
                telegramUserName = ctx.update.message.from.username;
                _context15.next = 16;
                return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

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
    telegramClient.action('Referral', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        var maintenance, groupTask, telegramUserId, telegramUserName, task;
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
                _context16.next = 9;
                return (0, _group.updateGroup)(ctx);

              case 9:
                groupTask = _context16.sent;
                _context16.next = 12;
                return queue.add(function () {
                  return groupTask;
                });

              case 12:
                telegramUserId = ctx.update.callback_query.from.id;
                telegramUserName = ctx.update.callback_query.from.username;
                _context16.next = 16;
                return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

              case 16:
                task = _context16.sent;
                _context16.next = 19;
                return queue.add(function () {
                  return task;
                });

              case 19:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }))();
    });
    telegramClient.command('top', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var maintenance, groupTask, task;
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
                _context17.next = 14;
                return (0, _referral.fetchReferralTopTen)(ctx);

              case 14:
                task = _context17.sent;
                _context17.next = 17;
                return queue.add(function () {
                  return task;
                });

              case 17:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }))();
    });
    telegramClient.action('ReferralTop', function (ctx) {
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        var maintenance, groupTask, task;
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
                _context18.next = 14;
                return (0, _referral.fetchReferralTopTen)(ctx);

              case 14:
                task = _context18.sent;
                _context18.next = 17;
                return queue.add(function () {
                  return task;
                });

              case 17:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }))();
    });
  }

  telegramClient.on('new_chat_members', function (ctx) {
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
      var groupTask, task, taskReferred;
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return (0, _group.updateGroup)(ctx);

            case 2:
              groupTask = _context19.sent;
              _context19.next = 5;
              return queue.add(function () {
                return groupTask;
              });

            case 5:
              _context19.next = 7;
              return (0, _user.createUpdateUser)(ctx);

            case 7:
              task = _context19.sent;
              _context19.next = 10;
              return queue.add(function () {
                return task;
              });

            case 10:
              if (!(settings.coin.setting === 'Runebase')) {
                _context19.next = 17;
                break;
              }

              if (!(ctx.update.message.chat.id === Number(runesGroup))) {
                _context19.next = 17;
                break;
              }

              _context19.next = 14;
              return (0, _referral.createReferral)(ctx, telegramClient, runesGroup);

            case 14:
              taskReferred = _context19.sent;
              _context19.next = 17;
              return queue.add(function () {
                return taskReferred;
              });

            case 17:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }))();
  });
  telegramClient.on('text', /*#__PURE__*/function () {
    var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(ctx) {
      var maintenance, groupTask, task, lastSeenTask, preFilteredMessageTelegram, filteredMessageTelegram, telegramUserId, telegramUserName, _task, _task2, _task3, _task4, _task5, _task6, _task7, _task8, _groupTask, groupTaskId, setting, withdrawalAddress, withdrawalAmount, _task9, _groupTask2, _groupTaskId, _setting, tipAmount, tipTo, _task10, _groupTask3, _groupTaskId2, _setting2, rainAmount, _task11;

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
              return (0, _user.createUpdateUser)(ctx);

            case 14:
              task = _context20.sent;
              _context20.next = 17;
              return queue.add(function () {
                return task;
              });

            case 17:
              _context20.next = 19;
              return (0, _user.updateLastSeen)(ctx);

            case 19:
              lastSeenTask = _context20.sent;
              _context20.next = 22;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 22:
              preFilteredMessageTelegram = ctx.update.message.text.split(' ');
              filteredMessageTelegram = preFilteredMessageTelegram.filter(function (el) {
                return el !== '';
              });
              telegramUserId = ctx.update.message.from.id;
              telegramUserName = ctx.update.message.from.username; // console.log(filteredMessageTelegram);

              if (!(filteredMessageTelegram[0].toLowerCase() === settings.bot.command.telegram)) {
                _context20.next = 154;
                break;
              }

              if (filteredMessageTelegram[1]) {
                _context20.next = 33;
                break;
              }

              _context20.next = 30;
              return (0, _help.fetchHelp)(ctx, io);

            case 30:
              _task = _context20.sent;
              _context20.next = 33;
              return queue.add(function () {
                return _task;
              });

            case 33:
              if (!(filteredMessageTelegram[1] === 'price')) {
                _context20.next = 39;
                break;
              }

              _context20.next = 36;
              return (0, _price["default"])(ctx, io);

            case 36:
              _task2 = _context20.sent;
              _context20.next = 39;
              return queue.add(function () {
                return _task2;
              });

            case 39:
              if (!(filteredMessageTelegram[1] === 'info')) {
                _context20.next = 45;
                break;
              }

              _context20.next = 42;
              return (0, _info.fetchInfo)(ctx);

            case 42:
              _task3 = _context20.sent;
              _context20.next = 45;
              return queue.add(function () {
                return _task3;
              });

            case 45:
              if (!(filteredMessageTelegram[1] === 'help')) {
                _context20.next = 51;
                break;
              }

              _context20.next = 48;
              return (0, _help.fetchHelp)(ctx, io);

            case 48:
              _task4 = _context20.sent;
              _context20.next = 51;
              return queue.add(function () {
                return _task4;
              });

            case 51:
              if (!(settings.coin.setting === 'Runebase')) {
                _context20.next = 64;
                break;
              }

              if (!(filteredMessageTelegram[1] === 'referral' && !filteredMessageTelegram[2])) {
                _context20.next = 58;
                break;
              }

              _context20.next = 55;
              return (0, _referral.fetchReferralCount)(ctx, telegramUserId, telegramUserName);

            case 55:
              _task5 = _context20.sent;
              _context20.next = 58;
              return queue.add(function () {
                return _task5;
              });

            case 58:
              if (!(filteredMessageTelegram[1] === 'referral' && filteredMessageTelegram[2] === 'top')) {
                _context20.next = 64;
                break;
              }

              _context20.next = 61;
              return (0, _referral.fetchReferralTopTen)(ctx);

            case 61:
              _task6 = _context20.sent;
              _context20.next = 64;
              return queue.add(function () {
                return _task6;
              });

            case 64:
              if (!(filteredMessageTelegram[1] === 'balance')) {
                _context20.next = 70;
                break;
              }

              _context20.next = 67;
              return (0, _balance.fetchWalletBalance)(ctx, telegramUserId, telegramUserName, io);

            case 67:
              _task7 = _context20.sent;
              _context20.next = 70;
              return queue.add(function () {
                return _task7;
              });

            case 70:
              if (!(filteredMessageTelegram[1] === 'deposit')) {
                _context20.next = 76;
                break;
              }

              _context20.next = 73;
              return (0, _deposit.fetchWalletDepositAddress)(ctx, telegramUserId, telegramUserName, io);

            case 73:
              _task8 = _context20.sent;
              _context20.next = 76;
              return queue.add(function () {
                return _task8;
              });

            case 76:
              if (!(filteredMessageTelegram[1] === 'withdraw')) {
                _context20.next = 103;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context20.next = 80;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context20.abrupt("return");

            case 80:
              if (filteredMessageTelegram[3]) {
                _context20.next = 83;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context20.abrupt("return");

            case 83:
              _context20.next = 85;
              return (0, _group.updateGroup)(ctx);

            case 85:
              _groupTask = _context20.sent;
              _context20.next = 88;
              return queue.add(function () {
                return _groupTask;
              });

            case 88:
              groupTaskId = _groupTask.id;
              _context20.next = 91;
              return (0, _settings2.telegramSettings)(ctx, 'withdraw', groupTaskId);

            case 91:
              setting = _context20.sent;
              _context20.next = 94;
              return queue.add(function () {
                return setting;
              });

            case 94:
              if (setting) {
                _context20.next = 96;
                break;
              }

              return _context20.abrupt("return");

            case 96:
              withdrawalAddress = filteredMessageTelegram[2];
              withdrawalAmount = filteredMessageTelegram[3];
              _context20.next = 100;
              return (0, _withdraw.withdrawTelegramCreate)(ctx, withdrawalAddress, withdrawalAmount, io, setting);

            case 100:
              _task9 = _context20.sent;
              _context20.next = 103;
              return queue.add(function () {
                return _task9;
              });

            case 103:
              if (!(filteredMessageTelegram[1] === 'tip')) {
                _context20.next = 131;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context20.next = 107;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context20.abrupt("return");

            case 107:
              if (filteredMessageTelegram[3]) {
                _context20.next = 110;
                break;
              }

              ctx.reply('insufficient Arguments');
              return _context20.abrupt("return");

            case 110:
              _context20.next = 112;
              return (0, _group.updateGroup)(ctx);

            case 112:
              _groupTask2 = _context20.sent;
              _context20.next = 115;
              return queue.add(function () {
                return _groupTask2;
              });

            case 115:
              _groupTaskId = _groupTask2.id;
              _context20.next = 118;
              return (0, _settings2.telegramSettings)(ctx, 'tip', _groupTaskId);

            case 118:
              _setting = _context20.sent;
              _context20.next = 121;
              return queue.add(function () {
                return _setting;
              });

            case 121:
              if (_setting) {
                _context20.next = 123;
                break;
              }

              return _context20.abrupt("return");

            case 123:
              tipAmount = filteredMessageTelegram[3];
              tipTo = filteredMessageTelegram[2];

              if (!_groupTask2) {
                _context20.next = 131;
                break;
              }

              _context20.next = 128;
              return (0, _tip.tipRunesToUser)(ctx, tipTo, tipAmount, telegramClient, runesGroup, io, _groupTask2, _setting);

            case 128:
              _task10 = _context20.sent;
              _context20.next = 131;
              return queue.add(function () {
                return _task10;
              });

            case 131:
              if (!(filteredMessageTelegram[1] === 'rain')) {
                _context20.next = 154;
                break;
              }

              if (filteredMessageTelegram[2]) {
                _context20.next = 135;
                break;
              }

              ctx.reply('invalid amount of arguments');
              return _context20.abrupt("return");

            case 135:
              _context20.next = 137;
              return (0, _group.updateGroup)(ctx);

            case 137:
              _groupTask3 = _context20.sent;
              _context20.next = 140;
              return queue.add(function () {
                return _groupTask3;
              });

            case 140:
              _groupTaskId2 = _groupTask3.id;
              _context20.next = 143;
              return (0, _settings2.telegramSettings)(ctx, 'rain', _groupTaskId2);

            case 143:
              _setting2 = _context20.sent;
              _context20.next = 146;
              return queue.add(function () {
                return _setting2;
              });

            case 146:
              if (_setting2) {
                _context20.next = 148;
                break;
              }

              return _context20.abrupt("return");

            case 148:
              rainAmount = filteredMessageTelegram[2];
              _context20.next = 151;
              return (0, _rain.rainRunesToUsers)(ctx, rainAmount, telegramClient, runesGroup, io, _setting2);

            case 151:
              _task11 = _context20.sent;
              _context20.next = 154;
              return queue.add(function () {
                return _task11;
              });

            case 154:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }));

    return function (_x4) {
      return _ref20.apply(this, arguments);
    };
  }());
  telegramClient.on('message', /*#__PURE__*/function () {
    var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(ctx) {
      var groupTask, task, lastSeenTask;
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
              _context21.next = 12;
              return (0, _user.updateLastSeen)(ctx);

            case 12:
              lastSeenTask = _context21.sent;
              _context21.next = 15;
              return queue.add(function () {
                return lastSeenTask;
              });

            case 15:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }));

    return function (_x5) {
      return _ref21.apply(this, arguments);
    };
  }());
};

exports.telegramRouter = telegramRouter;