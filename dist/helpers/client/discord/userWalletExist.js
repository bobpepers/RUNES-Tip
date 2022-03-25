"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userWalletExist = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../../models"));

var _discord = require("../../../messages/discord");

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var userWalletExist = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, t, functionName) {
    var activity, userId, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (message.user) {
              userId = message.user.id;
            } else if (message.author) {
              userId = message.author.id;
            }

            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                user_id: "discord-".concat(userId)
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

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return _models["default"].activity.create({
              type: "".concat(functionName, "_f")
            }, {
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 7:
            activity = _context.sent;
            _context.next = 10;
            return message.channel.send({
              embeds: [(0, _discord.walletNotFoundMessage)(message, capitalize(functionName))]
            });

          case 10:
            return _context.abrupt("return", [user, activity]);

          case 11:
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