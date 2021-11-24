"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePrice = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _dotenv = require("dotenv");

var _models = _interopRequireDefault(require("../models"));

var _settings = _interopRequireDefault(require("../config/settings"));

// import { Sequelize, Transaction, Op } from "sequelize";
(0, _dotenv.config)();

var updatePrice = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var createFirstRecord, data, priceInfo, newPrice, price, currencies, currentPrice, promises, openExchangeOptions;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _models["default"].priceInfo.findOrCreate({
              where: {
                id: 1
              },
              defaults: {
                id: 1,
                price: "0",
                currency: "USD"
              }
            });

          case 3:
            createFirstRecord = _context5.sent;

            if (!createFirstRecord) {
              console.log('already exists');
            } else {
              console.log('Created...');
            } // Get data from coinpaprika


            _context5.next = 7;
            return _axios["default"].get("https://api.coinpaprika.com/v1/tickers/".concat(_settings["default"].coin.ticker.toLowerCase(), "-").concat(_settings["default"].coin.name.toLowerCase()));

          case 7:
            data = _context5.sent;

            if (!data.data) {
              _context5.next = 29;
              break;
            }

            _context5.next = 11;
            return _models["default"].priceInfo.findOne({
              where: {
                id: 1
              }
            });

          case 11:
            priceInfo = _context5.sent;

            if (priceInfo) {
              _context5.next = 14;
              break;
            }

            throw new Error('PRICE_INFO_NOT_FOUND');

          case 14:
            newPrice = Number(data.data.quotes.USD.price) + Number(data.data.quotes.USD.price) / 100;
            _context5.next = 17;
            return priceInfo.update({
              price: newPrice.toFixed(8).toString()
            });

          case 17:
            price = _context5.sent;
            _context5.next = 20;
            return _models["default"].currency.findAll({});

          case 20:
            currencies = _context5.sent;
            currencies.forEach( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(currency) {
                var _createFirstRecord;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(currency.iso !== null || currency.iso !== "USD")) {
                          _context.next = 5;
                          break;
                        }

                        _context.next = 3;
                        return _models["default"].priceInfo.findOrCreate({
                          where: {
                            currency: currency.iso
                          },
                          defaults: {
                            price: "0",
                            currency: currency.iso
                          }
                        });

                      case 3:
                        _createFirstRecord = _context.sent;

                        if (!_createFirstRecord) {
                          console.log('already exists');
                        } else {
                          console.log('Created...');
                        }

                      case 5:
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
            _context5.next = 24;
            return _models["default"].priceInfo.findOne({
              where: {
                id: 1
              }
            });

          case 24:
            currentPrice = _context5.sent;
            promises = [];
            openExchangeOptions = {
              method: 'GET',
              url: "https://openexchangerates.org/api/latest.json?app_id=".concat(process.env.OPEN_EXCHANGE_RATES_KEY, "&show_alternative=1")
            };

            _axios["default"].request(openExchangeOptions).then( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(response) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        Object.keys(response.data.rates).forEach( /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(currency) {
                            var currenciesExist, priceRecord;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return _models["default"].currency.findOne({
                                      where: {
                                        iso: currency
                                      }
                                    });

                                  case 2:
                                    currenciesExist = _context2.sent;

                                    if (!currenciesExist) {
                                      _context2.next = 7;
                                      break;
                                    }

                                    _context2.next = 6;
                                    return _models["default"].priceInfo.update({
                                      price: (Number(currentPrice.price) * Number(response.data.rates[currency])).toFixed(8).toString()
                                    }, {
                                      where: {
                                        currency: currency
                                      }
                                    });

                                  case 6:
                                    priceRecord = _context2.sent;

                                  case 7:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x3) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 1:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }())["catch"](function (error) {
              console.error(error);
            });

            setTimeout(function () {
              Promise.all(promises).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                var priceRecords;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _models["default"].priceInfo.findAll({});

                      case 2:
                        priceRecords = _context4.sent;

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));
            }, 5000);

          case 29:
            console.log('updated price');
            return _context5.abrupt("return");

          case 33:
            _context5.prev = 33;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);

          case 36:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 33]]);
  }));

  return function updatePrice() {
    return _ref.apply(this, arguments);
  };
}();

exports.updatePrice = updatePrice;