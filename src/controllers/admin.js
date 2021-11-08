import nodemailer from 'nodemailer';
// import axios from 'axios';
import db from '../models';

const { MessageEmbed, MessageAttachment } = require('discord.js');

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
export const withdrawTelegramAdminAccept = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('1');

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
    console.log('2');
    if (!transaction) {
      ctx.reply('Transaction not found');
    }
    if (transaction) {
      console.log('3');
      const amount = ((transaction.amount - (1 * 1e7)) / 1e8);
      console.log('4');
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
      const activity = await db.activity.create(
        {
          spenderId: transaction.address.wallet.userId,
          type: 'withdrawAccepted',
          transactionId: transaction.id,
        },
        {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
      console.log('startswith crap');
      console.log(transaction.address.wallet.user.user_id.startsWith('discord-'));
      if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
        const newUserId = transaction.address.wallet.user.user_id.replace('discord-', '');
        console.log('before my  client');
        const myClient = await discordClient.users.fetch(newUserId, false);
        console.log('after my client');
        console.log(myClient);
        const userNotFoundMessage = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Withdraw')
          .setDescription(`Your withdrawal has been accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await myClient.send({ embeds: [userNotFoundMessage] });
      }
      if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
        bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`);
      }
      bot.telegram.sendMessage(adminTelegramId, `Withdrawal Accepted
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

export const withdrawTelegramAdminDecline = async (bot, ctx, adminTelegramId, withdrawalId, runesGroup, discordClient) => {
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

    const newUserId = transaction.address.wallet.user.user_id.replace('discord-', '');
    const myClient = await discordClient.users.fetch(newUserId, false);

    if (!transaction) {
      // ctx.reply('Transaction not found');
      const walletnotfoundmessagne = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Withdraw')
        .setDescription(`Transaction not found`)
        .setTimestamp()
        .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
      await myClient.send({ embeds: [walletnotfoundmessagne] });
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
        const walletnotfoundmessagne = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Withdraw')
          .setDescription(`Wallet not found`)
          .setTimestamp()
          .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
        await myClient.send({ embeds: [walletnotfoundmessagne] });
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
        const activity = await db.activity.create(
          {
            spenderId: transaction.address.wallet.userId,
            type: 'withdrawRejected',
            transactionId: updatedTransaction.id,
          },
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          },
        );
        if (transaction.address.wallet.user.user_id.startsWith('discord-')) {
          const userNotFoundMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Withdraw')
            .setDescription(`Your withdrawal has been rejected`)
            .setTimestamp()
            .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');
          await myClient.send({ embeds: [userNotFoundMessage] });
        }
        if (transaction.address.wallet.user.user_id.startsWith('telegram-')) {
          bot.telegram.sendMessage(runesGroup, `${transaction.address.wallet.user.username}'s withdrawal has been rejected`);
        }
        bot.telegram.sendMessage(adminTelegramId, `Withdrawal Rejected`);
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

    const response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
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
        transactionId: transaction.id,
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
        transactionId: res.locals.transaction.id,
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
