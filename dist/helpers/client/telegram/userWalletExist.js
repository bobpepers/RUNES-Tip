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

            console.log('ctx userwalletexists');
            console.log(ctx);
            _context.next = 6;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(userId)
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: true
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 6:
            user = _context.sent;

            if (user) {
              _context.next = 13;
              break;
            }

            _context.next = 10;
            return _models["default"].activity.create({
              type: "".concat(functionName, "_f")
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 10:
            activity = _context.sent;
            _context.next = 13;
            return ctx.reply((0, _telegram.userNotFoundMessage)());

          case 13:
            return _context.abrupt("return", [user, activity]);

          case 14:
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