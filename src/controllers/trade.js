import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const BigNumber = require('bignumber.js');

const fee = 1;

/**
 * Fetch PriceInfo
 */
export const startTrade = async (req, res, next) => {
  console.log('123');
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const postAd = await db.postAd.findOne({
      where: {
        id: req.body.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (req.user.id === postAd.userId) {
      throw new Error('CANT_TRADE_WITH_SELF');
    }
    // did Users Block eachother?
    const userOne = await db.blocked.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: db.user,
          as: 'userBlock',
          required: true,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'userBlocked',
          required: true,
          attributes: ['username'],
        },
      ],
    });
    const hasUserOneBlocked = userOne.filter((object) => object.blockedId === postAd.userId);
    if (hasUserOneBlocked && hasUserOneBlocked.length) {
      throw new Error('YOU_BLOCKED_USER');
    }
    const userTwo = await db.blocked.findAll({
      where: {
        userId: postAd.userId,
      },
      include: [
        {
          model: db.user,
          as: 'userBlock',
          required: true,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'userBlocked',
          required: true,
          attributes: ['username'],
        },
      ],
    });
    // console.log(userTwo);
    const hasUserTwoBlocked = userTwo.filter((object) => object.blockedId === req.user.id);
    if (hasUserTwoBlocked && hasUserTwoBlocked.length) {
      throw new Error('USER_BLOCKED_YOU');
    }
    //
    const tradeExits = await db.trade.findOne({
      where: {
        userId: req.user.id,
        postAdId: postAd.id,
        [Op.not]: [
          {
            type: [
              'done',
              'disputedDone',
              'canceled',
            ],
          },
        ],
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (tradeExits) {
      throw new Error('TRADE_ALREADY_EXIST');
    }

    const trade = await db.trade.create({
      userId: req.user.id,
      postAdId: postAd.id,
      type: 'init',
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // ADD INIT ACTIVITY

    if (postAd.type === 'buy') {
      const activity = await db.activity.create({
        tradeId: trade.id,
        spenderId: postAd.userId,
        earnerId: trade.userId,
        type: 'buyTradeInit',
        ipId: res.locals.ip[0].id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (postAd.type === 'sell') {
      const activity = await db.activity.create({
        tradeId: trade.id,
        spenderId: trade.userId,
        earnerId: postAd.userId,
        type: 'sellTradeInit',
        ipId: res.locals.ip[0].id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    res.locals.trade = trade;
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const tradeInit = async (req, res, next) => {

};

export const tradeAccept = async (req, res, next) => {

};

export const tradeDispute = async (req, res, next) => {

};

export const tradeDone = async (req, res, next) => {

};

export const fetchTrade = async (req, res, next) => {
  const trade = await db.trade.findAll({
    where: {
      userId: req.user.id,
      [Op.not]: [
        {
          type: [
            'done',
            'disputedDone',
            'canceled',
          ],
        },
      ],
    },
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
            model: db.user,
            as: 'user',
            required: true,
            attributes: ['username'],
          },
        ],
      },
    ],
  });
  const tradeTwo = await db.trade.findAll({
    where: {
      [Op.not]: [
        {
          type: [
            'done',
            'init',
            'disputedDone',
            'canceled',
          ],
        },
      ],
    },
    include: [
      {
        model: db.postAd,
        as: 'postAd',
        required: true,
        where: {
          userId: req.user.id,
        },
        // attributes: ['username'],
      },
    ],
  });
  res.locals.trade = trade.concat(tradeTwo);
  next();
};

export const fetchCurrentTrade = async (req, res, next) => {
  console.log(req.body.id);
  const trade = await db.trade.findOne({
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
  });
  if (trade.userId === req.user.id) {
    res.locals.trade = trade;
    return next();
  }
  if (trade.postAd.userId === req.user.id) {
    res.locals.trade = trade;
    return next();
  }
  if (req.user.role === 4) {
    res.locals.trade = trade;
    return next();
  }
  res.locals.error = "TRADE_NOT_FOUND";
  next();
};

export const secondTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(req.body.obj.amount);
    const amount = new BigNumber(req.body.obj.amount).times(1e8).toNumber();

    if (amount < (5 * 1e8)) { // smaller then 5 RUNES
      throw new Error('MINIMUM_AMOUNT_5_RUNES');
    }

    if (amount % 1 !== 0) {
      throw new Error('MAX_8_DECIMALS');
    }

    const trade = await db.trade.findOne({
      where: {
        userId: req.user.id,
        id: req.body.id,
        type: 'init',
      },
      include: [
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
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!trade) {
      throw new Error('TRADE_NOT_FOUND');
    }
    if (amount < trade.postAd.min) {
      throw new Error('BELOW_MIN_AMOUNT');
    }
    if (amount > trade.postAd.max) {
      throw new Error('ABOVE_MAX_AMOUNT');
    }
    console.log(req.body);
    console.log('sponse timer');
    console.log(req.body.obj.repondTime);
    console.log(new Date(Date.now));
    // const endDate = new Date(new Date(Date.now).valueOf() + (Number(req.body.obj.repondTime) * 60 * 1000));
    const endDate = new Date(new Date().valueOf() + (Number(req.body.obj.repondTime) * 60 * 1000)); // (7 * 24 * 60 * 60 * 1000)
    console.log(endDate);
    console.log(trade);
    if (trade.postAd.priceType === 'static') {
      await trade.update({
        type: 'requested',
        reponseTime: endDate,
        amount,
        price: trade.postAd.price,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (trade.postAd.priceType === 'margin') {
      const margin = (trade.postAd.margin / 1e2);

      const tradePriceIndex = await db.priceInfo.findOne({
        where: {
          currency: trade.postAd.currency.iso,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!tradePriceIndex) {
        throw new Error('PRICE_RECORD_NOT_FOUND');
      }

      const tradePrice = (((tradePriceIndex.price / 100) * margin) * 1e8).toFixed(0);
      console.log('tradePrice');
      console.log(tradePriceIndex);
      console.log(margin);
      console.log(tradePrice);

      if (trade.postAd.type === 'buy') {
        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.postAd.userId,
          earnerId: trade.userId,
          amounnt: trade.amount,
          type: 'buyTradeRequested',
          ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }

      if (trade.postAd.type === 'sell') {
        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.userId,
          earnerId: trade.postAd.userId,
          amounnt: trade.amount,
          type: 'sellTradeRequested',
          ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }

      await trade.update({
        type: 'requested',
        reponseTime: endDate,
        amount,
        price: tradePrice,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    console.log(endDate);
    console.log(trade);

    res.locals.trade = trade;
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const cancelCurrentTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.postAd,
          as: 'postAd',
          required: true,
          // attributes: ['username'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!trade) {
      throw new Error('TRADE_NOT_FOUND');
    }
    if (trade.userId === req.user.id) {
      if (trade.type === "init") {
        await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (trade.postAd.type === 'buy') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.postAd.userId,
            earnerId: trade.userId,
            type: 'buyTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        if (trade.postAd.type === 'sell') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.userId,
            earnerId: trade.postAd.userId,
            type: 'sellTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        res.locals.trade = trade;
        return next();
      }
      if (trade.type === "requested") {
        await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (trade.postAd.type === 'buy') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.postAd.userId,
            earnerId: trade.userId,
            type: 'buyTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        if (trade.postAd.type === 'sell') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.userId,
            earnerId: trade.postAd.userId,
            type: 'sellTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        res.locals.trade = trade;
        return next();
      }
    }
    if (trade.postAd.userId === req.user.id) {
      if (trade.type === "init") {
        await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (trade.postAd.type === 'buy') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.postAd.userId,
            earnerId: trade.userId,
            type: 'buyTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        if (trade.postAd.type === 'sell') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.userId,
            earnerId: trade.postAd.userId,
            type: 'sellTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        res.locals.trade = trade;
        return next();
      }
      if (trade.type === "requested") {
        await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (trade.postAd.type === 'buy') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.postAd.userId,
            earnerId: trade.userId,
            type: 'buyTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        if (trade.postAd.type === 'sell') {
          const activity = await db.activity.create({
            tradeId: trade.id,
            spenderId: trade.userId,
            earnerId: trade.postAd.userId,
            type: 'sellTradeCanceled',
            ipId: res.locals.ip[0].id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        res.locals.trade = trade;
        return next();
      }
    }
    res.locals.error = "UNABLE_TO_CANCEL_TRADE";
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const acceptCurrentTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(req.body);
    console.log(req.user.id);

    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'requested',
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
          where: {
            userId: req.user.id,
          },
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
      res.locals.error = "UNABLE_TO_FIND_TRADE";
      return next();
    }
    const newTrade = await trade.update({
      type: 'accepted',
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.trade = newTrade;

    console.log(newTrade);

    if (trade.postAd.type === 'sell') {
      const walletBuy = await db.wallet.findOne({
        where: {
          userId: trade.postAd.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (trade.amount > walletBuy.available) {
        console.log('not enough funds');
        throw new Error('NOT_ENOUGH_FUNDS');
      }

      res.locals.wallet = await walletBuy.update({
        available: walletBuy.available - trade.amount,
        locked: walletBuy.locked + trade.amount,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const activity = await db.activity.create({
        tradeId: trade.id,
        spenderId: trade.postAd.userId,
        earnerId: trade.userId,
        amount: trade.amount,
        spender_balance: walletBuy.available + walletBuy.locked,
        type: 'sellTradeStart',
        ipId: res.locals.ip[0].id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      return next();
    }

    if (trade.postAd.type === 'buy') {
      const walletSell = await db.wallet.findOne({
        where: {
          userId: trade.userId,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (trade.amount > walletSell.available) {
        console.log('not enough funds');
        throw new Error('NOT_ENOUGH_FUNDS');
      }

      res.locals.wallet = await walletSell.update({
        available: walletSell.available - trade.amount,
        locked: walletSell.locked + trade.amount,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const activity = await db.activity.create({
        tradeId: trade.id,
        spenderId: trade.userId,
        earnerId: trade.postAd.userId,
        amount: trade.amount,
        spender_balance: walletSell.available + walletSell.locked,
        type: 'buyTradeStart',
        ipId: res.locals.ip[0].id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      return next();
    }

    res.locals.error = "UNABLE_TO_ACCEPT_TRADE";
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const acceptCurrentMainTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(req.body);
    console.log(req.user.id);

    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'accepted',
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
      res.locals.error = "UNABLE_TO_FIND_TRADE";
      return next();
    }

    if (trade.postAd.userId === req.user.id) {
      if (trade.userOneCancel) {
        res.locals.error = "UNABLE_TO_COMPLETE_CANCELED_TRADE";
        return next();
      }
    }
    if (trade.userId === req.user.id) {
      if (trade.userTwoCancel) {
        res.locals.error = "UNABLE_TO_COMPLETE_CANCELED_TRADE";
        return next();
      }
    }

    if (trade.postAd.userId === req.user.id) {
      console.log('123');
      if (trade.userOneComplete) {
        console.log('trade.userOneComplete');
        res.locals.trade = await trade.update({
          userOneComplete: false,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      } else if (!trade.userOneComplete) {
        res.locals.trade = await trade.update({
          userOneComplete: true,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      // res.locals.trade = "accepted";
    }

    if (trade.userId === req.user.id) {
      console.log('123');
      if (trade.userTwoComplete) {
        res.locals.trade = await trade.update({
          userTwoComplete: false,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      } else if (!trade.userTwoComplete) {
        res.locals.trade = await trade.update({
          userTwoComplete: true,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      // res.locals.trade = "accepted";
    }

    // fee to deduct
    const FeeToDeduct = ((trade.amount / 100) * fee);
    const referralCut = ((FeeToDeduct / 100) * 50);
    //

    if (trade.userOneComplete && trade.userTwoComplete) {
      if (trade.postAd.type === "buy") {
        const walletUserOneSell = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const walletUserTwoSell = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (trade.amount > walletUserTwoSell.locked) {
          console.log('not enough locked funds');
          throw new Error('NOT_ENOUGH_LOCKED_FUNDS');
        }

        res.locals.walletUserTwo = await walletUserTwoSell.update({
          locked: walletUserTwoSell.locked - trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        res.locals.walletUserOne = await walletUserOneSell.update({
          available: ((walletUserOneSell.available + trade.amount) - FeeToDeduct),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.userId,
          earnerId: trade.postAd.userId,
          spender_balance: res.locals.walletUserTwo.available + res.locals.walletUserTwo.locked,
          earner_balance: res.locals.walletUserOne.available + res.locals.walletUserOne.locked,
          type: 'buyTradeComplete',
          amount: trade.amount,
          // ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        // Add Referral Commission
        // Fetch Referral
        const isReferredUserTrade = await db.Referrals.findOne({
          where: {
            referrerID: trade.userId,
          },
          include: [
            {
              model: db.user,
              as: 'userReferred',
              attributes: [
                'id',
                'username',
              ],
              include: [
                {
                  model: db.wallet,
                  as: 'wallet',
                },
              ],
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const isReferredUserTradePostAd = await db.Referrals.findOne({
          where: {
            referrerID: trade.postAd.userId,
          },
          include: [
            {
              model: db.user,
              as: 'userReferred',
              attributes: [
                'id',
                'username',
              ],
              include: [
                {
                  model: db.wallet,
                  as: 'wallet',
                },
              ],
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (isReferredUserTrade) {
          console.log(isReferredUserTrade.userReferred.wallet);
          await isReferredUserTrade.update({
            earned: isReferredUserTrade.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          res.locals.referredWallet1 = await isReferredUserTrade.userReferred.wallet.update({
            available: isReferredUserTrade.userReferred.wallet.available + referralCut,
            // earned: isReferredUserTrade.userReferred.wallet.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createReferredActivity1 = await db.activity.create({
            type: 'referralBonus',
            amount: referralCut,
            earnerId: res.locals.referredWallet1.userId,
            earner_balance: ((res.locals.referredWallet1.locked + res.locals.referredWallet1.available)),
            spenderId: isReferredUserTrade.referrerID,
            // orderId: ticket.order.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }

        if (isReferredUserTradePostAd) {
          await isReferredUserTradePostAd.update({
            earned: isReferredUserTradePostAd.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          res.locals.referredWallet2 = await isReferredUserTradePostAd.userReferred.wallet.update({
            available: isReferredUserTradePostAd.userReferred.wallet.available + referralCut,
            earned: isReferredUserTradePostAd.userReferred.wallet.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createReferredActivity2 = await db.activity.create({
            type: 'referralBonus',
            amount: referralCut,
            earnerId: res.locals.referredWallet2.userId,
            earner_balance: ((res.locals.referredWallet2.locked + res.locals.referredWallet2.available)),
            spenderId: isReferredUserTradePostAd.referrerID,
            // orderId: ticket.order.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        //

        //

        res.locals.trade = await trade.update({
          type: 'done',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const userVolumeOne = await db.user.findOne({
          where: {
            id: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const userVolumeTwo = await db.user.findOne({
          where: {
            id: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (userVolumeOne.firstTrade === null) {
          await userVolumeOne.update({
            volume: userVolumeOne.volume + trade.amount,
            tradeCount: userVolumeOne.tradeCount + 1,
            firstTrade: new Date(Date.now()),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        } else {
          await userVolumeOne.update({
            volume: userVolumeOne.volume + trade.amount,
            tradeCount: userVolumeOne.tradeCount + 1,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }

        if (userVolumeTwo.firstTrade === null) {
          await userVolumeTwo.update({
            volume: userVolumeTwo.volume + trade.amount,
            tradeCount: userVolumeTwo.tradeCount + 1,
            firstTrade: new Date(Date.now()),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        } else {
          await userVolumeTwo.update({
            volume: userVolumeTwo.volume + trade.amount,
            tradeCount: userVolumeTwo.tradeCount + 1,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
      }

      if (trade.postAd.type === "sell") {
        const walletUserOne = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const walletUserTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (trade.amount > walletUserTwo.locked) {
          console.log('not enough locked funds');
          throw new Error('NOT_ENOUGH_LOCKED_FUNDS');
        }

        res.locals.walletUserTwo = await walletUserTwo.update({
          locked: walletUserTwo.locked - trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        res.locals.walletUserOne = await walletUserOne.update({
          available: ((walletUserOne.available + trade.amount) - FeeToDeduct),
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.postAd.userId,
          earnerId: trade.userId,
          spender_balance: res.locals.walletUserTwo.available + res.locals.walletUserTwo.locked,
          earner_balance: res.locals.walletUserOne.available + res.locals.walletUserOne.locked,
          type: 'sellTradeComplete',
          amount: trade.amount,
          // ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        // Add Referral Commission
        // Fetch Referral
        const isReferredUserTrade = await db.Referrals.findOne({
          where: {
            referrerID: trade.userId,
          },
          include: [
            {
              model: db.user,
              as: 'userReferred',
              attributes: [
                'id',
                'username',
              ],
              include: [
                {
                  model: db.wallet,
                  as: 'wallet',
                },
              ],
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const isReferredUserTradePostAd = await db.Referrals.findOne({
          where: {
            referrerID: trade.postAd.userId,
          },
          include: [
            {
              model: db.user,
              as: 'userReferred',
              attributes: [
                'id',
                'username',
              ],
              include: [
                {
                  model: db.wallet,
                  as: 'wallet',
                },
              ],
            },
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (isReferredUserTrade) {
          console.log(isReferredUserTrade.userReferred.wallet);
          await isReferredUserTrade.update({
            earned: isReferredUserTrade.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          res.locals.referredWallet1 = await isReferredUserTrade.userReferred.wallet.update({
            available: isReferredUserTrade.userReferred.wallet.available + referralCut,
            // earned: isReferredUserTrade.userReferred.wallet.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createReferredActivity1 = await db.activity.create({
            type: 'referralBonus',
            amount: referralCut,
            earnerId: res.locals.referredWallet1.userId,
            earner_balance: ((res.locals.referredWallet1.locked + res.locals.referredWallet1.available)),
            spenderId: isReferredUserTrade.referrerID,
            // orderId: ticket.order.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }

        if (isReferredUserTradePostAd) {
          await isReferredUserTradePostAd.update({
            earned: isReferredUserTradePostAd.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          res.locals.referredWallet2 = await isReferredUserTradePostAd.userReferred.wallet.update({
            available: isReferredUserTradePostAd.userReferred.wallet.available + referralCut,
            earned: isReferredUserTradePostAd.userReferred.wallet.earned + referralCut,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          const createReferredActivity2 = await db.activity.create({
            type: 'referralBonus',
            amount: referralCut,
            earnerId: res.locals.referredWallet2.userId,
            earner_balance: ((res.locals.referredWallet2.locked + res.locals.referredWallet2.available)),
            spenderId: isReferredUserTradePostAd.referrerID,
            // orderId: ticket.order.id,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
        //

        res.locals.trade = await trade.update({
          type: 'done',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const userBuyVolumeOne = await db.user.findOne({
          where: {
            id: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const userBuyVolumeTwo = await db.user.findOne({
          where: {
            id: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (userBuyVolumeOne.firstTrade === null) {
          await userBuyVolumeOne.update({
            volume: userBuyVolumeOne.volume + trade.amount,
            tradeCount: userBuyVolumeOne.tradeCount + 1,
            firstTrade: new Date(Date.now()),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        } else {
          await userBuyVolumeOne.update({
            volume: userBuyVolumeOne.volume + trade.amount,
            tradeCount: userBuyVolumeOne.tradeCount + 1,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }

        if (userBuyVolumeTwo.firstTrade === null) {
          await userBuyVolumeTwo.update({
            volume: userBuyVolumeTwo.volume + trade.amount,
            tradeCount: userBuyVolumeTwo.tradeCount + 1,
            firstTrade: new Date(Date.now()),
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        } else {
          await userBuyVolumeTwo.update({
            volume: userBuyVolumeTwo.volume + trade.amount,
            tradeCount: userBuyVolumeTwo.tradeCount + 1,
          }, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
        }
      }
    }

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const cancelCurrentMainTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log(req.body);
    console.log(req.user.id);

    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'accepted',
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
      res.locals.error = "UNABLE_TO_FIND_TRADE";
      return next();
    }

    if (trade.postAd.userId === req.user.id) {
      if (trade.userOneComplete) {
        res.locals.error = "UNABLE_TO_COMPLETE_CANCELED_TRADE";
        return next();
      }
    }

    if (trade.userId === req.user.id) {
      if (trade.userTwoComplete) {
        res.locals.error = "UNABLE_TO_COMPLETE_CANCELED_TRADE";
        return next();
      }
    }

    if (trade.postAd.userId === req.user.id) {
      console.log('123');
      if (trade.userOneCancel) {
        console.log('trade.userOneComplete');
        res.locals.trade = await trade.update({
          userOneCancel: false,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      } else if (!trade.userOneCancel) {
        res.locals.trade = await trade.update({
          userOneCancel: true,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
    }

    if (trade.userId === req.user.id) {
      console.log('123');
      if (trade.userTwoCancel) {
        res.locals.trade = await trade.update({
          userTwoCancel: false,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      } else if (!trade.userTwoCancel) {
        res.locals.trade = await trade.update({
          userTwoCancel: true,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
    }

    if (trade.userOneCancel && trade.userTwoCancel) {
      if (trade.postAd.type === "buy") {
        const walletUserTwoSell = await db.wallet.findOne({
          where: {
            userId: trade.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (trade.amount < walletUserTwoSell.locked) {
          console.log('not enough locked funds');
          throw new Error('NOT_ENOUGH_LOCKED_FUNDS');
        }
        res.locals.walletUserTwo = await walletUserTwoSell.update({
          locked: walletUserTwoSell.locked - trade.amount,
          available: walletUserTwoSell.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.postAd.userId,
          earnerId: trade.userId,
          type: 'buyTradeCanceled',
          ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        res.locals.trade = await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
      if (trade.postAd.type === "sell") {
        const walletUserTwo = await db.wallet.findOne({
          where: {
            userId: trade.postAd.userId,
          },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (trade.amount < walletUserTwo.locked) {
          console.log('not enough locked funds');
          throw new Error('NOT_ENOUGH_LOCKED_FUNDS');
        }
        res.locals.walletUserTwo = await walletUserTwo.update({
          locked: walletUserTwo.locked - trade.amount,
          available: walletUserTwo.available + trade.amount,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        const activity = await db.activity.create({
          tradeId: trade.id,
          spenderId: trade.userId,
          earnerId: trade.postAd.userId,
          type: 'sellTradeCanceled',
          ipId: res.locals.ip[0].id,
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        res.locals.trade = await trade.update({
          type: 'canceled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
      }
    }

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

export const disputeTrade = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (!req.body.subject) {
      throw new Error('SUBJECT_REQUIRED');
    }
    if (!req.body.reason) {
      throw new Error('REASON_REQUIRED');
    }
    if (req.body.reason.toString().length > 1200) {
      throw new Error('REASON_LENGTH_TOO_LONG');
    }

    const trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'accepted',
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
      throw new Error('UNABLE_TO_FIND_TRADE');
    }
    console.log(trade.postAd.userId);
    console.log(trade.userId);
    console.log(req.user.id);

    console.log('trade');

    if (trade.postAd.userId !== req.user.id && trade.userId !== req.user.id) {
      throw new Error('UNABLE_TO_DISPUTE_TRADE');
    }

    const UpdatedTrade = await trade.update({
      type: 'disputed',
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const dispute = await db.dispute.create({
      tradeId: trade.id,
      initiatorId: req.user.id,
      subject: req.body.subject,
      reason: req.body.reason,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.trade = await db.trade.findOne({
      where: {
        id: req.body.id,
        type: 'disputed',
      },
      include: [
        {
          model: db.dispute,
          as: 'dispute',
          required: false,
          // attributes: ['username'],
          include: [
            {
              model: db.user,
              as: 'initiator',
              required: true,
              attributes: ['username'],
            },
          ],
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

    console.log(req.body.id);
    console.log(req.body.subject);
    console.log(req.body.reason);

    console.log('begin check disputed trade');

    console.log();
    console.log('einde check disputed trade');
    // if ()

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};
