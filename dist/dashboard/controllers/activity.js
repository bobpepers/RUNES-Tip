"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchActivity = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

// import { parseDomain } from "parse-domain";
var _require = require('sequelize'),
    Op = _require.Op;

var fetchActivity = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var activityOptions, spenderOptions, earnerOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            activityOptions = {};
            spenderOptions = {};
            earnerOptions = {};

            if (req.body.id !== '') {
              activityOptions.id = (0, _defineProperty2["default"])({}, Op.like, "%".concat(Number(req.body.id), "%"));
            }

            if (req.body.type !== '') {
              activityOptions.type = (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.type, "%"));
            }

            if (req.body.spender !== '') {
              spenderOptions = (0, _defineProperty2["default"])({}, Op.or, [{
                username: (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.spender, "%"))
              }, {
                userId: (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.spender, "%"))
              }]);
            }

            if (req.body.earner !== '') {
              earnerOptions = (0, _defineProperty2["default"])({}, Op.or, [{
                username: (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.earner, "%"))
              }, {
                userId: (0, _defineProperty2["default"])({}, Op.like, "%".concat(req.body.earner, "%"))
              }]);
            }

            options = {
              where: activityOptions,
              order: [['id', 'DESC']],
              limit: 300,
              include: [{
                model: _models["default"].user,
                as: 'spender',
                where: spenderOptions,
                required: false
              }, {
                model: _models["default"].user,
                as: 'earner',
                where: earnerOptions,
                required: false
              }, {
                model: _models["default"].flood,
                as: 'flood',
                required: false
              }, {
                model: _models["default"].floodtip,
                as: 'floodtip',
                required: false
              }, {
                model: _models["default"].rain,
                as: 'rain',
                required: false
              }, {
                model: _models["default"].raintip,
                as: 'raintip',
                required: false
              }, {
                model: _models["default"].soak,
                as: 'soak',
                required: false
              }, {
                model: _models["default"].soaktip,
                as: 'soaktip',
                required: false
              }, {
                model: _models["default"].sleet,
                as: 'sleet',
                required: false
              }, {
                model: _models["default"].sleettip,
                as: 'sleettip',
                required: false
              }, {
                model: _models["default"].reactdrop,
                as: 'reactdrop',
                required: false
              }, {
                model: _models["default"].reactdroptip,
                as: 'reactdroptip',
                required: false
              }, {
                model: _models["default"].thunder,
                as: 'thunder',
                required: false
              }, {
                model: _models["default"].thundertip,
                as: 'thundertip',
                required: false
              }, {
                model: _models["default"].thunderstorm,
                as: 'thunderstorm',
                required: false
              }, {
                model: _models["default"].thunderstormtip,
                as: 'thunderstormtip',
                required: false
              }]
            };
            _context.next = 11;
            return _models["default"].activity.findAll(options);

          case 11:
            res.locals.activity = _context.sent;
            next();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchActivity(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchActivity = fetchActivity;