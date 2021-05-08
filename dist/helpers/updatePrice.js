'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updatePrice = async function updatePrice(io) {
  try {
    // create Only needed when there is no stats record yet in mysql
    _models2.default.priceInfo.findOrCreate({
      where: {
        id: 1
      },
      defaults: {
        id: 1,
        price: "0"
      }
    }).then(function (result) {
      if (!result) {
        console.log('already exists');
      }
      console.log('Created...');
    });
    // Get data from coinpaprika
    var data = await _axios2.default.get("https://api.coinpaprika.com/v1/ticker/runes-runebase");
    if (data.data) {
      var priceInfo = await _models2.default.priceInfo.findOne({
        where: {
          id: 1
        }
      });

      if (!priceInfo) {
        throw new Error('PRICE_INFO_NOT_FOUND');
      }

      var price = await priceInfo.update({
        price: data.data.price_usd
      });
      io.emit('updatePrice', price);
    }
    console.log('updated price');
    return;
  } catch (error) {
    console.error(error);
  }
};

exports.default = updatePrice;