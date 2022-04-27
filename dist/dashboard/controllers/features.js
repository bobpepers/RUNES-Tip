"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFeature = exports.removeFeature = exports.fetchFeatures = exports.addFeature = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _models = _interopRequireDefault(require("../../models"));

// import { parseDomain } from "parse-domain";
var updateFeature = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var amount, fee, maxSampleSize, feature, updatedFeature;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = new _bignumber["default"](req.body.min).times(1e8).toNumber();
            fee = new _bignumber["default"](req.body.fee).times(1e2).toNumber();
            maxSampleSize = Number(req.body.maxSampleSize);
            console.log(fee);
            console.log('fee'); // Validate Fee

            if (!(maxSampleSize % 1 !== 0)) {
              _context.next = 7;
              break;
            }

            throw new Error("invalid number");

          case 7:
            if (!(maxSampleSize > 8000)) {
              _context.next = 9;
              break;
            }

            throw new Error("Max Sample Size is 8000");

          case 9:
            if (!(fee % 1 !== 0)) {
              _context.next = 11;
              break;
            }

            throw new Error("invalid number");

          case 11:
            if (!(fee < 0)) {
              _context.next = 13;
              break;
            }

            throw new Error("minimum fee is 0.00%");

          case 13:
            if (!(fee > 5000)) {
              _context.next = 15;
              break;
            }

            throw new Error("maximum fee is 50%");

          case 15:
            if (!(amount % 1 !== 0)) {
              _context.next = 17;
              break;
            }

            throw new Error("invalid number");

          case 17:
            if (!(amount < 1e4)) {
              _context.next = 19;
              break;
            }

            throw new Error("minimum amount is ".concat(1e4 / 1e8));

          case 19:
            _context.next = 21;
            return _models["default"].features.findOne({
              where: {
                id: req.body.id
              }
            });

          case 21:
            feature = _context.sent;
            _context.next = 24;
            return feature.update({
              min: amount,
              fee: fee,
              maxSampleSize: maxSampleSize,
              dashboardUserId: req.user.id,
              enabled: req.body.enabled
            });

          case 24:
            updatedFeature = _context.sent;
            res.locals.name = 'updateFeature';
            _context.next = 28;
            return _models["default"].features.findOne({
              where: {
                id: updatedFeature.id
              },
              include: [{
                model: _models["default"].dashboardUser,
                as: 'dashboardUser',
                required: false
              }, {
                model: _models["default"].channel,
                as: 'channel',
                required: false
              }, {
                model: _models["default"].group,
                as: 'group',
                required: false
              }]
            });

          case 28:
            res.locals.result = _context.sent;
            next();

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updateFeature(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateFeature = updateFeature;

var removeFeature = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var feature;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].features.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            feature = _context2.sent;
            res.locals.name = 'removeFeature';
            res.locals.result = feature;
            feature.destroy();
            next();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function removeFeature(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.removeFeature = removeFeature;

var fetchFeatures = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = {
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].dashboardUser,
                as: 'dashboardUser',
                required: false
              }, {
                model: _models["default"].channel,
                as: 'channel',
                required: false
              }, {
                model: _models["default"].group,
                as: 'group',
                required: false
              }]
            };
            res.locals.name = 'features';
            _context3.next = 4;
            return _models["default"].features.count(options);

          case 4:
            res.locals.count = _context3.sent;
            _context3.next = 7;
            return _models["default"].features.findAll(options);

          case 7:
            res.locals.result = _context3.sent;
            next();

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchFeatures(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetchFeatures = fetchFeatures;

var addFeature = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var featureOptions, amount, fee, options, feature, newFeature;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // console.log(req.body);
            featureOptions = {
              type: 'local'
            };

            if (req.body.feature) {
              _context4.next = 3;
              break;
            }

            throw new Error("Feature is required");

          case 3:
            if (req.body.server) {
              _context4.next = 5;
              break;
            }

            throw new Error("Server is required");

          case 5:
            if (req.body.min) {
              _context4.next = 7;
              break;
            }

            throw new Error("Minimum is required");

          case 7:
            if (req.body.fee) {
              _context4.next = 9;
              break;
            }

            throw new Error("Fee is required");

          case 9:
            if (req.body.enabled) {
              _context4.next = 11;
              break;
            }

            throw new Error("Enable is required");

          case 11:
            amount = new _bignumber["default"](req.body.min).times(1e8).toNumber();
            fee = new _bignumber["default"](req.body.fee).times(1e2).toNumber(); // Validate Fee

            if (!(fee % 1 !== 0)) {
              _context4.next = 15;
              break;
            }

            throw new Error("invalid number");

          case 15:
            if (!(fee < 1)) {
              _context4.next = 17;
              break;
            }

            throw new Error("minimum fee is 0.01%");

          case 17:
            if (!(req.body.feature === 'faucet')) {
              _context4.next = 22;
              break;
            }

            if (!(fee > 2500)) {
              _context4.next = 20;
              break;
            }

            throw new Error("maximum fee for faucet is 25%");

          case 20:
            _context4.next = 25;
            break;

          case 22:
            if (!(req.body.feature !== 'faucet')) {
              _context4.next = 25;
              break;
            }

            if (!(fee > 200)) {
              _context4.next = 25;
              break;
            }

            throw new Error("maximum fee is 2%");

          case 25:
            if (!(amount % 1 !== 0)) {
              _context4.next = 27;
              break;
            }

            throw new Error("invalid number");

          case 27:
            if (!(amount < 1e4)) {
              _context4.next = 29;
              break;
            }

            throw new Error("minimum amount is ".concat(1e4 / 1e8));

          case 29:
            if (req.body.feature) {
              featureOptions.name = req.body.feature;
            }

            if (req.body.server) {
              featureOptions.groupId = Number(req.body.server);
            }

            if (req.body.channel && req.body.channel !== 'all') {
              featureOptions.channelId = req.body.channel;
            }

            options = {
              where: featureOptions,
              order: [['id', 'DESC']]
            };
            _context4.next = 35;
            return _models["default"].features.findOne(options);

          case 35:
            feature = _context4.sent;

            if (!feature) {
              _context4.next = 38;
              break;
            }

            throw new Error("Already Exists");

          case 38:
            _context4.next = 40;
            return _models["default"].features.create({
              type: 'local',
              name: req.body.feature,
              groupId: req.body.server,
              channelId: req.body.channel && req.body.channel !== 'all' ? req.body.channel : null,
              min: amount,
              fee: fee,
              dashboardUserId: req.user.id,
              enabled: req.body.enabled === 'enable'
            });

          case 40:
            newFeature = _context4.sent;
            res.locals.name = 'addFeature';
            _context4.next = 44;
            return _models["default"].features.findOne({
              where: {
                id: newFeature.id
              },
              include: [{
                model: _models["default"].dashboardUser,
                as: 'dashboardUser',
                required: false
              }, {
                model: _models["default"].group,
                as: 'group',
                required: false
              }, {
                model: _models["default"].channel,
                as: 'channel',
                required: false
              }]
            });

          case 44:
            res.locals.result = _context4.sent;
            return _context4.abrupt("return", next());

          case 46:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function addFeature(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.addFeature = addFeature;