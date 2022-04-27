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
            if (req.body.type) {
              _context.next = 2;
              break;
            }

            throw new Error("type is required");

          case 2:
            if (req.body.name) {
              _context.next = 4;
              break;
            }

            throw new Error("name is required");

          case 4:
            if (req.body.iso) {
              _context.next = 6;
              break;
            }

            throw new Error("iso is required");

          case 6:
            _context.next = 8;
            return _models["default"].currency.findOne({
              where: {
                id: req.body.id
              }
            });

          case 8:
            currency = _context.sent;
            _context.next = 11;
            return currency.update({
              currency_name: req.body.name,
              iso: req.body.iso,
              type: req.body.type
            });

          case 11:
            updatedCurrency = _context.sent;
            res.locals.name = 'updatePriceCurrency';
            _context.next = 15;
            return _models["default"].currency.findOne({
              where: {
                id: updatedCurrency.id
              }
            });

          case 15:
            res.locals.result = _context.sent;
            next();

          case 17:
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
            _context2.next = 2;
            return (0, _updateConversionRates.updateConversionRatesCrypto)();

          case 2:
            _context2.next = 4;
            return (0, _updateConversionRates.updateConversionRatesFiat)();

          case 4:
            _context2.next = 6;
            return (0, _updatePrice.updatePrice)();

          case 6:
            res.locals.name = 'updatePriceCurrencyPrice';
            res.locals.result = {
              success: true
            };
            next();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
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
            res.locals.name = 'removePriceCurrency';
            res.locals.result = currency;
            currency.destroy();
            next();

          case 7:
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
            res.locals.name = 'priceCurrencies';
            _context4.next = 4;
            return _models["default"].currency.count(options);

          case 4:
            res.locals.count = _context4.sent;
            _context4.next = 7;
            return _models["default"].currency.findAll(options);

          case 7:
            res.locals.result = _context4.sent;
            next();

          case 9:
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

            if (req.body.name) {
              _context5.next = 3;
              break;
            }

            throw new Error("Name is required");

          case 3:
            if (req.body.iso) {
              _context5.next = 5;
              break;
            }

            throw new Error("Iso is required");

          case 5:
            if (req.body.type) {
              _context5.next = 7;
              break;
            }

            throw new Error("Type is required");

          case 7:
            _context5.next = 9;
            return _models["default"].currency.findOne({
              where: {
                iso: req.body.iso
              }
            });

          case 9:
            currency = _context5.sent;

            if (!currency) {
              _context5.next = 12;
              break;
            }

            throw new Error("Already Exists");

          case 12:
            res.locals.name = 'addPriceCurrency';
            _context5.next = 15;
            return _models["default"].currency.create({
              type: req.body.type,
              currency_name: req.body.name,
              iso: req.body.iso
            });

          case 15:
            res.locals.result = _context5.sent;
            next();

          case 17:
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