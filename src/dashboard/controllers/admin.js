import nodemailer from 'nodemailer';
// import axios from 'axios';
import db from '../../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../../services/rclient');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    requireTLS: true,
  },
});

export const fetchAdminLiability = async (req, res, next) => {
  let available = 0;
  let locked = 0;
  let unconfirmedDeposits = 0;
  let unconfirmledWithdrawals = 0;

  try {
    const sumAvailable = await db.wallet.findAll({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('available')), 'total_available'],
      ],
    });

    const sumLocked = await db.wallet.findAll({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('locked')), 'total_locked'],
      ],
    });

    const sumUnconfirmedDeposits = await db.transaction.findAll({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
      ],
      where: {
        [Op.and]: [
          {
            type: 'receive',
          },
          {
            phase: 'confirming',
          },
        ],
      },
    });

    const sumUnconfirmedWithdrawals = await db.transaction.findAll({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
      ],
      where: {
        [Op.and]: [
          {
            type: 'send',
          },
          {
            phase: 'confirming',
          },
        ],
      },

    });

    console.log(sumAvailable);
    console.log(sumLocked);
    console.log(sumUnconfirmedDeposits);
    console.log(sumUnconfirmedWithdrawals);

    available = sumAvailable[0].dataValues.total_available ? sumAvailable[0].dataValues.total_available : 0;
    locked = sumLocked[0].dataValues.total_locked ? sumLocked[0].dataValues.total_locked : 0;
    unconfirmedDeposits = sumUnconfirmedDeposits[0].dataValues.total_amount ? sumUnconfirmedDeposits[0].dataValues.total_amount : 0;
    unconfirmledWithdrawals = sumUnconfirmedWithdrawals[0].dataValues.total_amount ? sumUnconfirmedWithdrawals[0].dataValues.total_amount : 0;

    res.locals.liability = ((Number(available) + Number(locked)) + Number(unconfirmedDeposits)) - Number(unconfirmledWithdrawals);

    console.log('sumAvailable');

    console.log(available);
    console.log(locked);
    console.log(unconfirmedDeposits);
    console.log(unconfirmledWithdrawals);
    console.log(res.locals.liability);
    // const response = await getInstance().getWalletInfo();
    // console.log(response);
    // res.locals.balance = response.balance;
    // console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminNodeBalance = async (req, res, next) => {
  try {
    const response = await getInstance().getWalletInfo();
    console.log(response);
    res.locals.balance = response.balance;
    // console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * isAdmin
 */
export const isAdmin = async (req, res, next) => {
  console.log('req.user.role');
  console.log(req.user.role);
  if (req.user.role !== 4 && req.user.role !== 8) {
    console.log('unauthorized');
    res.status(401).send({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
};
