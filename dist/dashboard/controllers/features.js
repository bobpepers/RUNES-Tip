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

            if (maxSampleSize % 1 !== 0) {
              res.locals.error = "invalid number";
              next();
            }

            if (maxSampleSize > 8000) {
              res.locals.error = "Max Sample Size is 8000";
              next();
            }

            if (fee % 1 !== 0) {
              res.locals.error = "invalid number";
              next();
            }

            if (fee < 0) {
              res.locals.error = "minimum fee is 0.00%";
              next();
            }

            if (fee > 5000) {
              res.locals.error = "maximum fee is 50%";
              next();
            } // validate Amount


            if (amount % 1 !== 0) {
              res.locals.error = "invalid number";
              next();
            }

            if (amount < 1e4) {
              res.locals.error = "minimum amount is ".concat(1e4 / 1e8);
              next();
            }

            _context.next = 14;
            return _models["default"].features.findOne({
              where: {
                id: req.body.id
              }
            });

          case 14:
            feature = _context.sent;
            _context.next = 17;
            return feature.update({
              min: amount,
              fee: fee,
              maxSampleSize: maxSampleSize,
              dashboardUserId: req.user.id,
              enabled: req.body.enabled
            });

          case 17:
            updatedFeature = _context.sent;
            _context.next = 20;
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

          case 20:
            res.locals.feature = _context.sent;
            next();

          case 22:
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
            res.locals.feature = feature;
            feature.destroy();
            next();

          case 6:
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
            _context3.next = 3;
            return _models["default"].features.findAll(options);

          case 3:
            res.locals.features = _context3.sent;
            next();

          case 5:
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

            if (!req.body.feature) {
              res.locals.error = 'Feature is required';
              next();
            }

            if (!req.body.server) {
              res.locals.error = 'Server is required';
              next();
            }

            if (!req.body.min) {
              res.locals.error = 'Minimum is required';
              next();
            }

            if (!req.body.fee) {
              res.locals.error = 'Fee is required';
              next();
            }

            if (!req.body.enabled) {
              res.locals.error = 'Enable is required';
              next();
            }

            amount = new _bignumber["default"](req.body.min).times(1e8).toNumber();
            fee = new _bignumber["default"](req.body.fee).times(1e2).toNumber(); // Validate Fee

            if (fee % 1 !== 0) {
              res.locals.error = "invalid number";
              next();
            }

            if (fee < 1) {
              res.locals.error = "minimum fee is 0.01%";
              next();
            }

            if (fee > 200) {
              res.locals.error = "maximum fee is 2%";
              next();
            } // Validate Amount


            if (amount % 1 !== 0) {
              res.locals.error = "invalid number";
              next();
            }

            if (amount < 1e4) {
              res.locals.error = "minimum amount is ".concat(1e4 / 1e8);
              next();
            }

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
            _context4.next = 19;
            return _models["default"].features.findOne(options);

          case 19:
            feature = _context4.sent;

            if (feature) {
              res.locals.error = "Already Exists";
              next();
            }

            if (feature) {
              _context4.next = 29;
              break;
            }

            _context4.next = 24;
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

          case 24:
            newFeature = _context4.sent;
            _context4.next = 27;
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

          case 27:
            res.locals.feature = _context4.sent;
            // console.log(res.locals.feature);
            next();

          case 29:
            next();

          case 30:
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