"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchActivity = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../../models"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var fetchActivity = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var activityOptions, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // const spenderOptions = {};
            // const earnerOptions = {};
            activityOptions = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, req.body.amount !== '' && {
              amount: Number((Number(req.body.amount) * 1e8).toFixed(0))
            }), req.body.type !== '' && {
              type: (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.type, "%"))
            }), req.body.id !== '' && (0, _defineProperty2["default"])({}, _sequelize.Op.or, [_sequelize.Sequelize.where(_sequelize.Sequelize.cast(_sequelize.Sequelize.col('activity.id'), 'CHAR'), 'LIKE', "%".concat(req.body.id, "%"))])), (req.body.earner !== '' || req.body.spender !== '') && (0, _defineProperty2["default"])({}, _sequelize.Op.or, [{
              '$earner.user_id$': (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.earner !== '' ? req.body.earner : null, "%"))
            }, {
              '$earner.username$': (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.earner !== '' ? req.body.earner : null, "%"))
            }, {
              '$spender.user_id$': (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.spender !== '' ? req.body.spender : null, "%"))
            }, {
              '$spender.username$': (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.body.spender !== '' ? req.body.spender : null, "%"))
            }]));
            options = {
              where: activityOptions,
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              include: [{
                model: _models["default"].user,
                as: 'spender',
                // where: spenderOptions,
                required: false
              }, {
                model: _models["default"].user,
                as: 'earner',
                // where: earnerOptions,
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
                model: _models["default"].trivia,
                as: 'trivia',
                required: false
              }, {
                model: _models["default"].triviatip,
                as: 'triviatip',
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
            res.locals.name = 'activities';
            _context.next = 5;
            return _models["default"].activity.count(options);

          case 5:
            res.locals.count = _context.sent;
            _context.next = 8;
            return _models["default"].activity.findAll(options);

          case 8:
            res.locals.result = _context.sent;
            next();

          case 10:
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