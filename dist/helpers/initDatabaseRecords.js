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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var discordBotSetting, telegramBotSetting, autoWithdrawalSetting, faucet, floodSetting, withdrawSetting, tipSetting, rainSetting, soakSetting, sleetSetting, voicerainSetting, thunderSetting, thunderstormSetting, hurricaneSetting, faucetSetting, reactdropSetting;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].bots.findOne({
              where: {
                name: 'discord'
              }
            });

          case 2:
            discordBotSetting = _context.sent;

            if (discordBotSetting) {
              _context.next = 6;
              break;
            }

            _context.next = 6;
            return _models["default"].bots.create({
              name: 'discord'
            });

          case 6:
            _context.next = 8;
            return _models["default"].bots.findOne({
              where: {
                name: 'telegram'
              }
            });

          case 8:
            telegramBotSetting = _context.sent;

            if (telegramBotSetting) {
              _context.next = 12;
              break;
            }

            _context.next = 12;
            return _models["default"].bots.create({
              name: 'telegram'
            });

          case 12:
            _context.next = 14;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'autoWithdrawal'
              }
            });

          case 14:
            autoWithdrawalSetting = _context.sent;

            if (autoWithdrawalSetting) {
              _context.next = 18;
              break;
            }

            _context.next = 18;
            return _models["default"].features.create({
              type: 'global',
              name: 'autoWithdrawal',
              enabled: true
            });

          case 18:
            _context.next = 20;
            return _models["default"].faucet.findOne();

          case 20:
            faucet = _context.sent;

            if (faucet) {
              _context.next = 24;
              break;
            }

            _context.next = 24;
            return _models["default"].faucet.create({
              amount: 0,
              totalAmountClaimed: 0,
              claims: 0
            });

          case 24:
            _context.next = 26;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'flood'
              }
            });

          case 26:
            floodSetting = _context.sent;

            if (floodSetting) {
              _context.next = 30;
              break;
            }

            _context.next = 30;
            return _models["default"].features.create({
              type: 'global',
              name: 'flood',
              enabled: true
            });

          case 30:
            _context.next = 32;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'withdraw'
              }
            });

          case 32:
            withdrawSetting = _context.sent;

            if (withdrawSetting) {
              _context.next = 36;
              break;
            }

            _context.next = 36;
            return _models["default"].features.create({
              type: 'global',
              name: 'withdraw',
              enabled: true
            });

          case 36:
            _context.next = 38;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'tip'
              }
            });

          case 38:
            tipSetting = _context.sent;

            if (tipSetting) {
              _context.next = 42;
              break;
            }

            _context.next = 42;
            return _models["default"].features.create({
              type: 'global',
              name: 'tip',
              enabled: true
            });

          case 42:
            _context.next = 44;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'rain'
              }
            });

          case 44:
            rainSetting = _context.sent;

            if (rainSetting) {
              _context.next = 48;
              break;
            }

            _context.next = 48;
            return _models["default"].features.create({
              type: 'global',
              name: 'rain',
              enabled: true
            });

          case 48:
            _context.next = 50;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'soak'
              }
            });

          case 50:
            soakSetting = _context.sent;

            if (soakSetting) {
              _context.next = 54;
              break;
            }

            _context.next = 54;
            return _models["default"].features.create({
              type: 'global',
              name: 'soak',
              enabled: true
            });

          case 54:
            _context.next = 56;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'sleet'
              }
            });

          case 56:
            sleetSetting = _context.sent;

            if (sleetSetting) {
              _context.next = 60;
              break;
            }

            _context.next = 60;
            return _models["default"].features.create({
              type: 'global',
              name: 'sleet',
              enabled: true
            });

          case 60:
            _context.next = 62;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'voicerain'
              }
            });

          case 62:
            voicerainSetting = _context.sent;

            if (voicerainSetting) {
              _context.next = 66;
              break;
            }

            _context.next = 66;
            return _models["default"].features.create({
              type: 'global',
              name: 'voicerain',
              enabled: true
            });

          case 66:
            _context.next = 68;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'thunder'
              }
            });

          case 68:
            thunderSetting = _context.sent;

            if (thunderSetting) {
              _context.next = 72;
              break;
            }

            _context.next = 72;
            return _models["default"].features.create({
              type: 'global',
              name: 'thunder',
              enabled: true
            });

          case 72:
            _context.next = 74;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'thunderstorm'
              }
            });

          case 74:
            thunderstormSetting = _context.sent;

            if (thunderstormSetting) {
              _context.next = 78;
              break;
            }

            _context.next = 78;
            return _models["default"].features.create({
              type: 'global',
              name: 'thunderstorm',
              enabled: true
            });

          case 78:
            _context.next = 80;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'hurricane'
              }
            });

          case 80:
            hurricaneSetting = _context.sent;

            if (hurricaneSetting) {
              _context.next = 84;
              break;
            }

            _context.next = 84;
            return _models["default"].features.create({
              type: 'global',
              name: 'hurricane',
              enabled: true
            });

          case 84:
            _context.next = 86;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'faucet'
              }
            });

          case 86:
            faucetSetting = _context.sent;

            if (faucetSetting) {
              _context.next = 90;
              break;
            }

            _context.next = 90;
            return _models["default"].features.create({
              type: 'global',
              name: 'faucet',
              enabled: true
            });

          case 90:
            _context.next = 92;
            return _models["default"].features.findOne({
              where: {
                type: 'global',
                name: 'reactdrop'
              }
            });

          case 92:
            reactdropSetting = _context.sent;

            if (reactdropSetting) {
              _context.next = 96;
              break;
            }

            _context.next = 96;
            return _models["default"].features.create({
              type: 'global',
              name: 'reactdrop',
              enabled: true
            });

          case 96:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initDatabaseRecords() {
    return _ref.apply(this, arguments);
  };
}();

exports.initDatabaseRecords = initDatabaseRecords;