"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discordMining = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _sequelize = require("sequelize");

var _discord = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _rclient = require("../../services/rclient");

/* eslint-disable import/prefer-default-export */
var discordMining = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message, halvingData, io) {
    var activity;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            activity = [];
            _context3.next = 3;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, currentBlockHeight, miningInfo, networkMSOL, expectBlocksPerDay, title, nextBlockHalving, currentBlockReward, niceHashRateCost, rentalCostBTC, fetchKMDRentalPrice, fetchPirateKomodoprice, fetchPirateBTCprice, rentalCostKMD, pirateKomodoPrice, pirateBitcoinPrice, difficultyInG, preActivity, finalActivity;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, 'mining');

                      case 2:
                        _yield$userWalletExis = _context.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return (0, _rclient.getInstance)().getBlockCount();

                      case 11:
                        currentBlockHeight = _context.sent;
                        _context.next = 14;
                        return (0, _rclient.getInstance)().getMiningInfo();

                      case 14:
                        miningInfo = _context.sent;
                        networkMSOL = miningInfo.networksolps / 1e6; // const expectBlocksPerDay = ((100 / ((1e6 / miningInfo.difficulty) * 100)) / 1440);
                        // const expectBlocksPerDay = (86400 / ((miningInfo.networksolps / 1e6) * 60));

                        expectBlocksPerDay = 1440 / (miningInfo.networksolps / 1e6);
                        title = 'Privatebay Powder Monkey';
                        nextBlockHalving = 0;
                        currentBlockReward = halvingData.initialBlockReward;

                        do {
                          nextBlockHalving += halvingData.every;
                          currentBlockReward /= 2;
                        } while (nextBlockHalving < currentBlockHeight);

                        currentBlockReward *= 2;
                        _context.next = 24;
                        return _axios["default"].get("https://api2.nicehash.com/main/api/v2/hashpower/order/price?market=USA&algorithm=EQUIHASH");

                      case 24:
                        niceHashRateCost = _context.sent;
                        // returns price in BTC cost GSOL / day
                        rentalCostBTC = (niceHashRateCost.data.price / 1000).toFixed(8);
                        _context.next = 28;
                        return _axios["default"].get("https://api.coinpaprika.com/v1/price-converter?base_currency_id=btc-bitcoin&quote_currency_id=kmd-komodo&amount=".concat(rentalCostBTC));

                      case 28:
                        fetchKMDRentalPrice = _context.sent;
                        _context.next = 31;
                        return _axios["default"].get("https://api.coinpaprika.com/v1/price-converter?base_currency_id=arrr-pirate&quote_currency_id=kmd-komodo&amount=1");

                      case 31:
                        fetchPirateKomodoprice = _context.sent;
                        _context.next = 34;
                        return _axios["default"].get("https://api.coinpaprika.com/v1/price-converter?base_currency_id=arrr-pirate&quote_currency_id=btc-bitcoin&amount=1");

                      case 34:
                        fetchPirateBTCprice = _context.sent;
                        rentalCostKMD = fetchKMDRentalPrice.data.price.toFixed(8);
                        pirateKomodoPrice = fetchPirateKomodoprice.data.price.toFixed(8);
                        pirateBitcoinPrice = fetchPirateBTCprice.data.price.toFixed(8);
                        difficultyInG = (miningInfo.difficulty / 1e9).toFixed(2);
                        _context.next = 41;
                        return message.channel.send({
                          embeds: [(0, _discord.miningMessage)(title, currentBlockReward, niceHashRateCost.data.price, networkMSOL, expectBlocksPerDay, rentalCostBTC, rentalCostKMD, pirateKomodoPrice, pirateBitcoinPrice, difficultyInG)]
                        });

                      case 41:
                        _context.next = 43;
                        return _models["default"].activity.create({
                          type: 'mining_s',
                          earnerId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 43:
                        preActivity = _context.sent;
                        _context.next = 46;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].user,
                            as: 'earner'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 46:
                        finalActivity = _context.sent;
                        activity.unshift(finalActivity);

                      case 48:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _models["default"].error.create({
                          type: 'halving',
                          error: "".concat(err)
                        });

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context2.t0));

                      case 8:
                        _logger["default"].error("Error Discord Halving Requested by: ".concat(message.author.id, "-").concat(message.author.username, "#").concat(message.author.discriminator, " - ").concat(err));

                        _context2.next = 11;
                        return message.channel.send({
                          embeds: [(0, _discord.discordErrorMessage)("Halving")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 5]]);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function discordMining(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.discordMining = discordMining;