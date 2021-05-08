import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

const fetchJackpots = async (req, res, next) => {
  console.log('Fetch Jackpots here');
  try {
    res.locals.jackpots = await db.jackpot.findAll({
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: [
          'winnerOneId',
          'winnerTwoId',
          'winnerThreeId',
          'winnerFourId',
          'winnerFiveId',
          'winnerSixId',
          'winnerSevenId',
          'winnerEigthId',
          'winnerNineId',
          'winnerTenId',
          'userId',
        ],
      },
      include: [
        {
          model: db.user,
          as: 'winner_one',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_two',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_three',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_four',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_five',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_six',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_seven',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_eigth',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_nine',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'winner_ten',
          required: false,
          attributes: ['username'],
        },
      ],
    });
    console.log(res.locals.jackpots);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export default fetchJackpots;
