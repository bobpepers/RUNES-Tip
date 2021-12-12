"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();

var fetchPriceInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, io) {
    var priceRecord, replyString, activity, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _models["default"].priceInfo.findAll({});

          case 3:
            priceRecord = _context.sent;
            replyString = "<b><u>".concat(settings.coin.ticker, " PRICE</u></b>\n");
            replyString += priceRecord.map(function (a) {
              return "".concat(a.currency, ": ").concat(a.price);
            }).join('\n');
            ctx.replyWithHTML(replyString);
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 12:
            _context.next = 14;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(ctx.update.message.from.id)
              }
            });

          case 14:
            user = _context.sent;

            if (user) {
              _context.next = 17;
              break;
            }

            return _context.abrupt("return");

          case 17:
            _context.next = 19;
            return _models["default"].activity.create({
              type: 'price',
              earnerId: user.id
            });

          case 19:
            activity = _context.sent;
            _context.next = 22;
            return _models["default"].activity.findOne({
              where: {
                id: activity.id
              },
              include: [{
                model: _models["default"].user,
                as: 'earner'
              }]
            });

          case 22:
            activity = _context.sent;
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function fetchPriceInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = fetchPriceInfo;
exports["default"] = _default;