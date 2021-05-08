'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var fetchJackpots = async function fetchJackpots(req, res, next) {
  console.log('Fetch Jackpots here');
  try {
    res.locals.jackpots = await _models2.default.jackpot.findAll({
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['winnerOneId', 'winnerTwoId', 'winnerThreeId', 'winnerFourId', 'winnerFiveId', 'winnerSixId', 'winnerSevenId', 'winnerEigthId', 'winnerNineId', 'winnerTenId', 'userId']
      },
      include: [{
        model: _models2.default.user,
        as: 'winner_one',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_two',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_three',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_four',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_five',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_six',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_seven',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_eigth',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_nine',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'winner_ten',
        required: false,
        attributes: ['username']
      }]
    });
    console.log(res.locals.jackpots);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

exports.default = fetchJackpots;