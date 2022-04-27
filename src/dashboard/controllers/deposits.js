// import { parseDomain } from "parse-domain";
import { Op } from 'sequelize';
import db from '../../models';
import { patchPirateDeposits } from "../../helpers/blockchain/pirate/patcher";
import { patchRunebaseDeposits } from "../../helpers/blockchain/runebase/patcher";
import { patchKomodoDeposits } from "../../helpers/blockchain/komodo/patcher";
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const patchDeposits = async (
  req,
  res,
  next,
) => {
  if (settings.coin.setting === 'Runebase') {
    await patchRunebaseDeposits();
  } else if (settings.coin.setting === 'Pirate') {
    await patchPirateDeposits();
  } else if (settings.coin.setting === 'Komodo') {
    await patchKomodoDeposits();
  } else {
    await patchRunebaseDeposits();
  }
  res.locals.result = 'true';
  next();
};

export const fetchDeposits = async (
  req,
  res,
  next,
) => {
  const transactionOptions = {
    type: 'receive',
  };
  const userOptions = {};

  if (req.body.id !== '') {
    transactionOptions.id = { [Op.like]: `%${Number(req.body.id)}%` };
  }
  if (req.body.txId !== '') {
    transactionOptions.txid = { [Op.like]: `%${req.body.txId}%` };
  }
  if (req.body.from !== '') {
    transactionOptions.to_from = { [Op.like]: `%${req.body.from}%` };
  }
  if (req.body.userId !== '') {
    userOptions.user_id = { [Op.like]: `%${req.body.userId}%` };
  }
  if (req.body.username !== '') {
    userOptions.username = { [Op.like]: `%${req.body.username}%` };
  }

  const options = {
    where: transactionOptions,
    limit: req.body.limit,
    offset: req.body.offset,
    order: [
      ['id', 'DESC'],
    ],
    include: [
      {
        model: db.user,
        as: 'user',
        where: userOptions,
      },
      {
        model: db.address,
        as: 'address',
        include: [
          {
            model: db.wallet,
            as: 'wallet',
          },
        ],
      },
    ],
  };

  res.locals.name = 'deposit';
  res.locals.count = await db.transaction.count(options);
  res.locals.result = await db.transaction.findAll(options);
  next();
};
