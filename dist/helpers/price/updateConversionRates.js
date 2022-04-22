"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateConversionRatesFiat = exports.updateConversionRatesCrypto = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _lodash = _interopRequireDefault(require("lodash"));

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../../models"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var settings = (0, _settings["default"])();
(0, _dotenv.config)();

var updateConversionRatesFiat = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var currencies, fetchExchangeRatesData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].currency.findAll({
              where: {
                type: 'fiat'
              }
            });

          case 3:
            currencies = _context2.sent;
            _context2.next = 6;
            return _axios["default"].get("https://openexchangerates.org/api/latest.json?app_id=".concat(process.env.OPEN_EXCHANGE_RATES_KEY, "&show_alternative=1"));

          case 6:
            fetchExchangeRatesData = _context2.sent;
            currencies.forEach( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(currency) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!fetchExchangeRatesData.data.rates[currency.iso]) {
                          _context.next = 3;
                          break;
                        }

                        _context.next = 3;
                        return currency.update({
                          conversionRate: fetchExchangeRatesData.data.rates[currency.iso]
                        });

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function updateConversionRatesFiat() {
    return _ref.apply(this, arguments);
  };
}();

exports.updateConversionRatesFiat = updateConversionRatesFiat;

var updateConversionRatesCrypto = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var currencies;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].currency.findAll({
              where: {
                type: 'cryptocurrency'
              }
            });

          case 3:
            currencies = _context4.sent;
            currencies.forEach( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(currency) {
                var fetchExchangeRatesData;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _axios["default"].get("https://api.coinpaprika.com/v1/tickers/".concat(currency.iso.toLowerCase(), "-").concat(currency.currency_name.toLowerCase()));

                      case 3:
                        fetchExchangeRatesData = _context3.sent;

                        if (!fetchExchangeRatesData) {
                          _context3.next = 7;
                          break;
                        }

                        _context3.next = 7;
                        return currency.update({
                          conversionRate: (1 / Number(fetchExchangeRatesData.data.quotes.USD.price)).toFixed(8).toString()
                        });

                      case 7:
                        _context3.next = 12;
                        break;

                      case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3["catch"](0);
                        console.log(_context3.t0);

                      case 12:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 9]]);
              }));

              return function (_x2) {
                return _ref4.apply(this, arguments);
              };
            }());
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function updateConversionRatesCrypto() {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateConversionRatesCrypto = updateConversionRatesCrypto;