"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUseExternalWithdrawAddress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var createOrUseExternalWithdrawAddress = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, user, t) {
    var addressExternal, UserExternalAddressMnMAssociation;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].addressExternal.findOne({
              where: {
                address: address
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 2:
            addressExternal = _context.sent;

            if (addressExternal) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return _models["default"].addressExternal.create({
              address: address
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 6:
            addressExternal = _context.sent;

          case 7:
            _context.next = 9;
            return _models["default"].UserAddressExternal.findOne({
              where: {
                addressExternalId: addressExternal.id,
                userId: user.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 9:
            UserExternalAddressMnMAssociation = _context.sent;

            if (UserExternalAddressMnMAssociation) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return _models["default"].UserAddressExternal.create({
              addressExternalId: addressExternal.id,
              userId: user.id
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 13:
            UserExternalAddressMnMAssociation = _context.sent;

          case 14:
            return _context.abrupt("return", addressExternal);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createOrUseExternalWithdrawAddress(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.createOrUseExternalWithdrawAddress = createOrUseExternalWithdrawAddress;