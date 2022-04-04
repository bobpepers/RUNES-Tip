"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePriceCurrencyPrices = exports.updatePriceCurrency = exports.removePriceCurrency = exports.fetchPriceCurrencies = exports.addPriceCurrency = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _updatePrice = require("../../helpers/price/updatePrice");

var _updateConversionRates = require("../../helpers/price/updateConversionRates");

// import BigNumber from "bignumber.js";
var updatePriceCurrency = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var currency, updatedCurrency;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.body.type) {
              res.locals.error = "type is required";
              next();
            }

            if (!req.body.name) {
              res.locals.error = "name is required";
              next();
            }

            if (!req.body.iso) {
              res.locals.error = "iso is required";
              next();
            }

            _context.next = 5;
            return _models["default"].currency.findOne({
              where: {
                id: req.body.id
              }
            });

          case 5:
            currency = _context.sent;
            _context.next = 8;
            return currency.update({
              currency_name: req.body.name,
              iso: req.body.iso,
              type: req.body.type
            });

          case 8:
            updatedCurrency = _context.sent;
            _context.next = 11;
            return _models["default"].currency.findOne({
              where: {
                id: updatedCurrency.id
              }
            });

          case 11:
            res.locals.currency = _context.sent;
            next();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updatePriceCurrency(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.updatePriceCurrency = updatePriceCurrency;

var updatePriceCurrencyPrices = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _updateConversionRates.updateConversionRatesCrypto)();

          case 3:
            _context2.next = 5;
            return (0, _updateConversionRates.updateConversionRatesFiat)();

          case 5:
            _context2.next = 7;
            return (0, _updatePrice.updatePrice)();

          case 7:
            res.locals.currency = true;
            next();
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            res.locals.error = "ERROR UPDATING PRICES";
            next();

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function updatePriceCurrencyPrices(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updatePriceCurrencyPrices = updatePriceCurrencyPrices;

var removePriceCurrency = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var currency;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].currency.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            currency = _context3.sent;
            res.locals.currency = currency;
            currency.destroy();
            next();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function removePriceCurrency(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.removePriceCurrency = removePriceCurrency;

var fetchPriceCurrencies = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = {
              order: [['id', 'DESC']]
            };
            _context4.next = 3;
            return _models["default"].currency.findAll(options);

          case 3:
            res.locals.currencies = _context4.sent;
            next();

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchPriceCurrencies(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.fetchPriceCurrencies = fetchPriceCurrencies;

var addPriceCurrency = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var currency;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(req.body);

            if (!req.body.name) {
              res.locals.error = 'Name is required';
              next();
            }

            if (!req.body.iso) {
              res.locals.error = 'Iso is required';
              next();
            }

            if (!req.body.type) {
              res.locals.error = 'Type is required';
              next();
            }

            _context5.next = 6;
            return _models["default"].currency.findOne({
              where: {
                iso: req.body.iso
              }
            });

          case 6:
            currency = _context5.sent;

            if (currency) {
              res.locals.error = "Already Exists";
              next();
            }

            if (currency) {
              _context5.next = 13;
              break;
            }

            _context5.next = 11;
            return _models["default"].currency.create({
              type: req.body.type,
              currency_name: req.body.name,
              iso: req.body.iso
            });

          case 11:
            res.locals.currency = _context5.sent;
            next();

          case 13:
            next();

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function addPriceCurrency(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.addPriceCurrency = addPriceCurrency;