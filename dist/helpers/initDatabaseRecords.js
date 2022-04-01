"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDatabaseRecords = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../models"));

var initDatabaseRecords = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(discordClient, telegramClient, matrixClient) {
    var createUSDCurrencytRecord, discordBotUser, discordBotSetting, telegramBotSetting, matrixBotSetting, autoWithdrawalSetting, faucet, triviaSetting, floodSetting, withdrawSetting, tipSetting, rainSetting, soakSetting, sleetSetting, voicerainSetting, thunderSetting, thunderstormSetting, hurricaneSetting, faucetSetting, reactdropSetting;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].currency.findOrCreate({
              where: {
                id: 1
              },
              defaults: {
                id: 1,
                currency_name: "USD",
                iso: 'USD',
                type: 'FIAT'
              }
            });

          case 2:
            createUSDCurrencytRecord = _context.sent;
            _context.next = 5;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(discordClient.user.id)
              }
            });

          case 5:
            discordBotUser = _context.sent;

            if (discordBotUser) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return _models["default"].user.create({
              username: discordClient.user.username,
              user_id: "discord-".concat(discordClient.user.id)
            });

          case 9:
            _context.next = 11;
            return _models["default"].bots.findOne({
              where: {
                name: 'discord'
              }
            });

          case 11:
            discordBotSetting = _context.sent;

            if (discordBotSetting) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return _models["default"].bots.create({
              name: 'discord'
            });

          case 15:
            _context.next = 17;
            return _models["default"].bots.findOne({
              where: {
                name: 'telegram'
              }
            });

          case 17:
            telegramBotSetting = _context.sent;

            if (telegramBotSetting) {
              _context.next = 21;
              break;
            }

            _context.next = 21;
            return _models["default"].bots.create({
              name: 'telegram'
            });

          case 21:
            _context.next = 23;
            return _models["default"].bots.findOne({
              where: {
                name: 'matrix'
              }
            });

          case 23:
            matrixBotSetting = _context.sent;

            if (matrixBotSetting) {
              _context.next = 27;
              break;
            }

            _context.next = 27;
            return _models["default"].bots.create({
              name: 'matrix'
            });

          case 27:
            _context.next = 29;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'autoWithdrawal'
              }
            });

          case 29:
            autoWithdrawalSetting = _context.sent;

            if (autoWithdrawalSetting) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return _models["default"].features.create({
              type: 'global',
              name: 'autoWithdrawal',
              enabled: true
            });

          case 33:
            _context.next = 35;
            return _models["default"].faucet.findOne();

          case 35:
            faucet = _context.sent;

            if (faucet) {
              _context.next = 39;
              break;
            }

            _context.next = 39;
            return _models["default"].faucet.create({
              amount: 0,
              totalAmountClaimed: 0,
              claims: 0
            });

          case 39:
            _context.next = 41;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'trivia'
              }
            });

          case 41:
            triviaSetting = _context.sent;

            if (triviaSetting) {
              _context.next = 45;
              break;
            }

            _context.next = 45;
            return _models["default"].features.create({
              type: 'global',
              name: 'trivia',
              enabled: true
            });

          case 45:
            _context.next = 47;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'flood'
              }
            });

          case 47:
            floodSetting = _context.sent;

            if (floodSetting) {
              _context.next = 51;
              break;
            }

            _context.next = 51;
            return _models["default"].features.create({
              type: 'global',
              name: 'flood',
              enabled: true
            });

          case 51:
            _context.next = 53;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'withdraw'
              }
            });

          case 53:
            withdrawSetting = _context.sent;

            if (withdrawSetting) {
              _context.next = 57;
              break;
            }

            _context.next = 57;
            return _models["default"].features.create({
              type: 'global',
              name: 'withdraw',
              enabled: true
            });

          case 57:
            _context.next = 59;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'tip'
              }
            });

          case 59:
            tipSetting = _context.sent;

            if (tipSetting) {
              _context.next = 63;
              break;
            }

            _context.next = 63;
            return _models["default"].features.create({
              type: 'global',
              name: 'tip',
              enabled: true
            });

          case 63:
            _context.next = 65;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'rain'
              }
            });

          case 65:
            rainSetting = _context.sent;

            if (rainSetting) {
              _context.next = 69;
              break;
            }

            _context.next = 69;
            return _models["default"].features.create({
              type: 'global',
              name: 'rain',
              enabled: true
            });

          case 69:
            _context.next = 71;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'soak'
              }
            });

          case 71:
            soakSetting = _context.sent;

            if (soakSetting) {
              _context.next = 75;
              break;
            }

            _context.next = 75;
            return _models["default"].features.create({
              type: 'global',
              name: 'soak',
              enabled: true
            });

          case 75:
            _context.next = 77;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'sleet'
              }
            });

          case 77:
            sleetSetting = _context.sent;

            if (sleetSetting) {
              _context.next = 81;
              break;
            }

            _context.next = 81;
            return _models["default"].features.create({
              type: 'global',
              name: 'sleet',
              enabled: true
            });

          case 81:
            _context.next = 83;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'voicerain'
              }
            });

          case 83:
            voicerainSetting = _context.sent;

            if (voicerainSetting) {
              _context.next = 87;
              break;
            }

            _context.next = 87;
            return _models["default"].features.create({
              type: 'global',
              name: 'voicerain',
              enabled: true
            });

          case 87:
            _context.next = 89;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'thunder'
              }
            });

          case 89:
            thunderSetting = _context.sent;

            if (thunderSetting) {
              _context.next = 93;
              break;
            }

            _context.next = 93;
            return _models["default"].features.create({
              type: 'global',
              name: 'thunder',
              enabled: true
            });

          case 93:
            _context.next = 95;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'thunderstorm'
              }
            });

          case 95:
            thunderstormSetting = _context.sent;

            if (thunderstormSetting) {
              _context.next = 99;
              break;
            }

            _context.next = 99;
            return _models["default"].features.create({
              type: 'global',
              name: 'thunderstorm',
              enabled: true
            });

          case 99:
            _context.next = 101;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'hurricane'
              }
            });

          case 101:
            hurricaneSetting = _context.sent;

            if (hurricaneSetting) {
              _context.next = 105;
              break;
            }

            _context.next = 105;
            return _models["default"].features.create({
              type: 'global',
              name: 'hurricane',
              enabled: true
            });

          case 105:
            _context.next = 107;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'faucet'
              }
            });

          case 107:
            faucetSetting = _context.sent;

            if (faucetSetting) {
              _context.next = 111;
              break;
            }

            _context.next = 111;
            return _models["default"].features.create({
              type: 'global',
              name: 'faucet',
              enabled: true
            });

          case 111:
            _context.next = 113;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'reactdrop'
              }
            });

          case 113:
            reactdropSetting = _context.sent;

            if (reactdropSetting) {
              _context.next = 117;
              break;
            }

            _context.next = 117;
            return _models["default"].features.create({
              type: 'global',
              name: 'reactdrop',
              enabled: true
            });

          case 117:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initDatabaseRecords(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.initDatabaseRecords = initDatabaseRecords;