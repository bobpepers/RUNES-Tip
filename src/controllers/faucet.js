import { Rweb3 } from 'rweb3';
import db from '../models';
import { getInstance } from '../services/rclient';
// Name of the file : sha512-hash.js
// Loading the crypto module in node.js
import { generateRandomString } from '../helpers/generateRandomString';

const crypto = require('crypto');

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Fetch Wallet
 */
export const fetchFaucetRecord = async (req, res, next) => {
  console.log('Fetch fetchFaucetRecord here');
  try {
    const faucetRecord = await db.faucet.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!faucetRecord) {
      console.log('not found record');
      res.locals.faucetRecord = await db.faucet.create({
        userId: req.user.id,
      });
    }
    if (faucetRecord) {
      console.log('found record');
      res.locals.faucetRecord = faucetRecord;
    }
    next();
  } catch (error) {
    console.log(error);
    console.log('error');
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch Wallet
 */
export const fetchFaucetRolls = async (req, res, next) => {
  console.log('Fetch fetchFaucetRecord here');
  try {
    res.locals.faucetRolls = await db.faucetRolls.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.faucet,
          as: 'faucet',
          where: {
            userId: req.user.id,
          },
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    console.log('error');
    res.locals.error = error;
    next();
  }
};

const roll = (serverSeed, clientSeed, nonce) => {
  const keyString = `${clientSeed}-${nonce}`;
  const hash = crypto.createHash('sha512');
  const data = hash.update(serverSeed + keyString, 'utf-8');
  const genHash = data.digest('hex');
  console.log(`hash : ${genHash}`);
  const random = parseInt(genHash.substring(0, 5), 16) / 1048576;
  console.log(data);
  console.log(random);
  const max = 10001;
  return Math.floor(random * max);
};

/**
 * Fetch Wallet
 */
export const generateHash = (a) => crypto.createHmac('sha256', 'SuperSexySecret').update(a).digest('hex');
export const claimFaucet = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const serverseed = generateRandomString(24);
    const clientseed = generateRandomString(24);
    const nonce = `${new Date().valueOf()}${Math.floor(Math.random() * 11)}`;
    const salt = 'salty';
    const faucetRecord = await db.faucet.findOne({
      where: {
        userId: req.user.id,
      },
      attributes: [
        'id',
        'earned',
        'updatedAt',
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (faucetRecord.updatedAt > new Date(Date.now() - (10 * 60 * 1000))) {
      throw new Error('FAUCET_CLAIM_TOO_FAST');
    }

    const wallet = await db.wallet.findOne({
      where: {
        userId: req.user.id,
      },
      attributes: [
        'id',
        'available',
        'locked',
        'earned',
        'spend',
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('WALLET_NOT_FOUND');
    }

    const rolled = roll(serverseed, clientseed, nonce);
    let won;
    if (rolled === 10000) {
      won = 50 * 1e8;
    } else if (rolled < 10000 && rolled >= 9998) {
      won = 15 * 1e8;
    } else if (rolled < 9998 && rolled >= 9994) {
      won = 5 * 1e8;
    } else if (rolled < 9994 && rolled >= 9986) {
      won = 2 * 1e8;
    } else if (rolled < 9986 && rolled >= 9886) {
      won = 0.5 * 1e8;
    } else if (rolled < 9886 && rolled >= 0) {
      won = 0.15 * 1e8;
    } else {
      won = 0;
    }
    // const won2 = (
    //  rolled === 10000 ? 50 * 1e8
    //    : rolled < 10000 && rolled >= 9998 ? 15 * 1e8
    //      : rolled < 9998 && rolled >= 9994 ? 5 * 1e8
    //        : rolled < 9994 && rolled >= 9986 ? 2 * 1e8
    //          : null);

    res.locals.faucetRecord = await faucetRecord.update({
      earned: faucetRecord.earned + won,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    console.log(wallet);

    res.locals.wallet = await wallet.update({
      available: wallet.available + won,
      earned: wallet.earned + won,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.faucetRoll = await db.faucetRolls.create({
      rolled,
      serverseed,
      clientseed,
      nonce,
      faucetId: faucetRecord.id,
      claimAmount: won,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const createActivity = await db.activity.create({
      type: 'faucetClaim',
      amount: won,
      earnerId: req.user.id,
      earner_balance: (res.locals.wallet.locked + res.locals.wallet.available),
      faucetRollId: res.locals.faucetRoll.id,
      ipId: res.locals.ipId,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.activity = await db.activity.findOne({
      where: {
        id: createActivity.id,
      },
      attributes: [
        'createdAt',
        'type',
        'amount',
      ],
      include: [
        {
          model: db.user,
          as: 'earner',
          required: false,
          attributes: ['username'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const newUser = await db.user.findOne({
      where: {
        id: req.user.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!newUser) {
      throw new Error('USER_NOT_FOUND');
    }

    const updatedUser = await newUser.update({
      jackpot_tickets: newUser.jackpot_tickets + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpot = await db.jackpot.findOne({
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const updatedJackpot = await jackpot.update({
      total_tickets: jackpot.total_tickets + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.jackpot_tickets = updatedUser.jackpot_tickets;
    res.locals.jackpot = updatedJackpot;
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

// creating hash object

// Printing the output on the console
