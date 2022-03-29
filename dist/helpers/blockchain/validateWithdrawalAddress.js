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
    var failWithdrawalActivity, getAddressInfo, isInvalidAddress, isNodeOffline;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isInvalidAddress = false;
            isNodeOffline = false;

            if (!(settings.coin.setting === 'Runebase')) {
              _context.next = 17;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return (0, _rclient.getInstance)().validateAddress(address);

          case 6:
            getAddressInfo = _context.sent;
            console.log(getAddressInfo);

            if (getAddressInfo && !getAddressInfo.isvalid) {
              isInvalidAddress = true;
            }

            if (getAddressInfo && getAddressInfo.isvalid) {
              isInvalidAddress = false;
            }

            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](3);
            isNodeOffline = true;

          case 15:
            _context.next = 58;
            break;

          case 17:
            if (!(settings.coin.setting === 'Pirate')) {
              _context.next = 31;
              break;
            }

            _context.prev = 18;
            _context.next = 21;
            return (0, _rclient.getInstance)().zValidateAddress(address);

          case 21:
            getAddressInfo = _context.sent;

            if (getAddressInfo && !getAddressInfo.isvalid) {
              isInvalidAddress = true;
            }

            if (getAddressInfo && getAddressInfo.isvalid) {
              isInvalidAddress = false;
            }

            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t1 = _context["catch"](18);
            isNodeOffline = true;

          case 29:
            _context.next = 58;
            break;

          case 31:
            if (!(settings.coin.setting === 'Komodo')) {
              _context.next = 46;
              break;
            }

            _context.prev = 32;
            _context.next = 35;
            return (0, _rclient.getInstance)().validateAddress(address);

          case 35:
            getAddressInfo = _context.sent;
            console.log(getAddressInfo);

            if (getAddressInfo && !getAddressInfo.isvalid) {
              isInvalidAddress = true;
            }

            if (getAddressInfo && getAddressInfo.isvalid) {
              isInvalidAddress = false;
            }

            _context.next = 44;
            break;

          case 41:
            _context.prev = 41;
            _context.t2 = _context["catch"](32);
            isNodeOffline = true;

          case 44:
            _context.next = 58;
            break;

          case 46:
            _context.prev = 46;
            _context.next = 49;
            return (0, _rclient.getInstance)().validateAddress(address);

          case 49:
            getAddressInfo = _context.sent;
            console.log(getAddressInfo);

            if (getAddressInfo && !getAddressInfo.isvalid) {
              isInvalidAddress = true;
            }

            if (getAddressInfo && getAddressInfo.isvalid) {
              isInvalidAddress = false;
            }

            _context.next = 58;
            break;

          case 55:
            _context.prev = 55;
            _context.t3 = _context["catch"](46);
            isNodeOffline = true;

          case 58:
            if (!getAddressInfo) {
              isInvalidAddress = true;
            }

            if (!(isInvalidAddress || isNodeOffline)) {
              _context.next = 63;
              break;
            }

            _context.next = 62;
            return _models["default"].activity.create({
              type: "withdraw_f",
              spenderId: user.id
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 62:
            failWithdrawalActivity = _context.sent;

          case 63:
            return _context.abrupt("return", [isInvalidAddress, isNodeOffline, failWithdrawalActivity]);

          case 64:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 12], [18, 26], [32, 41], [46, 55]]);
  }));

  return function validateWithdrawalAddress(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateWithdrawalAddress = validateWithdrawalAddress;