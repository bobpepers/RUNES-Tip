import nodemailer from 'nodemailer';
import axios from 'axios';
import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');

require('dotenv').config();

/**
 * Create Withdrawal
 */
export const withdrawTelegramAdminFetch = async (bot, ctx, adminTelegramId) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('start the widtdddd');
    const withdrawal = await db.transaction.findOne({
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      where: {
        type: 'send',
        phase: 'review',
      },
    });

    if (!withdrawal) {
      ctx.reply('No Withdrawals');
    }
    if (withdrawal) {
      const withdrawalMessage = `${withdrawal.address.wallet.user.username} with user_id ${withdrawal.address.wallet.user.user_id}
available: ${withdrawal.address.wallet.available / 1e8} 
locked: ${withdrawal.address.wallet.locked / 1e8} 
amount: ${withdrawal.amount / 1e8} 
      `;
      ctx.deleteMessage();
      bot.telegram.sendMessage(adminTelegramId, withdrawalMessage, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "acceptWithdrawal",
              callback_data: `acceptWithdrawal-${withdrawal.id}`,
            },
            {
              text: "declineWithdrawal",
              callback_data: `declineWithdrawal-${withdrawal.id}`,
            },
            ],

          ],
        },
      });
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch((err) => {
    ctx.reply('Something went wrong');
  });
};

/**
 * isAdmin
 */
