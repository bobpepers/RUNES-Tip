import {
  Sequelize,
  Op,
} from 'sequelize';
import db from '../../models';
import { getInstance } from '../../services/rclient';

export const fetchAdminLiability = async (
  req,
  res,
  next,
) => {
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

    available = sumAvailable[0].dataValues.total_available ? sumAvailable[0].dataValues.total_available : 0;
    locked = sumLocked[0].dataValues.total_locked ? sumLocked[0].dataValues.total_locked : 0;
    unconfirmedDeposits = sumUnconfirmedDeposits[0].dataValues.total_amount ? sumUnconfirmedDeposits[0].dataValues.total_amount : 0;
    unconfirmledWithdrawals = sumUnconfirmedWithdrawals[0].dataValues.total_amount ? sumUnconfirmedWithdrawals[0].dataValues.total_amount : 0;

    res.locals.liability = ((Number(available) + Number(locked)) + Number(unconfirmedDeposits)) - Number(unconfirmledWithdrawals);

    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminNodeBalance = async (
  req,
  res,
  next,
) => {
  try {
    const response = await getInstance().getWalletInfo();
    console.log(response);
    res.locals.balance = response.balance;
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
export const isAdmin = async (
  req,
  res,
  next,
) => {
  if (req.user.role !== 4 && req.user.role !== 8) {
    res.status(401).send({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
};
