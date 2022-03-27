"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userWalletExist = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../../models"));

var _telegram = require("../../../messages/telegram");

// const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
var userWalletExist = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, t, functionName) {
    var activity, userId, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = 0;

            if (ctx && ctx.update && ctx.update.message && ctx.update.message.from && ctx.update.message.from.id) {
              userId = ctx.update.message.from.id;
            } else if (ctx && ctx.update && ctx.update.callback_query && ctx.update.callback_query.from && ctx.update.callback_query.from.id) {
              userId = ctx.update.callback_query.from.id;
            }

            _context.next = 4;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(userId)
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: true
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 15;
              break;
            }

            _context.next = 8;
            return _models["default"].activity.create({
              type: "".concat(functionName, "_f")
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 8:
            activity = _context.sent;
            _context.t0 = ctx;
            _context.next = 12;
            return (0, _telegram.userNotFoundMessage)(ctx, functionName);

          case 12:
            _context.t1 = _context.sent;
            _context.next = 15;
            return _context.t0.replyWithHTML.call(_context.t0, _context.t1);

          case 15:
            return _context.abrupt("return", [user, activity]);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function userWalletExist(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.userWalletExist = userWalletExist;