export const withdrawTelegramAdminAccept = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: withdrawalId,
        phase: 'review',
      },
      include: [
        {
          model: db.address,
          as: 'address',
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              include: [{
                model: db.user,
                as: 'user',
              }],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!transaction) {
      ctx.reply('Transaction not found');
    }
    if (transaction) {
      const amount = ((transaction.amount - (1 * 1e8)) / 1e8);
      const response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
      const updatedTrans = await transaction.update(
        {
          txid: response,
          phase: 'confirming',
          type: 'send',
        },
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      bot.telegram.sendMessage(adminTelegramId, `Withdrawal Accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`);
      bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`);
    }

    t.afterCommit(() => {
      withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
    });
  }).catch((err) => {
    bot.telegram.sendMessage(adminTelegramId, `Something went wrong`);
  });
  const newTransaction = await db.transaction.findOne({
    where: {
      id: withdrawalId,
      phase: 'confirming',
    },
    include: [
      {
        model: db.address,
        as: 'address',
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            include: [{
              model: db.user,
              as: 'user',
            }],
          },
        ],
      },
    ],
  });
  console.log(newTransaction.address.wallet.user.user_id);
  const userTelegramId = newTransaction.address.wallet.user.user_id.substring(9);
  console.log(userTelegramId);
  if (newTransaction) {
    bot.telegram.sendMessage(userTelegramId, `Your withdrawal has been accepted
https://explorer.runebase.io/tx/${newTransaction.txid}`);
  }
};

export const withdrawTelegramAdminDecline = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: withdrawalId,
        phase: 'review',
      },
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transaction) {
      ctx.reply('Transaction not found');
    }

    if (transaction) {
      const wallet = await db.wallet.findOne({
        where: {
          userId: transaction.address.wallet.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!wallet) {
        ctx.reply('Wallet not found');
      }
      if (wallet) {
        const updatedWallet = await wallet.update({
          available: wallet.available + transaction.amount,
          locked: wallet.locked - transaction.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const updatedTransaction = await transaction.update(
          {
            phase: 'rejected',
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        bot.telegram.sendMessage(adminTelegramId, `Withdrawal Rejected`);
      bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been rejected`);
      }
    }

    t.afterCommit(() => {
      withdrawTelegramAdminFetch(bot, ctx, adminTelegramId);
    });
  }).catch((err) => {
    bot.telegram.sendMessage(adminTelegramId, `Something went wrong`);
  });
  const newTransaction = await db.transaction.findOne({
    where: {
      id: withdrawalId,
      phase: 'rejected',
    },
    include: [
      {
        model: db.address,
        as: 'address',
        include: [
          {
            model: db.wallet,
            as: 'wallet',
            include: [{
              model: db.user,
              as: 'user',
            }],
          },
        ],
      },
    ],
  });
  console.log(newTransaction.address.wallet.user.user_id);
  const userTelegramId = newTransaction.address.wallet.user.user_id.substring(9);
  console.log(userTelegramId);
  if (newTransaction) {
    bot.telegram.sendMessage(userTelegramId, `Your withdrawal has been rejected`);
  }
};

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
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
    console.log('sumAvailable');
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
  if (req.user.role !== 4) {
    console.log('unauthorized');
    res.status(401).send({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminWithdrawals = async (req, res, next) => {
  console.log('fetchAdminWithdrawals');
  try {
    res.locals.withdrawals = await db.transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      where: {
        type: 'send',
      },
    });
    console.log(res.locals.withdrawals);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPendingWithdrawalsCount = async (req, res, next) => {
  try {
    const transactionCount = await db.transaction.count({
      where: {
        type: 'send',
        phase: 'review',
      },
    });
    res.locals.count = transactionCount;
    console.log('transactionCOunt');
    console.log(transactionCount);
    if (!transactionCount) {
      res.locals.count = '0';
    }
    console.log(res.locals.count);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPendingDisputeCount = async (req, res, next) => {
  try {
    const disputeCount = await db.dispute.count({
      where: {
        done: 'false',
      },
    });
    res.locals.count = disputeCount;
    console.log('disputeCount');
    console.log(disputeCount);
    if (!disputeCount) {
      res.locals.count = '0';
    }
    console.log(res.locals.count);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPendingIdentityCount = async (req, res, next) => {
  try {
    const userCount = await db.user.count({
      where: {
        identityVerified: 'pending',
      },
    });
    res.locals.count = userCount;
    console.log('userCOunt');
    console.log(userCount);
    if (!userCount) {
      res.locals.count = '0';
    }
    console.log(res.locals.count);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};
export const fetchAdminCurrentTrade = async (req, res, next) => {
  console.log(req.body.id);
  const trade = await db.trade.findOne({
    where: {
      id: req.body.id,
    },
    include: [
      {
        model: db.messages,
        as: 'messages',
        required: false,
        // attributes: ['username'],
        include: [
          {
            model: db.user,
            as: 'user',
            required: true,
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.user,
        as: 'user',
        required: true,
        attributes: ['username'],
      },
      {
        model: db.postAd,
        as: 'postAd',
        required: true,
        // attributes: ['username'],
        include: [
          {
            model: db.paymentMethod,
            as: 'paymentMethod',
            required: true,
            // attributes: ['username'],
          },
          {
            model: db.currency,
            as: 'currency',
            required: true,
            // attributes: ['username'],
          },
          {
            model: db.user,
            as: 'user',
            required: true,
            attributes: ['username'],
          },
        ],
      },
    ],
  });
  if (trade) {
    res.locals.trade = trade;
    return next();
  }
  res.locals.error = "TRADE_NOT_FOUND";
  next();
};

export const fetchAdminPendingDisputes = async (req, res, next) => {
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');
  console.log('fetchAdminDisputesPending');

  try {
    res.locals.disputes = await db.dispute.findAll({
      order: [['id', 'DESC']],
      where: {
        done: false,
      },
      include: [
        {
          model: db.user,
          as: 'initiator',
          required: false,
          attributes: [
            'username',
          ],
        },
        {
          model: db.user,
          as: 'releasedTo',
          required: false,
          attributes: [
            'username',
          ],
        },
        {
          model: db.trade,
          as: 'trade',
          required: true,
          include: [
            {
              model: db.user,
              as: 'user',
              attributes: [
                'username',
              ],
            },
            {
              model: db.postAd,
              as: 'postAd',
              include: [{
                model: db.user,
                as: 'user',
                attributes: [
                  'username',
                ],
              }],
            },
          ],
        }],
    });
    console.log(res.locals.disputes);
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");
    console.log("res.locals.disputes");

    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPendingWithdrawals = async (req, res, next) => {
  console.log('fetchAdminWithdrawals');
  try {
    res.locals.withdrawals = await db.transaction.findAll({
      order: [['id', 'DESC']],
      where: {
        type: 'send',
        phase: 'review',
      },
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
            attributes: [
              'username',
            ],
          }],
        }],
      }],
    });
    console.log(res.locals.withdrawals);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPendingIdentity = async (req, res, next) => {
  try {
    res.locals.users = await db.user.findAll({
      // order: [['id', 'DESC']],
      where: {
        identityVerified: 'pending',
      },
      attributes: [
        'id',
        'username',
        'email',
        'banned',
        'firstname',
        'lastname',
        'phoneNumber',
        'identityFront',
        'identityBack',
        'identitySelfie',
        'identityVerified',
      ],

    });
    console.log('after find all');
    console.log(res.locals.users);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminUserList = async (req, res, next) => {
  try {
    res.locals.userlist = await db.user.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: db.wallet,
        as: 'wallet',
        include: [{
          model: db.address,
          as: 'addresses',
        }],
      }],
    });
    console.log('after find all');
    console.log(res.locals.userlist);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminUser = async (req, res, next) => {
  try {
    res.locals.user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
      attributes: ['id', 'username', 'email', 'banned', 'firstname', 'lastname'],
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.address,
            as: 'addresses',
          }],
        },
        {
          model: db.activity,
          // required: false,
          as: 'spender',
        },
        {
          model: db.activity,
          // required: false,
          as: 'earner',
        },
        // {
        //  model: db.activityArchive,
        // required: false,
        //  as: 'archivedSpender',
        // },
        // {
        //  model: db.activityArchive,
        // required: false,
        //  as: 'archivedEarner',
        // },
        // {
        //  model: db.webslot,
        //  as: 'webslots',
        //  required: false,
        //  include: [
        //    {
        //      model: db.order,
        //      as: 'order',
        //      required: false,
        //    },
        //    {
        //      model: db.domain,
        //      as: 'domain',
        //      required: false,
        //    },
        //  ],
        // },
      ],
    });
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
export const acceptWithdraw = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [
        {
          model: db.address,
          as: 'address',
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              include: [{
                model: db.user,
                as: 'user',
              }],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }
    const amount = (((transaction.amount / 100) * 99) / 1e8);
    console.log((amount.toFixed(8)).toString());
    console.log('before reps');
    console.log(transaction.to_from);
    console.log(amount.toFixed(8).toString());

    const response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log('999999999999');
    console.log(amount);
    console.log(response);
    res.locals.transaction = await transaction.update(
      {
        txid: response,
        phase: 'confirming',
        type: 'send',
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const activity = await db.activity.create(
      {
        spenderId: transaction.address.wallet.userId,
        type: 'withdrawAccepted',
        txId: transaction.id,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    res.locals.activity = await db.activity.findOne({
      where: {
        id: activity.id,
      },
      attributes: [
        'createdAt',
        'type',
      ],
      include: [
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    t.afterCommit(() => {
      console.log('complete');
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

/**
 * isAdmin
 */
export const rejectWithdraw = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }

    const wallet = await db.wallet.findOne({
      where: {
        userId: transaction.address.wallet.userId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('WALLET_NOT_EXIST');
    }

    const updatedWallet = await wallet.update({
      available: wallet.available + transaction.amount,
      locked: wallet.locked - transaction.amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.transaction = await transaction.update(
      {
        phase: 'rejected',
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    const activity = await db.activity.create(
      {
        spenderId: transaction.address.wallet.userId,
        type: 'withdrawRejected',
        txId: res.locals.transaction.id,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    res.locals.activity = await db.activity.findOne({
      where: {
        id: activity.id,
      },
      attributes: [
        'createdAt',
        'type',
      ],
      include: [
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => {
      console.log('Withdrawal Rejected');
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
  console.log(req.body.id);
};

/**
 * Fetch admin publishers
 */
export const fetchAdminPublishers = async (req, res, next) => {
  try {
    res.locals.publishers = await db.publisher.findAll({
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
export const fetchAdminReviewPublishers = async (req, res, next) => {
  try {
    res.locals.publishers = await db.publisher.findAll({
      where: {
        verified: true,
        review: 'pending',
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
export const fetchAdminBanners = async (req, res, next) => {
  try {
    res.locals.banners = await db.banner.findAll({
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
        {
          model: db.user,
          // required: false,
          as: 'user',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminReviewBanners = async (req, res, next) => {
  try {
    res.locals.banners = await db.banner.findAll({
      where: {
        review: 'pending',
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
        {
          model: db.user,
          // required: false,
          as: 'user',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const acceptAdminPendingIdentity = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.identity = await user.update({
      identityVerified: 'accepted',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const rejectAdminPendingIdentity = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.identity = await user.update({
      identityVerified: 'rejected',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const acceptAdminReviewBanner = async (req, res, next) => {
  try {
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.banners = await banner.update({
      review: 'accepted',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const rejectAdminReviewBanner = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.banners = await banner.update({
      review: 'rejected',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminBanner = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    res.locals.banners = await banner.update({
      banned: !banner.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminPublisher = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const publisher = await db.publisher.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    res.locals.publishers = await publisher.update({
      banned: !publisher.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminUser = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
      include: [{
        model: db.wallet,
        as: 'wallet',
        include: [{
          model: db.address,
          as: 'addresses',
        }],
      }],
    });
    res.locals.users = await user.update({
      banned: !user.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminDomain = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const domain = await db.domain.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.domains = await domain.update({
      banned: !domain.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminDomains = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    res.locals.domains = await db.domain.findAll({});
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminCountries = async (req, res, next) => {
  try {
    res.locals.countries = await db.country.findAll({
      include: [
        {
          model: db.currency,
          as: 'currency',
          required: false,
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
export const fetchAdminDeposits = async (req, res, next) => {
  try {
    res.locals.deposits = await db.transaction.findAll({
      where: {
        type: 'receive',
      },
      order: [
        ['id', 'DESC'],
      ],
      include: [
        {
          model: db.address,
          as: 'address',
          required: false,
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              required: false,
              include: [
                {
                  model: db.user,
                  as: 'user',
                  required: false,
                  attributes: ['username'],
                },
              ],
            },
          ],
        },
      ],
    });

    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminTrades = async (req, res, next) => {
  try {
    res.locals.trades = await db.trade.findAll({
      order: [
        ['id', 'DESC'],
      ],
      include: [
        {
          model: db.user,
          as: 'user',
          required: true,
          attributes: ['username'],
        },
        {
          model: db.postAd,
          as: 'postAd',
          required: true,
          // attributes: ['username'],
          include: [
            {
              model: db.currency,
              as: 'currency',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.paymentMethod,
              as: 'paymentMethod',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.user,
              as: 'user',
              required: true,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const addAdminCountries = async (req, res, next) => {
  try {
    const country = await db.country.create({
      iso: req.body.iso,
      name: req.body.country,
      currencyId: req.body.currency,
      status: true,
    });
    res.locals.country = await db.country.findOne({
      where: {
        id: country.id,
      },
      include: [
        {
          model: db.currency,
          as: 'currency',
          required: false,
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminCurrencies = async (req, res, next) => {
  try {
    res.locals.currencies = await db.currency.findAll({});
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const addAdminCurrencies = async (req, res, next) => {
  try {
    res.locals.currencies = await db.currency.create({
      currency_name: req.body.name,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminPaymentMethod = async (req, res, next) => {
  try {
    res.locals.paymentMethod = await db.paymentMethod.findAll({});
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const updateAdminContestRewards = async (req, res, next) => {
  console.log(req.body);

  try {
    const rewards = await db.contestRewards.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    });
    if (!rewards) {
      throw new Error('CONTEST_REWARDS_NOT_EXIST');
    }

    const updatedRewards = await rewards[0].update({
      firstPlace: req.body.firstPlace,
      secondPlace: req.body.secondPlace,
      thirdPlace: req.body.thirdPlace,
      firstPlaceNext: req.body.firstPlaceNext,
      secondPlaceNext: req.body.secondPlaceNext,
      thirdPlaceNext: req.body.thirdPlaceNext,
    });

    res.locals.rewards = updatedRewards;
    console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminContestRewards = async (req, res, next) => {
  try {
    const rewards = await db.contestRewards.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    });

    console.log(rewards);

    if (!rewards || !rewards.length) {
      res.locals.rewards = await db.contestRewards.create({
        firstPlace: '50 USD',
        secondPlace: '2000 RUNES',
        thirdPlace: '1000 RUNES',
        firstPlaceNext: '25 USD',
        secondPlaceNext: '1000 RUNES',
        thirdPlaceNext: '500 RUNES',
      });
      return next();
    }

    res.locals.rewards = rewards;
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminMargin = async (req, res, next) => {
  try {
    const margin = await db.priceMargin.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');
    console.log('margin');

    console.log(margin);

    if (!margin || !margin.length) {
      res.locals.margin = await db.priceMargin.create({
        margin: 0,
      });
      return next();
    }

    res.locals.margin = margin;
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const addAdminPaymentMethod = async (req, res, next) => {
  try {
    res.locals.paymentMethod = await db.paymentMethod.create({
      name: req.body.name,
      description: req.body.description,
      status: true,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const updateAdminCountry = async (req, res, next) => {
  try {
    const country = await db.country.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (!country) {
      throw new Error('CURRENCY_NOT_EXIST');
    }
    await country.update({
      name: req.body.name,
      iso: req.body.iso,
      currencyId: req.body.currency,
    });
    res.locals.country = await db.country.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.currency,
          as: 'currency',
          required: false,
        },
      ],
    });
    console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const updateAdminCurrency = async (req, res, next) => {
  try {
    const currency = await db.currency.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (!currency) {
      throw new Error('CURRENCY_NOT_EXIST');
    }
    res.locals.currency = await currency.update({
      currency_name: req.body.name,
      iso: req.body.iso,
    });
    console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const updateAdminMargin = async (req, res, next) => {
  if (req.body.margin < 0) {
    throw new Error('MARGIN_MUST_BE_GREATER_THEN_ZERO');
  }
  if (req.body.margin > 100) {
    throw new Error('MARGIN_MUST_BE_LESS_THEN_HUNDERD');
  }

  try {
    const margin = await db.priceMargin.create({
      value: req.body.margin,
    });
    if (!margin) {
      throw new Error('CURRENCY_NOT_EXIST');
    }

    res.locals.margin = margin;
    console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const adminCompleteDispute = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('Finish the dispute here');
    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'disputed',
      },
      include: [
        {
          model: db.dispute,
          as: 'dispute',
          required: false,
          include: [
            {
              model: db.user,
              as: 'initiator',
              required: true,
              attributes: ['username'],
            },
          ],
          // attributes: ['username'],
        },
        {
          model: db.messages,
          as: 'messages',
          required: false,
          // attributes: ['username'],
          include: [
            {
              model: db.user,
              as: 'user',
              required: true,
              attributes: ['username'],
            },
          ],
        },
        {
          model: db.user,
          as: 'user',
          required: true,
          attributes: ['username'],
        },
        {
          model: db.postAd,
          as: 'postAd',
          required: true,
          // attributes: ['username'],
          include: [
            {
              model: db.paymentMethod,
              as: 'paymentMethod',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.currency,
              as: 'currency',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.user,
              as: 'user',
              required: true,
              attributes: ['username'],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!trade) {
      throw new Error('TRADE_NOT_EXIST');
    }

    console.log('1');

    const dispute = await db.dispute.findOne({
      where: {
        id: trade.dispute[0].id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!dispute) {
      throw new Error('DISPUTE_NOT_FOUND');
    }
    console.log('2');
    if (req.body.side === "trader") {
      if (trade.postAd.type === 'sell') {
        const walletOne = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const walletTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (walletTwo.locked < (trade.amount)) {
          throw new Error('INSUFFICIENT_LOCKED_BALANCE_ADVERTISER');
        }
        res.locals.walletUserTwo = await walletTwo.update({
          locked: walletTwo.locked - trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        res.locals.walletUserOne = await walletOne.update({
          available: walletOne.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await trade.update({
          type: 'disputedDone',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        await dispute.update({
          done: true,
          conclusion: req.body.conclusion,
          releasedTo: trade.userId,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (trade.postAd.type === 'buy') {
        console.log(trade.postAd.user.username);
        const walletOne = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        res.locals.walletUserTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (walletOne.locked < (trade.amount)) {
          throw new Error(`INSUFFICIENT_LOCKED_BALANCE_TRADER: ${walletOne.locked / 1e8}`);
        }
        res.locals.walletUserOne = await walletOne.update({
          locked: walletOne.locked - trade.amount,
          available: walletOne.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await trade.update({
          type: 'disputedDone',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        await dispute.update({
          done: true,
          conclusion: req.body.conclusion,
          releasedTo: trade.userId,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
    }
    if (req.body.side === "advertiser") {
      if (trade.postAd.type === 'sell') {
        res.locals.walletUserOne = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const walletTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (walletTwo.locked < (trade.amount)) {
          throw new Error('INSUFFICIENT_LOCKED_BALANCE_ADVERTISER');
        }
        res.locals.walletUserTwo = await walletTwo.update({
          locked: walletTwo.locked - trade.amount,
          available: walletTwo.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await trade.update({
          type: 'disputedDone',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        await dispute.update({
          done: true,
          conclusion: req.body.conclusion,
          releasedTo: trade.postAd.userId,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (trade.postAd.type === 'buy') {
        console.log(trade.postAd.user.username);
        const walletOne = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const walletTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (walletOne.locked < (trade.amount)) {
          throw new Error(`INSUFFICIENT_LOCKED_BALANCE_TRADER: ${walletOne.locked / 1e8}`);
        }
        res.locals.walletUserTwo = await walletTwo.update({
          available: walletTwo.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        res.locals.walletUserOne = await walletOne.update({
          locked: walletOne.locked - trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await trade.update({
          type: 'disputedDone',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        await dispute.update({
          done: true,
          conclusion: req.body.conclusion,
          releasedTo: trade.postAd.userId,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
    }

    res.locals.trade = await db.trade.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.dispute,
          as: 'dispute',
          required: false,
          include: [
            {
              model: db.messagesDispute,
              as: 'messagesDispute',
              required: false,
              // attributes: ['username'],
              include: [
                {
                  model: db.user,
                  as: 'user',
                  required: false,
                  attributes: ['username'],
                },
              ],
            },
            {
              model: db.user,
              as: 'initiator',
              required: true,
              attributes: ['username'],
            },
          ],
          // attributes: ['username'],
        },
        {
          model: db.messages,
          as: 'messages',
          required: false,
          // attributes: ['username'],
          include: [
            {
              model: db.user,
              as: 'user',
              required: true,
              attributes: ['username'],
            },
          ],
        },
        {
          model: db.user,
          as: 'user',
          required: true,
          attributes: ['username'],
        },
        {
          model: db.postAd,
          as: 'postAd',
          required: true,
          // attributes: ['username'],
          include: [
            {
              model: db.paymentMethod,
              as: 'paymentMethod',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.currency,
              as: 'currency',
              required: true,
              // attributes: ['username'],
            },
            {
              model: db.user,
              as: 'user',
              required: true,
              attributes: ['username'],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    console.log(res.locals.trade);
    console.log('TRADE AFTER DISPUTE SETTLED');

    if (!res.locals.trade) {
      throw new Error('TRADE_NOT_EXIST');
    }

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

function getPercentageChange(oldNumber, newNumber) {
  const decreaseValue = oldNumber - newNumber;

  return (decreaseValue / oldNumber) * 100;
}

export const sendAdminMassMail = async (req, res, next) => {
  console.log('start sendadminmail');

  console.log('start sendadminmail');
  const users = await db.user.findAll({
    where: {
      authused: true,
    },

    include: [
      {
        model: db.wallet,
        as: 'wallet',
        include: [{
          model: db.address,
          as: 'addresses',
        }],
      },
      {
        model: db.country,
        as: 'country',
        required: false,
        include: [
          {
            model: db.currency,
            as: 'currency',
            required: false,
          },
        ],
      }],
  });

  const dataOne = await axios.get("https://api.coinpaprika.com/v1/tickers/runes-runebase");
  const dataTwo = await axios.get("https://api.coinpaprika.com/v1/coins/runes-runebase/ohlcv/today");
  const markets = await axios.get("https://api.coinpaprika.com/v1/coins/runes-runebase/markets");

  const bololexRunesUsdtCh = await axios.get("https://api.bololex.com/api/prices/RUNES-USDT");
  const bololexRunesUsdtChangePercentColor = Number(bololexRunesUsdtCh.data.result[0].priceChange) > 0 ? 'green' : 'red';
  const bololexRunesUsdtChangePercentUniCode = Number(bololexRunesUsdtCh.data.result[0].priceChange) > 0 ? '&#9650;' : '&#9660;';

  const bololexRunesBtcCh = await axios.get("https://api.bololex.com/api/prices/RUNES-BTC");
  const bololexRunesBtcChangePercentColor = Number(bololexRunesBtcCh.data.result[0].priceChange) > 0 ? 'green' : 'red';
  const bololexRunesBtcChangePercentUniCode = Number(bololexRunesBtcCh.data.result[0].priceChange) > 0 ? '&#9650;' : '&#9660;';

  const altmarketsRunesDogeCh = await axios.get("https://v2.altmarkets.io/api/v2/peatio/public/markets/runesdoge/tickers");
  // console.log(altmarketsRunesDogeCh);
  let altmarketsruneDogePriceChange;
  altmarketsruneDogePriceChange = altmarketsRunesDogeCh.data.ticker.price_change_percent.replace(/%/gi, '');
  altmarketsruneDogePriceChange = altmarketsRunesDogeCh.data.ticker.price_change_percent.replace(/\+/gi, '');
  const altmarketsRunesDogeChangePercentColor = Number(altmarketsruneDogePriceChange) > 0 ? 'green' : 'red';
  const altmarketsRunesDogeChangePercentUniCode = Number(altmarketsruneDogePriceChange) > 0 ? '&#9650;' : '&#9660;';

  const txbitRunesBtcCh = await axios.get("https://api.txbit.io/api/public/getmarketsummary?market=RUNES/BTC");
  const isIncreaseOrDecreaceTxBitBTC = ((getPercentageChange(txbitRunesBtcCh.data.result.PrevDay, txbitRunesBtcCh.data.result.Last) * -1)).toFixed(2);
  const txbitRunesBtcChangePercentColor = Number(isIncreaseOrDecreaceTxBitBTC) > 0 ? 'green' : 'red';
  const txbitRunesBtcChangePercentUniCode = Number(isIncreaseOrDecreaceTxBitBTC) > 0 ? '&#9650;' : '&#9660;';

  const txbitRunesEthCh = await axios.get("https://api.txbit.io/api/public/getmarketsummary?market=RUNES/ETH");
  const isIncreaseOrDecreaceTxBitETH = ((getPercentageChange(txbitRunesEthCh.data.result.PrevDay, txbitRunesEthCh.data.result.Last) * -1)).toFixed(2);
  const txbitRunesEthChangePercentColor = Number(isIncreaseOrDecreaceTxBitETH) > 0 ? 'green' : 'red';
  const txbitRunesEthChangePercentUniCode = Number(isIncreaseOrDecreaceTxBitETH) > 0 ? '&#9650;' : '&#9660;';

  const openExchangeOptions = {
    method: 'GET',
    url: 'https://openexchangerates.org/api/latest.json?app_id=7fe614bf9a0f4d8cb7dd72a468a9ef59&show_alternative=1',
  };

  const currencyCoversion = await axios.request(openExchangeOptions);

  const changePercentColor = dataOne.data.quotes.USD.percent_change_24h > 0 ? 'green' : 'red';
  const changePercentUniCode = dataOne.data.quotes.USD.percent_change_24h > 0 ? '&#9650;' : '&#9660;';

  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    let price;
    let low;
    let high;
    let open;
    if (user.country.currency.iso !== 'USD') {
      price = (Number(dataOne.data.quotes.USD.price) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])).toFixed(8).toString();
      low = (Number(dataTwo.data[0].low) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])).toFixed(8).toString();
      high = (Number(dataTwo.data[0].high) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])).toFixed(8).toString();
      open = (Number(dataTwo.data[0].open) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])).toFixed(8).toString();
    } else {
      price = dataOne.data[0].quotes.USD.price.toFixed(8).toString();
      low = dataTwo.data[0].low.toFixed(8).toString();
      high = dataTwo.data[0].high.toFixed(8).toString();
      open = dataTwo.data[0].open.toFixed(8).toString();
    }

    const returnValue = (high - low).toFixed(8).toString();
    const returnColor = returnValue > 0 ? 'green' : 'red';
    const returnUniCode = returnValue > 0 ? '&#9650;' : '&#9660;';
    // const available = user && user.wallet ? user.wallet.availble : 0;
    // const locked = user && user.wallet ? user.wallet.locked : 0;
    console.log('before message changing');

    let newtitle = req.body.title.replace(/\[firstname\]/gi, user.firstname);
    newtitle = newtitle.replace(/\[lastname\]/gi, user.lastname);
    newtitle = newtitle.replace(/\[username\]/gi, user.username);
    newtitle = newtitle.replace(/\[country_iso\]/gi, user && user.country && user.country.iso);
    newtitle = newtitle.replace(/\[country_name\]/gi, user && user.country && user.country.name);
    newtitle = newtitle.replace(/\[currency_iso\]/gi, user && user.country && user.country.currency ? user.country.currency.iso : '');
    newtitle = newtitle.replace(/\[currency_name\]/gi, user && user.country && user.country.currency ? user.country.currency.currency_name : '');
    newtitle = newtitle.replace(/\[referral\]/gi, `https://www.localrunes.com/signup?referredby=${user.username}`);
    newtitle = newtitle.replace(/\[wallet_balance\]/gi, `${(((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8)} RUNES`);
    newtitle = newtitle.replace(/\[wallet_value\]/gi, `~${((((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8) * ((Number(dataOne.data.quotes.USD.price) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])))).toFixed(8).toString()} ${user && user.country && user.country.currency && user.country.currency.iso}`);
    newtitle = newtitle.replace(/\[wallet_value_usd\]/gi, `~${((((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8) * Number(dataOne.data.quotes.USD.price)).toFixed(8).toString()} USD`);

    let newMessage;
    newMessage = req.body.message.replace(/\n/g, "<br />");
    newMessage = newMessage.replace(/\[firstname\]/gi, user.firstname);
    newMessage = newMessage.replace(/\[lastname\]/gi, user.lastname);
    newMessage = newMessage.replace(/\[username\]/gi, user.username);
    newMessage = newMessage.replace(/\[country_iso\]/gi, user && user.country && user.country.iso);
    newMessage = newMessage.replace(/\[country_name\]/gi, user && user.country && user.country.name);
    newMessage = newMessage.replace(/\[currency_iso\]/gi, user && user.country && user.country.currency ? user.country.currency.iso : '');
    newMessage = newMessage.replace(/\[currency_name\]/gi, user && user.country && user.country.currency ? user.country.currency.currency_name : '');
    newMessage = newMessage.replace(/\[referral\]/gi, `https://www.localrunes.com/signup?referredby=${user.username}`);
    newMessage = newMessage.replace(/\[wallet_balance\]/gi, `${(((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8)} RUNES`);
    newMessage = newMessage.replace(/\[wallet_value\]/gi, `~${((((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8) * ((Number(dataOne.data.quotes.USD.price) * Number(currencyCoversion.data.rates[user && user.country && user.country.currency ? user.country.currency.iso : 'USD'])))).toFixed(8).toString()} ${user && user.country && user.country.currency && user.country.currency.iso}`);
    newMessage = newMessage.replace(/\[wallet_value_usd\]/gi, `~${((((user && user.wallet ? user.wallet.available : 0) + (user && user.wallet ? user.wallet.locked : 0)) / 1e8) * Number(dataOne.data.quotes.USD.price)).toFixed(8).toString()} USD`);
    newMessage = newMessage.replace(/\[wallet_android\]/gi, `
        <div style="width: 100%;">
          <div style="width: 100%; color: black">
            <div style="width: 100%; font-size: 20px;">Download Android Wallet</div>
          </div>        
          <div style="width: 100%;">
            <a href="https://play.google.com/store/apps/details?id=org.runebase.wallet">
              <img style="width: 150px" src="https://downloads.runebase.io/google-play-store.png">
            </a>
          </div>
        </div>
      `);

    newMessage = newMessage.replace(/\[metrics\]/gi, `
      <table width="100%" align="center" style="width:100%; color: black;">
        <tr>
          <td>
            <div style="width: 100%; color: black">
              <div style="width: 100%; font-size: 20px;">Key Metrics</div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">24h low</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold;">${low && low} ${user && user.country && user.country.currency && user.country.currency.iso}</div>
          </td>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">24h high</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold;">${high && high} ${user && user.country && user.country.currency && user.country.currency.iso}</div>
          </td>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">24h open</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold;">${open && open} ${user && user.country && user.country.currency && user.country.currency.iso}</div>
          </td>
        </tr>
        <tr>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">Current Price</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold;">${price && price} ${user && user.country && user.country.currency && user.country.currency.iso}</div>
          </td>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">24h change</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold; color: ${changePercentColor && changePercentColor}">${changePercentUniCode && changePercentUniCode} ${dataOne && dataOne.data && dataOne.data.quotes && dataOne.data.quotes.USD.percent_change_24h} %</div>
          </td>
          <td style="border: 2px solid black; text-align: center;">
            <div style="width: 100%; font-size: 18px; text-decoration: underline;">24h returns</div>
            <div style="width: 100%; font-size: 14px; font-weight:bold; color: ${returnColor && returnColor}">${returnUniCode && returnUniCode} ${returnValue && returnValue} ${user && user.country && user.country.currency && user.country.currency.iso}</div>
          </td>
        </tr>
        </table>      
      `);

    newMessage = newMessage.replace(/\[socials\]/gi, `
      <div style="width: 100%;">
        <a href="https://www.facebook.com/localrunes"><img style="width: 75px;" src="https://downloads.runebase.io/facebook.png"></a>
        <a href="https://t.me/localrunes"><img style="width: 75px;" src="https://downloads.runebase.io/telegram.png"></a>
        <a href="https://twitter.com/LocalRunes"><img style="width: 75px;" src="https://downloads.runebase.io/twitter.png"></a>
      </div>
      `);

    const bololexRunesUsdt = markets.data.filter((item) => item.exchange_name === 'Bololex' && item.pair === 'RUNES/USDT');
    const bololexRunesUsdtPrice = user && user.country && user.country.currency && user.country.currency.iso !== 'USD'
      ? ((bololexRunesUsdt[0].quotes.USD.price) * Number(currencyCoversion.data.rates[
        user
          && user.country
          && user.country.currency
          ? user.country.currency.iso
          : 'USD'
      ])).toFixed(8).toString()
      : bololexRunesUsdt[0].quotes.USD.price.toFixed(8).toString();

    const bololexRunesBtc = markets.data.filter((item) => item.exchange_name === 'Bololex' && item.pair === 'RUNES/BTC');
    const bololexRunesBtcPrice = user && user.country && user.country.currency && user.country.currency.iso !== 'USD'
      ? ((bololexRunesBtc[0].quotes.USD.price) * Number(currencyCoversion.data.rates[
        user
          && user.country
          && user.country.currency
          ? user.country.currency.iso
          : 'USD'
      ])).toFixed(8).toString()
      : bololexRunesBtc[0].quotes.USD.price.toFixed(8).toString();

    const altmarketsRunesDoge = markets.data.filter((item) => item.exchange_name === 'AltMarkets' && item.pair === 'RUNES/DOGE');
    const altmarketsRunesDogePrice = user && user.country && user.country.currency && user.country.currency.iso !== 'USD'
      ? ((altmarketsRunesDoge[0].quotes.USD.price) * Number(currencyCoversion.data.rates[
        user
          && user.country
          && user.country.currency
          ? user.country.currency.iso
          : 'USD'
      ])).toFixed(8).toString()
      : altmarketsRunesDoge[0].quotes.USD.price.toFixed(8).toString();

    const txbitRunesBtc = markets.data.filter((item) => item.exchange_name === 'Txbit' && item.pair === 'RUNES/BTC');
    const txbitRunesBtcPrice = user && user.country && user.country.currency && user.country.currency.iso !== 'USD'
      ? ((txbitRunesBtc[0].quotes.USD.price) * Number(currencyCoversion.data.rates[
        user
          && user.country
          && user.country.currency
          ? user.country.currency.iso
          : 'USD'
      ])).toFixed(8).toString()
      : txbitRunesBtc[0].quotes.USD.price.toFixed(8).toString();

    const txbitRunesEth = markets.data.filter((item) => item.exchange_name === 'Txbit' && item.pair === 'RUNES/ETH');
    const txbitRunesEthPrice = user && user.country && user.country.currency && user.country.currency.iso !== 'USD'
      ? ((txbitRunesEth[0].quotes.USD.price) * Number(currencyCoversion.data.rates[
        user
          && user.country
          && user.country.currency
          ? user.country.currency.iso
          : 'USD'
      ])).toFixed(8).toString()
      : txbitRunesEth[0].quotes.USD.price.toFixed(8).toString();

    newMessage = newMessage.replace(/\[markets\]/gi, `
      <div style="width: 100%;">
        <p style="width: 100%; text-decoration: underline; font-size: 20px; margin-bottom: 5px;">Trade RUNES on Exchanges</p>
        <table cellspacing="0" width="100%" align="center" style="width:100%; color: black;">
          <tr>
            <th style="background: #ccc; border: 1px solid black">Pair</th>
            <th style="background: #ccc; border: 1px solid black">24h Change</th>
            <th style="background: #ccc; border: 1px solid black">Trade</th>
          </tr>
          <tr>
            <td style="text-align: center; border-bottom: 1px solid black; margin: 0;">
              <img style="width: 30px; height: 30px; margin-top: 5px;" src="https://downloads.runebase.io/bololex-thumb-2.png">
              <p style="font-size: 18px; margin: 0;">RUNES/USDT</p>
              <p style="margin-top: 0; margin-bottom: 5px">
                ${bololexRunesUsdtPrice && bololexRunesUsdtPrice} ${
  user
                  && user.country
                  && user.country.currency
                  && user.country.currency.iso
}
              </p>              
            </td>
            <td style="font-size: 18px; text-align: center; border-bottom: 1px solid black; color: ${bololexRunesUsdtChangePercentColor && bololexRunesUsdtChangePercentColor}">
              ${bololexRunesUsdtChangePercentUniCode && bololexRunesUsdtChangePercentUniCode} ${
  bololexRunesUsdtCh
                && bololexRunesUsdtCh.data
                && bololexRunesUsdtCh.data.result
                && bololexRunesUsdtCh.data.result[0].priceChange}%
            </td>
            <td style="text-align: center; border-bottom: 1px solid black">
              <a 
                href="https://bololex.com/trading/?symbol=RUNES-USDT" 
                target="_blank" 
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 3px; background-color: #EB7035; border-top: 12px solid #EB7035; border-bottom: 12px solid #EB7035; border-right: 18px solid #EB7035; border-left: 18px solid #EB7035; display: inline-block;"
              >
                Trade on Bololex &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="text-align: center; border-bottom: 1px solid black; margin: 0;">
              <img style="width: 30px; height: 30px; margin-top: 5px;" src="https://downloads.runebase.io/bololex-thumb-2.png">
              <p style="font-size: 18px; margin: 0;">RUNES/BTC</p>
              <p style="margin-top: 0; margin-bottom: 5px">
                ${bololexRunesBtcPrice && bololexRunesBtcPrice} ${
  user
                  && user.country
                  && user.country.currency
                  && user.country.currency.iso
}
              </p>              
            </td>
            <td style="font-size: 18px; text-align: center; border-bottom: 1px solid black; color: ${bololexRunesBtcChangePercentColor && bololexRunesBtcChangePercentColor}">
            ${bololexRunesBtcChangePercentUniCode && bololexRunesBtcChangePercentUniCode} ${
  bololexRunesBtcCh
              && bololexRunesBtcCh.data
              && bololexRunesBtcCh.data.result
              && bololexRunesBtcCh.data.result[0].priceChange}%
            </td>
            <td style="text-align: center; border-bottom: 1px solid black">
              <a 
                href="https://bololex.com/trading/?symbol=RUNES-BTC" 
                target="_blank" 
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 3px; background-color: #EB7035; border-top: 12px solid #EB7035; border-bottom: 12px solid #EB7035; border-right: 18px solid #EB7035; border-left: 18px solid #EB7035; display: inline-block;"
              >
                Trade on Bololex &rarr;
              </a>
            </td>
          </tr>


          <tr>
            <td style="text-align: center; border-bottom: 1px solid black; margin: 0;">
              <img style="width: 30px; height: 30px; margin-top: 5px;" src="https://downloads.runebase.io/altmarkets-thumb-2.png">
              <p style="font-size: 18px; margin: 0;">RUNES/DOGE</p>
              <p style="margin-top: 0; margin-bottom: 5px">
                ${altmarketsRunesDogePrice && altmarketsRunesDogePrice} ${
  user
                  && user.country
                  && user.country.currency
                  && user.country.currency.iso
}
              </p>              
            </td>
            <td style="font-size: 18px; text-align: center; border-bottom: 1px solid black; color: ${altmarketsRunesDogeChangePercentColor && altmarketsRunesDogeChangePercentColor}">
            ${altmarketsRunesDogeChangePercentUniCode && altmarketsRunesDogeChangePercentUniCode} ${altmarketsruneDogePriceChange && altmarketsruneDogePriceChange}
            </td>
            <td style="text-align: center; border-bottom: 1px solid black">
              <a 
                href="https://v2.altmarkets.io/trading/runesdoge" 
                target="_blank" 
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 3px; background-color: #EB7035; border-top: 12px solid #EB7035; border-bottom: 12px solid #EB7035; border-right: 18px solid #EB7035; border-left: 18px solid #EB7035; display: inline-block;"
              >
                Trade on Altmarkets &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="text-align: center; border-bottom: 1px solid black; margin: 0;">
              <img style="width: 30px; height: 30px; margin-top: 5px;" src="https://downloads.runebase.io/txbit-thumb-2.png">
              <p style="font-size: 18px; margin: 0;">RUNES/BTC</p>
              <p style="margin-top: 0; margin-bottom: 5px">
                ${txbitRunesBtcPrice} ${
  user
                  && user.country
                  && user.country.currency
                  && user.country.currency.iso}
              </p>              
            </td>
            <td style="font-size: 18px; text-align: center; border-bottom: 1px solid black; color: ${txbitRunesBtcChangePercentColor && txbitRunesBtcChangePercentColor}">
              ${txbitRunesBtcChangePercentUniCode && txbitRunesBtcChangePercentUniCode} ${isIncreaseOrDecreaceTxBitBTC && isIncreaseOrDecreaceTxBitBTC}%
            </td>
            <td style="text-align: center; border-bottom: 1px solid black">
              <a 
                href="https://txbit.io/Trade/RUNES/BTC" 
                target="_blank" 
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 3px; background-color: #EB7035; border-top: 12px solid #EB7035; border-bottom: 12px solid #EB7035; border-right: 18px solid #EB7035; border-left: 18px solid #EB7035; display: inline-block;"
              >
                Trade on Txbit &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="text-align: center; border-bottom: 1px solid black; margin: 0;">
              <img style="width: 30px; height: 30px; margin-top: 5px;" src="https://downloads.runebase.io/txbit-thumb-2.png">
              <p style="font-size: 18px; margin: 0;">RUNES/ETH</p>
              <p style="margin-top: 0; margin-bottom: 5px">
                ${txbitRunesEthPrice && txbitRunesEthPrice} ${
  user
                  && user.country
                  && user.country.currency
                  && user.country.currency.iso
}
              </p>              
            </td>
            <td style="font-size: 18px; text-align: center; border-bottom: 1px solid black; color: ${txbitRunesEthChangePercentColor && txbitRunesEthChangePercentColor}">
              ${txbitRunesEthChangePercentUniCode && txbitRunesEthChangePercentUniCode} ${isIncreaseOrDecreaceTxBitETH && isIncreaseOrDecreaceTxBitETH}%
            </td>
            <td style="text-align: center; border-bottom: 1px solid black">
              <a 
                href="https://txbit.io/Trade/RUNES/ETH" 
                target="_blank" 
                style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 3px; background-color: #EB7035; border-top: 12px solid #EB7035; border-bottom: 12px solid #EB7035; border-right: 18px solid #EB7035; border-left: 18px solid #EB7035; display: inline-block;"
              >
                Trade on Txbit &rarr;
              </a>
            </td>
          </tr>
        </table>
      </div>
      `);

    const fixColorDivFront = ``;
    const fixColorDivBack = "";
    const finalMessage = fixColorDivFront.concat(newMessage).concat(fixColorDivBack);
    // console.log('newtitle');
    // console.log(newtitle);
    // console.log('finalMessage');
    // console.log(finalMessage);
    console.log('before sned');
    await transporter.verify((error, success) => {
      if (error) {
        console.log('failed to verify');
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    await transporter.sendMail({
      from: `LocalRunes <${process.env.MAIL_USER}>`, // sender address
      to: user.email, // list of receivers
      subject: newtitle, // Subject line
      // text: "Hello world?", // plain text body
      html: finalMessage, // html body
    });
  }
  console.log('after send');

  // console.log('123');
  // console.log(req.body);
  res.locals.mail = 'ok';
  next();
};
