"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUserInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

var fetchUserInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.locals.name = 'user';
            _context.next = 3;
            return _models["default"].user.findOne({
              where: {
                id: req.body.id
              },
              attributes: {
                include: [[_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.literal("CASE WHEN reactdroptips.status = 'success' THEN 1 ELSE 0 END")), 'reactdrop_success_count'], [_sequelize.Sequelize.fn('sum', _sequelize.Sequelize.literal("CASE WHEN reactdroptips.status = 'failed' THEN 1 ELSE 0 END")), 'reactdrop_failed_count']]
              },
              group: ['wallet.id'],
              include: [{
                model: _models["default"].wallet,
                as: 'wallet'
              }, {
                model: _models["default"].reactdroptip,
                as: 'reactdroptips',
                attributes: []
              }]
            });

          case 3:
            res.locals.result = _context.sent;
            console.log(res.locals.result);
            next();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchUserInfo(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchUserInfo = fetchUserInfo;