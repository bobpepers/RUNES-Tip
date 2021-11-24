"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../models"));

/**
 * Fetch PriceInfo
 */
var blockUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var userToBlock, block, newRecord;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('wtf');
            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                username: req.body.username
              }
            });

          case 3:
            userToBlock = _context.sent;

            if (userToBlock) {
              _context.next = 7;
              break;
            }

            res.locals.error = 'USER_TO_TRUST_NOT_FOUND';
            return _context.abrupt("return", next());

          case 7:
            _context.next = 9;
            return _models["default"].blocked.findOne({
              where: {
                userId: req.user.id,
                blockedId: userToBlock.id
              }
            });

          case 9:
            block = _context.sent;

            if (block) {
              _context.next = 19;
              break;
            }

            _context.next = 13;
            return _models["default"].blocked.create({
              userId: req.user.id,
              blockedId: userToBlock.id
            });

          case 13:
            newRecord = _context.sent;
            console.log('created');
            _context.next = 17;
            return _models["default"].blocked.findOne({
              where: {
                id: newRecord.id
              },
              attributes: ['id'],
              include: [{
                model: _models["default"].user,
                as: 'userBlock',
                required: false,
                attributes: ['username']
              }, {
                model: _models["default"].user,
                as: 'userBlocked',
                required: false,
                attributes: ['username']
              }]
            });

          case 17:
            res.locals.blocked = _context.sent;
            return _context.abrupt("return", next());

          case 19:
            block.destroy();
            res.locals.removed = req.body.username;
            return _context.abrupt("return", next());

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function blockUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = blockUser;
exports["default"] = _default;