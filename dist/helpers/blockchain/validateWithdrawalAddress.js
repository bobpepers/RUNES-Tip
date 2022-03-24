"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateWithdrawalAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _rclient = require("../../services/rclient");

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var validateWithdrawalAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, user, t) {
    var failWithdrawalActivity, getAddressInfo, isInvalidAddress, isNodeOffline, isValidAddress;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isInvalidAddress = false;
            isNodeOffline = false;
            isValidAddress = false; // Regex check

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return (0, _rclient.getInstance)().utils.isRunebaseAddress(address);

          case 6:
            isValidAddress = _context.sent;
            _context.next = 24;
            break;

          case 9:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return (0, _rclient.getInstance)().utils.isPirateAddress(address);

          case 12:
            isValidAddress = _context.sent;
            _context.next = 24;
            break;

          case 15:
            if (!(settings.coin.setting === 'Komodo')) {
              _context.next = 21;
              break;
            }

            _context.next = 18;
            return (0, _rclient.getInstance)().utils.isKomodoAddress(address);

          case 18:
            isValidAddress = _context.sent;
            _context.next = 24;
            break;

          case 21:
            _context.next = 23;
            return (0, _rclient.getInstance)().utils.isRunebaseAddress(address);

          case 23:
            isValidAddress = _context.sent;

          case 24:
            if (!isValidAddress) {
              console.log('failed regex address');
              isInvalidAddress = true;
            } // Check on Crypto node


            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 38;
              break;
            }

            _context.prev = 26;
            _context.next = 29;
            return (0, _rclient.getInstance)().getAddressInfo(address);

          case 29:
            getAddressInfo = _context.sent;
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t0 = _context["catch"](26);
            console.log(_context.t0);

            if (_context.t0.response && _context.t0.response.status === 500) {
              isInvalidAddress = true; // return;
            } else {
              isNodeOffline = true;
            }

          case 36:
            _context.next = 39;
            break;

          case 38:
            if (settings.coin.setting === 'Pirate') {
              getAddressInfo = true;
            } else if (settings.coin.setting === 'Komodo') {
              getAddressInfo = true;
            }

          case 39:
            if (!getAddressInfo) {
              console.log('fail node check');
              isInvalidAddress = true;
            }

            if (!(isInvalidAddress || isNodeOffline)) {
              _context.next = 44;
              break;
            }

            _context.next = 43;
            return _models["default"].activity.create({
              type: "withdraw_f",
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 43:
            failWithdrawalActivity = _context.sent;

          case 44:
            return _context.abrupt("return", [isInvalidAddress, isNodeOffline, failWithdrawalActivity]);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[26, 32]]);
  }));

  return function validateWithdrawalAddress(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateWithdrawalAddress = validateWithdrawalAddress;