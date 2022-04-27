import {
  Sequelize,
  Op,
} from 'sequelize';
import db from '../../models';

export const fetchLiability = async (
  req,
  res,
  next,
) => {
  let available = 0;
  let locked = 0;
  let runningReactdrops = 0;
  let runningTrivia = 0;
  let unconfirmedDeposits = 0;
  let unconfirmledWithdrawals = 0;
  let faucetAmount = 0;

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

  const sumRunningReactdrops = await db.reactdrop.findAll({
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
    ],
    where: {
      [Op.and]: [
        {
          ended: false,
        },
      ],
    },
  });

  const sumRunningTrivia = await db.trivia.findAll({
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
    ],
    where: {
      [Op.and]: [
        {
          ended: false,
        },
      ],
    },
  });

  const faucet = await db.faucet.findOne();

  faucetAmount = faucet.amount ? faucet.amount : 0;
  available = sumAvailable[0].dataValues.total_available ? sumAvailable[0].dataValues.total_available : 0;
  locked = sumLocked[0].dataValues.total_locked ? sumLocked[0].dataValues.total_locked : 0;
  unconfirmedDeposits = sumUnconfirmedDeposits[0].dataValues.total_amount ? sumUnconfirmedDeposits[0].dataValues.total_amount : 0;
  unconfirmledWithdrawals = sumUnconfirmedWithdrawals[0].dataValues.total_amount ? sumUnconfirmedWithdrawals[0].dataValues.total_amount : 0;
  runningReactdrops = sumRunningReactdrops[0].dataValues.total_amount ? sumRunningReactdrops[0].dataValues.total_amount : 0;
  runningTrivia = sumRunningTrivia[0].dataValues.total_amount ? sumRunningTrivia[0].dataValues.total_amount : 0;

  res.locals.name = "liability";
  res.locals.result = {
    amount: (((Number(available) + Number(locked)) + Number(unconfirmedDeposits)) - Number(unconfirmledWithdrawals) + Number(runningTrivia) + Number(runningReactdrops) + Number(faucetAmount)),
  };

  next();
};
